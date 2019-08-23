"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = require("dgram");
const events_1 = require("events");
const enums_1 = require("../enums");
const resetSeqNumberCommand_1 = require("../commands/control/resetSeqNumberCommand");
class ViscaSocket extends events_1.EventEmitter {
    constructor(options) {
        super();
        this._debug = false;
        this._localPacketId = 0;
        this._maxPacketID = 0xffffffff;
        this._port = 52381;
        this._reconnectInterval = 5000;
        this._inFlightTimeout = 1000;
        this._maxRetries = 5;
        this._lastReceivedAt = Date.now();
        this._queue = [];
        this._address = options.address || this._address;
        this._port = options.port || this._port;
        this._debug = options.debug || false;
        this.log = options.log || this.log;
        this._createSocket();
    }
    connect(address, port) {
        if (!this._reconnectTimer) {
            this._reconnectTimer = setInterval(() => {
                if (this._lastReceivedAt + this._reconnectInterval > Date.now())
                    return;
                if (this._connectionState === enums_1.ConnectionState.Connected) {
                    this._connectionState = enums_1.ConnectionState.Closed;
                    this.emit('disconnected', null, null);
                }
                this._localPacketId = 0;
                this.log('reconnecting');
                if (this._address && this._port) {
                    this._sendCommand(new resetSeqNumberCommand_1.ResetSequenceNumberCommand());
                    this._connectionState = enums_1.ConnectionState.Connecting;
                }
            }, this._reconnectInterval);
        }
        if (!this._retransmitTimer) {
            this._retransmitTimer = setInterval(() => this._checkForRetransmit(), 50);
        }
        if (address) {
            this._address = address;
        }
        if (port) {
            this._port = port;
        }
        this._sendCommand(new resetSeqNumberCommand_1.ResetSequenceNumberCommand());
        this._connectionState = enums_1.ConnectionState.Connecting;
    }
    disconnect() {
        return new Promise((resolve) => {
            if (this._connectionState === enums_1.ConnectionState.Connected) {
                this._socket.close(() => {
                    clearInterval(this._retransmitTimer);
                    clearInterval(this._reconnectTimer);
                    this._retransmitTimer = undefined;
                    this._reconnectTimer = undefined;
                    this._connectionState = enums_1.ConnectionState.Closed;
                    this._createSocket();
                    this.emit('disconnected');
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
    log(..._args) {
        // Will be re-assigned by the top-level class.
    }
    _sendCommand(command) {
        const buffer = Buffer.alloc(8);
        const payload = command.serialize();
        buffer.writeUInt16BE(command.commandType, 0);
        buffer.writeUInt16BE(payload.length, 2);
        buffer.writeUInt32BE(this._localPacketId, 4);
        const queueObject = {
            command,
            packetId: this._localPacketId,
            packet: Buffer.from([...buffer, ...payload]),
            promise: {
                resolve: () => null,
                reject: () => null
            }
        };
        const promise = new Promise((resolve, reject) => {
            queueObject.promise = {
                resolve,
                reject
            };
        });
        this._queue.push(queueObject);
        this._sendNextPacket();
        this._localPacketId = (this._localPacketId++) % this._maxPacketID;
        return promise;
    }
    _createSocket() {
        this._socket = dgram_1.createSocket('udp4');
        this._socket.bind();
        this._socket.on('message', (packet, rinfo) => this._receivePacket(packet, rinfo));
        this._socket.on('close', () => this.emit('disconnect'));
    }
    _receivePacket(packet, rinfo) {
        if (this._debug)
            this.log('RECV ', packet, rinfo);
        this._lastReceivedAt = Date.now();
        const type = packet.readUInt16BE(0);
        const length = packet.readUInt32BE(4);
        if (type === enums_1.CommandType.ViscaReply && this._inFlight) {
            // @todo: think about what resolves a command.
            if (length === 3 && packet.readUInt8(8) === 0x41) {
                // supposedly an ack
                return; // completion resolves, and not ack so we skip
            }
            else if (length === 3 && packet.readUInt8(8) === 0x51) {
                // supposedly a completion
                this._inFlight.promise.resolve();
            }
            else if (length === 4 && packet.readUInt16BE(8) === 0x6002) {
                // supposedly a syntax error
                this._inFlight.promise.reject(new Error('Syntax Error'));
            }
            else if (length === 4 && packet.readUInt16BE(8) === 0x6141) {
                // supposedly not executable
                this._inFlight.promise.reject(new Error('Not executable'));
            }
            else {
                // maybe a inquisition reply?
                if (this._inFlight.command.deserialize) {
                    this._inFlight.promise.resolve(this._inFlight.command.deserialize(packet.slice(8, 8 + length)));
                }
            }
        }
        else if (type === enums_1.CommandType.ControlReply) {
            this._connectionState = enums_1.ConnectionState.Connected;
            this.emit('connected');
        }
        this._inFlight = undefined;
        this._sendNextPacket();
    }
    _sendNextPacket() {
        if (this._inFlight)
            return;
        const packet = this._queue.shift();
        if (packet) {
            this._inFlight = Object.assign({}, packet, { lastSent: Date.now(), resent: 0 });
            this._sendPacket(packet.packet);
        }
    }
    _sendPacket(packet) {
        if (this._debug)
            this.log('SEND ', packet);
        this._socket.send(packet, this._port, this._address);
    }
    _checkForRetransmit() {
        if (this._inFlight && this._inFlight.lastSent + this._inFlightTimeout < Date.now()) {
            if (this._inFlight.resent <= this._maxRetries) {
                this._inFlight.lastSent = Date.now();
                this._inFlight.resent++;
                this.log('RESEND: ', this._inFlight);
                this._sendPacket(this._inFlight.packet);
            }
            else {
                this.log('TIMED OUT: ', this._inFlight.packet);
                // @todo: we should probably break up the connection here.
                this._inFlight = undefined;
                this._sendNextPacket();
            }
        }
    }
}
exports.ViscaSocket = ViscaSocket;
//# sourceMappingURL=socket.js.map