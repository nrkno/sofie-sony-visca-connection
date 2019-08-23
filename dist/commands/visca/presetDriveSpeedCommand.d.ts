/// <reference types="node" />
import { ViscaCommand } from '../abstractCommand';
export declare class PresetDriveSpeedCommand extends ViscaCommand {
    memoryNumber: number;
    speed: number;
    serialize(): Buffer;
}
