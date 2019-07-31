import { CommandType } from '../enums'

export abstract class AbstractCommand {
	abstract readonly commandType: CommandType

	abstract serialize (): Buffer
}

export abstract class ViscaCommand extends AbstractCommand {
	readonly commandType = CommandType.ViscaCommand
}

export abstract class ControlCommand extends AbstractCommand {
	readonly commandType = CommandType.ControlCommand
}
