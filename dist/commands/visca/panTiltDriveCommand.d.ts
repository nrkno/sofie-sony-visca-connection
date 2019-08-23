/// <reference types="node" />
import { ViscaCommand } from '../abstractCommand';
import { PanTiltDirection } from '../../enums';
export declare class PanTiltDriveCommand extends ViscaCommand {
    direction: PanTiltDirection;
    panSpeed: number;
    tiltSpeed: number;
    serialize(): Buffer;
}
