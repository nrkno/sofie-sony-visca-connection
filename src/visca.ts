import { EventEmitter } from 'events'
import { createSocket, Socket } from 'dgram'
import { AbstractCommand } from './commands'
import { ResetSequenceNumberCommand } from './commands/control/resetSeqNumberCommand'

export class ViscaDevice extends EventEmitter {
	private _address: string
	private _socket: Socket
	private _socketCounter: number = 0

	constructor (address: string) {
		super()
		this._address = address
	}

	connect () {
		if (this._socket) this._socket.unref()

		this._socket = createSocket('udp4')
		this._socket.bind()

		this.sendCommand(new ResetSequenceNumberCommand())
		this._socketCounter = 0
	}

	disconnect () {
		this._socket.unref()
	}

	sendCommand (command: AbstractCommand) {
		const buffer = Buffer.alloc(8)
		const payload = command.serialize()

		buffer.writeUInt16BE(command.commandType, 0)
		buffer.writeUInt16BE(payload.length, 2)
		buffer.writeUInt32BE(this._socketCounter, 4)

		this._sendUdp(Buffer.from([ buffer, payload ]))
	}

	private _sendUdp (msg: Buffer, offset?: number, length?: number) {
		if (offset && length) this._socket.send(msg, offset, length, 52381, this._address)
		else this._socket.send(msg, 52381, this._address)

		this._socketCounter = (this._socketCounter++) % 0xffffffff
	}
}
