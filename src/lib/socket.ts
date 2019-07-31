import { createSocket, Socket } from 'dgram'
import { EventEmitter } from 'events'
import { AbstractCommand } from '../commands/index'
import { ConnectionState, CommandType } from '../enums'
import { ResetSequenceNumberCommand } from '../commands/control/resetSeqNumberCommand'

export class ViscaSocket extends EventEmitter {
	private _debug = false
	private _reconnectTimer: NodeJS.Timer | undefined
	private _retransmitTimer: NodeJS.Timer | undefined
	private _connectionState: ConnectionState

	private _localPacketId = 0
	private _maxPacketID = 0xffffffff

	private _address: string
	private _port: number = 52381
	private _socket: Socket
	private _reconnectInterval = 5000

	private _inFlightTimeout = 1000
	private _maxRetries = 5
	private _lastReceivedAt: number = Date.now()
	private _inFlight: { packetId: number, lastSent: number, packet: Buffer, resent: number } | undefined
	private _queue: Array<{ packetId: number, packet: Buffer }> = []

	constructor (options: { address?: string, port?: number, debug?: boolean, log?: (...args) => void }) {
		super()
		this._address = options.address || this._address
		this._port = options.port || this._port
		this._debug = options.debug || false
		this.log = options.log || this.log

		this._createSocket()
	}

	public connect (address?: string, port?: number) {
		if (!this._reconnectTimer) {
			this._reconnectTimer = setInterval(() => {
				if (this._lastReceivedAt + this._reconnectInterval > Date.now()) return
				if (this._connectionState === ConnectionState.Connected) {
					this._connectionState = ConnectionState.Closed
					this.emit('disconnected', null, null)
				}
				this._localPacketId = 0
				this.log('reconnecting')
				if (this._address && this._port) {
					this._sendCommand(new ResetSequenceNumberCommand())
					this._connectionState = ConnectionState.Connecting
				}
			}, this._reconnectInterval)
		}
		if (!this._retransmitTimer) {
			this._retransmitTimer = setInterval(() => this._checkForRetransmit(), 50)
		}

		if (address) {
			this._address = address
		}
		if (port) {
			this._port = port
		}

		this._sendCommand(new ResetSequenceNumberCommand())
		this._connectionState = ConnectionState.Connecting
	}

	public disconnect () {
		return new Promise((resolve) => {
			if (this._connectionState === ConnectionState.Connected) {
				this._socket.close(() => {
					clearInterval(this._retransmitTimer as NodeJS.Timer)
					clearInterval(this._reconnectTimer as NodeJS.Timer)
					this._retransmitTimer = undefined
					this._reconnectTimer = undefined

					this._connectionState = ConnectionState.Closed
					this._createSocket()
					this.emit('disconnected')

					resolve()
				})
			} else {
				resolve()
			}
		})
	}

	public log (..._args: any[]): void {
		// Will be re-assigned by the top-level class.
	}

	get nextPacketId (): number {
		return this._localPacketId
	}

	public _sendCommand (command: AbstractCommand) {
		const buffer = Buffer.alloc(8)
		const payload = command.serialize()

		buffer.writeUInt16BE(command.commandType, 0)
		buffer.writeUInt16BE(payload.length, 2)
		buffer.writeUInt32BE(this._localPacketId, 4)

		this._queue.push({
			packetId: this._localPacketId,
			packet: Buffer.from([ buffer, payload ])
		})

		this._sendNextPacket()

		this._localPacketId = (this._localPacketId++) % this._maxPacketID
	}

	private _createSocket () {
		this._socket = createSocket('udp4')
		this._socket.bind()
		this._socket.on('message', (packet, rinfo) => this._receivePacket(packet, rinfo))
		this._socket.on('close', () => this.emit('disconnect'))
	}

	private _receivePacket (packet: Buffer, rinfo: any) {
		if (this._debug) this.log('RECV ', packet, rinfo)
		this._lastReceivedAt = Date.now()

		const type = packet.readUInt16BE(0)
		const length = packet.readUInt32BE(4)

		if (type === CommandType.ViscaReply) {
			// @todo: call parsing from command.
			if (length === 3 && packet.readUInt8(8) === 0x41) {
				// supposedly an ack
			} else if (length === 3 && packet.readUInt8(8) === 0x51) {
				// supposedly a completion
			} else if (length === 4 && packet.readUInt16BE(8) === 0x6002) {
				// supposedly a syntax error
			} else if (length === 3 && packet.readUInt16BE(8) === 0x6141) {
				// supposedly not executable
			} else {
				// maybe a inquisition reply?
			}
		} else if (type === CommandType.ControlReply) {
			this._connectionState = ConnectionState.Connected
			this.emit('connected')
		}

		this._inFlight = undefined
	}

	// private _parseCommand (buffer: Buffer, packetId?: number) {
	// 	const length = buffer.readUInt16BE(0)
	// 	const name = buffer.toString('ascii', 4, 8)

	// 	if (name === 'InCm') {
	// 		this.emit('connect')
	// 	}

	// 	// this.log('COMMAND', `${name}(${length})`, buffer.slice(0, length))
	// 	const cmd = this._commandParser.commandFromRawName(name)
	// 	if (cmd && typeof cmd.deserialize === 'function') {
	// 		try {
	// 			cmd.deserialize(buffer.slice(0, length).slice(8))
	// 			cmd.packetId = packetId || -1
	// 			this.emit('receivedStateChange', cmd)
	// 		} catch (e) {
	// 			this.emit('error', e)
	// 		}
	// 	}

	// 	if (buffer.length > length) {
	// 		this._parseCommand(buffer.slice(length), packetId)
	// 	}
	// }

	private _sendNextPacket () {
		if (this._inFlight) return

		const packet = this._queue.shift()

		if (packet) {
			this._inFlight = {
				...packet,
				lastSent: Date.now(),
				resent: 0
			}

			this._sendPacket(packet.packet)
		}
	}

	private _sendPacket (packet: Buffer) {
		if (this._debug) this.log('SEND ', packet)
		this._socket.send(packet, this._port, this._address)
	}

	private _checkForRetransmit () {
		if (this._inFlight && this._inFlight.lastSent + this._inFlightTimeout < Date.now()) {
			if (this._inFlight.resent <= this._maxRetries) {
				this._inFlight.lastSent = Date.now()
				this._inFlight.resent++
				this.log('RESEND: ', this._inFlight)
				this._sendPacket(this._inFlight.packet)
			} else {
				// this._inFlight.splice(this._inFlight.indexOf(this._inFlight), 1)
				this.log('TIMED OUT: ', this._inFlight.packet)
				// @todo: we should probably break up the connection here.
				this._inFlight = undefined
				this._sendNextPacket()
			}
		}
	}

}
