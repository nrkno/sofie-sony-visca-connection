"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractCommand_1 = require("../abstractCommand");
class PanTiltDriveCommand extends abstractCommand_1.ViscaCommand {
    serialize() {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt8(this.panSpeed, 0);
        buffer.writeUInt8(this.tiltSpeed, 1);
        buffer.writeUInt16BE(this.direction, 2);
        return Buffer.from([0x80, 0x01, 0x06, 0x01, buffer, 0xff]);
    }
}
exports.PanTiltDriveCommand = PanTiltDriveCommand;
//# sourceMappingURL=panTiltDriveCommand.js.map