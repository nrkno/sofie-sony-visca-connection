/// <reference types="node" />
import { ViscaCommand } from '../abstractCommand';
import { ZoomDirection } from '../../enums';
export declare class ZoomCommand extends ViscaCommand {
    direction: ZoomDirection;
    speed: number;
    serialize(): Buffer;
}
