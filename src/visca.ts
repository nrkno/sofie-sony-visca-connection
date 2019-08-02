import { EventEmitter } from 'events'
import { AbstractCommand } from './commands'
import { ViscaSocket } from './lib/socket'

export class ViscaDevice extends EventEmitter {
	private _address: string
	private _socket: ViscaSocket

	constructor (address: string) {
		super()
		this._address = address
		this._socket = new ViscaSocket({ address })

		this._socket.on('connected', () => this.emit('connected'))
		this._socket.on('disconnected', () => this.emit('disconnected'))
	}

	connect () {
		this._socket.connect(this._address)
	}

	disconnect () {
		this._socket.disconnect()
	}

	get address () {
		return this._address
	}

	set address (address: string) {
		if (address !== this._address) {
			this._socket.disconnect()
			this._address = address
			this._socket.connect(address)
		}
	}

	sendCommand (command: AbstractCommand): Promise<any> {
		return this._socket._sendCommand(command)
	}
}
