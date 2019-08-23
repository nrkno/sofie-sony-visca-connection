"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const socket_1 = require("./lib/socket");
class ViscaDevice extends events_1.EventEmitter {
    constructor(address) {
        super();
        this._address = address;
        this._socket = new socket_1.ViscaSocket({ address });
        this._socket.on('connected', () => this.emit('connected'));
        this._socket.on('disconnected', () => this.emit('disconnected'));
    }
    connect() {
        this._socket.connect(this._address);
    }
    disconnect() {
        this._socket.disconnect();
    }
    get address() {
        return this._address;
    }
    set address(address) {
        if (address !== this._address) {
            this._socket.disconnect();
            this._address = address;
            this._socket.connect(address);
        }
    }
    sendCommand(command) {
        return this._socket._sendCommand(command);
    }
}
exports.ViscaDevice = ViscaDevice;
//# sourceMappingURL=visca.js.map