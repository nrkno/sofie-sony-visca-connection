export declare enum CommandType {
    ViscaCommand = 256,
    ViscaInquiry = 272,
    ViscaReply = 273,
    ControlCommand = 512,
    ControlReply = 513
}
export declare enum PanTiltDirection {
    Up = 769,
    Down = 770,
    Left = 259,
    Right = 515,
    UpLeft = 257,
    UpRight = 513,
    DownLeft = 258,
    DownRight = 514,
    Stop = 771
}
export declare enum ZoomDirection {
    Stop = 0,
    TeleStandard = 2,
    WideStandard = 3,
    TeleVariable = 32,
    WideVariable = 48
}
export declare enum PresetOperation {
    Reset = 1,
    Set = 2,
    Recall = 3
}
export declare enum ConnectionState {
    Closed = 0,
    Connecting = 1,
    Connected = 2
}
