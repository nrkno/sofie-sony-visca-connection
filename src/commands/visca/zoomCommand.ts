import { ViscaCommand } from '../abstractCommand'
import { ZoomDirection } from '../../enums'

export class ZoomCommand extends ViscaCommand {
	direction: ZoomDirection
	speed: number

	serialize () {
		let data = this.direction

		if (data > 0x03) data = data + this.speed

		return Buffer.from([ 0x80, 0x01, 0x04, 0x07, data, 0xff ])
	}
}
