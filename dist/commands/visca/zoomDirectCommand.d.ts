/// <reference types="node" />
import { ViscaCommand } from '../abstractCommand';
export declare class ZoomDirectCommand extends ViscaCommand {
    position: number;
    serialize(): Buffer;
}
