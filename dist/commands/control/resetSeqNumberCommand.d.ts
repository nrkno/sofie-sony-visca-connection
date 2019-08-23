/// <reference types="node" />
import { ControlCommand } from '../abstractCommand';
export declare class ResetSequenceNumberCommand extends ControlCommand {
    serialize(): Buffer;
}
