/// <reference types="node" />
import { ViscaInquiryCommand } from '../abstractCommand';
export declare class ZoomPositionCommand extends ViscaInquiryCommand {
    serialize(): Buffer;
    deserialize(payload: Buffer): number;
}
