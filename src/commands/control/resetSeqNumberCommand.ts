import { ControlCommand } from '..'

export class ResetSequenceNumberCommand extends ControlCommand {
	serialize () {
		return Buffer.from([ 1 ])
	}
}
