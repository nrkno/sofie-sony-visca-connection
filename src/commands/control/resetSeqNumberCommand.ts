import { ControlCommand } from '../abstractCommand'

export class ResetSequenceNumberCommand extends ControlCommand {
	serialize () {
		return Buffer.from([ 1 ])
	}
}
