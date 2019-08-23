"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractCommand_1 = require("../abstractCommand");
class ZoomCommand extends abstractCommand_1.ViscaCommand {
    serialize() {
        let data = this.direction;
        if (data > 0x03)
            data = data + this.speed;
        return Buffer.from([0x80, 0x01, 0x04, 0x07, data, 0xff]);
    }
}
exports.ZoomCommand = ZoomCommand;
//# sourceMappingURL=zoomCommand.js.map