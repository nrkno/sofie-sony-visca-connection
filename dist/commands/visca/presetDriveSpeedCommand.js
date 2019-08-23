"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractCommand_1 = require("../abstractCommand");
class PresetDriveSpeedCommand extends abstractCommand_1.ViscaCommand {
    serialize() {
        return Buffer.from([0x80, 0x01, 0x7e, 0x01, 0x0b,
            this.memoryNumber, this.speed, 0xff]);
    }
}
exports.PresetDriveSpeedCommand = PresetDriveSpeedCommand;
//# sourceMappingURL=presetDriveSpeedCommand.js.map