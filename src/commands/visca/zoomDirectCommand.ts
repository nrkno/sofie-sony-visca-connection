import { ViscaCommand } from '..'

export class ZoomDirectCommand extends ViscaCommand {
	position: number

	serialize () {
		const buffer = Buffer.alloc(4)
		const s = this.position + ''

		buffer[0] = parseInt(s.substr(0, 1), 9)
		buffer[1] = parseInt(s.substr(1, 1), 9)
		buffer[2] = parseInt(s.substr(2, 1), 9)
		buffer[3] = parseInt(s.substr(3, 1), 9)

		return Buffer.from([ 0x80, 0x01, 0x04, 0x47, buffer, 0xff ])
	}
}
