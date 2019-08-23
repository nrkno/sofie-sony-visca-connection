"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandType;
(function (CommandType) {
    CommandType[CommandType["ViscaCommand"] = 256] = "ViscaCommand";
    CommandType[CommandType["ViscaInquiry"] = 272] = "ViscaInquiry";
    CommandType[CommandType["ViscaReply"] = 273] = "ViscaReply";
    CommandType[CommandType["ControlCommand"] = 512] = "ControlCommand";
    CommandType[CommandType["ControlReply"] = 513] = "ControlReply";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
var PanTiltDirection;
(function (PanTiltDirection) {
    PanTiltDirection[PanTiltDirection["Up"] = 769] = "Up";
    PanTiltDirection[PanTiltDirection["Down"] = 770] = "Down";
    PanTiltDirection[PanTiltDirection["Left"] = 259] = "Left";
    PanTiltDirection[PanTiltDirection["Right"] = 515] = "Right";
    PanTiltDirection[PanTiltDirection["UpLeft"] = 257] = "UpLeft";
    PanTiltDirection[PanTiltDirection["UpRight"] = 513] = "UpRight";
    PanTiltDirection[PanTiltDirection["DownLeft"] = 258] = "DownLeft";
    PanTiltDirection[PanTiltDirection["DownRight"] = 514] = "DownRight";
    PanTiltDirection[PanTiltDirection["Stop"] = 771] = "Stop";
})(PanTiltDirection = exports.PanTiltDirection || (exports.PanTiltDirection = {}));
var ZoomDirection;
(function (ZoomDirection) {
    ZoomDirection[ZoomDirection["Stop"] = 0] = "Stop";
    ZoomDirection[ZoomDirection["TeleStandard"] = 2] = "TeleStandard";
    ZoomDirection[ZoomDirection["WideStandard"] = 3] = "WideStandard";
    ZoomDirection[ZoomDirection["TeleVariable"] = 32] = "TeleVariable";
    ZoomDirection[ZoomDirection["WideVariable"] = 48] = "WideVariable";
})(ZoomDirection = exports.ZoomDirection || (exports.ZoomDirection = {}));
var PresetOperation;
(function (PresetOperation) {
    PresetOperation[PresetOperation["Reset"] = 1] = "Reset";
    PresetOperation[PresetOperation["Set"] = 2] = "Set";
    PresetOperation[PresetOperation["Recall"] = 3] = "Recall";
})(PresetOperation = exports.PresetOperation || (exports.PresetOperation = {}));
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["Closed"] = 0] = "Closed";
    ConnectionState[ConnectionState["Connecting"] = 1] = "Connecting";
    ConnectionState[ConnectionState["Connected"] = 2] = "Connected";
})(ConnectionState = exports.ConnectionState || (exports.ConnectionState = {}));
//# sourceMappingURL=enums.js.map