/// <reference types="node" />
import { ViscaCommand } from '../abstractCommand';
import { PresetOperation } from '../../enums';
export declare class PresetCommand extends ViscaCommand {
    operation: PresetOperation;
    memoryNumber: number;
    serialize(): Buffer;
}
