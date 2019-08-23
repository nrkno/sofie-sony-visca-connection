"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractCommand_1 = require("../abstractCommand");
class ZoomPositionCommand extends abstractCommand_1.ViscaInquiryCommand {
    serialize() {
        return Buffer.from([0x80, 0x09, 0x04, 0x47, 0xff]);
    }
    deserialize(payload) {
        let val = 0;
        val += 1000 * payload[2];
        val += 100 * payload[3];
        val += 10 * payload[4];
        val += 1 * payload[5];
        return val;
    }
}
exports.ZoomPositionCommand = ZoomPositionCommand;
//# sourceMappingURL=zoomPositionCommand.js.map