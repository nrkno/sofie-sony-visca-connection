"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
class AbstractCommand {
}
exports.AbstractCommand = AbstractCommand;
class ViscaCommand extends AbstractCommand {
    constructor() {
        super(...arguments);
        this.commandType = enums_1.CommandType.ViscaCommand;
    }
}
exports.ViscaCommand = ViscaCommand;
class ViscaInquiryCommand extends AbstractCommand {
    constructor() {
        super(...arguments);
        this.commandType = enums_1.CommandType.ViscaInquiry;
    }
}
exports.ViscaInquiryCommand = ViscaInquiryCommand;
class ControlCommand extends AbstractCommand {
    constructor() {
        super(...arguments);
        this.commandType = enums_1.CommandType.ControlCommand;
    }
}
exports.ControlCommand = ControlCommand;
//# sourceMappingURL=abstractCommand.js.map