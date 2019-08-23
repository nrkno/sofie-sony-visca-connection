/// <reference types="node" />
import { CommandType } from '../enums';
export interface AbstractCommand {
    deserialize?(payload: Buffer): any;
}
export declare abstract class AbstractCommand {
    abstract readonly commandType: CommandType;
    abstract serialize(): Buffer;
}
export declare abstract class ViscaCommand extends AbstractCommand {
    readonly commandType = CommandType.ViscaCommand;
}
export declare abstract class ViscaInquiryCommand extends AbstractCommand {
    readonly commandType = CommandType.ViscaInquiry;
    abstract deserialize(payload: Buffer): any;
}
export declare abstract class ControlCommand extends AbstractCommand {
    readonly commandType = CommandType.ControlCommand;
}
