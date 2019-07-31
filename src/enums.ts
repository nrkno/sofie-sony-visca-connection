export enum CommandType {
	ViscaCommand = 256,
	ViscaInquiry = 272,
	ViscaReply = 273,
	ControlCommand = 512,
	ControlReply = 513
}

export enum PanTiltDirection {
	Up = 0x0301,
	Down = 0x0302,
	Left = 0x0103,
	Right = 0x0203,
	UpLeft = 0x0101,
	UpRight = 0x0201,
	DownLeft = 0x0102,
	DownRight = 0x0202,
	Stop = 0x0303
}

export enum ZoomDirection {
	Stop = 0x00,
	TeleStandard = 0x02,
	WideStandard = 0x03,
	TeleVariable = 0x20,
	WideVariable = 0x30
}

export enum PresetOperation {
	Reset = 0x01,
	Set = 0x02,
	Recall = 0x03
}

export enum ConnectionState {
	Closed,
	Connecting,
	Connected
}
