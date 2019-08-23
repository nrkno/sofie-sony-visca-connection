"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractCommand_1 = require("../abstractCommand");
class ResetSequenceNumberCommand extends abstractCommand_1.ControlCommand {
    serialize() {
        return Buffer.from([1]);
    }
}
exports.ResetSequenceNumberCommand = ResetSequenceNumberCommand;
//# sourceMappingURL=resetSeqNumberCommand.js.map