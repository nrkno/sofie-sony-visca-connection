/// <reference types="node" />
import { EventEmitter } from 'events';
import { AbstractCommand } from '../commands/index';
export declare class ViscaSocket extends EventEmitter {
    private _debug;
    private _reconnectTimer;
    private _retransmitTimer;
    private _connectionState;
    private _localPacketId;
    private _maxPacketID;
    private _address;
    private _port;
    private _socket;
    private _reconnectInterval;
    private _inFlightTimeout;
    private _maxRetries;
    private _lastReceivedAt;
    private _inFlight;
    private _queue;
    constructor(options: {
        address?: string;
        port?: number;
        debug?: boolean;
        log?: (...args: any[]) => void;
    });
    connect(address?: string, port?: number): void;
    disconnect(): Promise<unknown>;
    log(..._args: any[]): void;
    _sendCommand(command: AbstractCommand): Promise<any>;
    private _createSocket;
    private _receivePacket;
    private _sendNextPacket;
    private _sendPacket;
    private _checkForRetransmit;
}
