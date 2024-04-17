import { PresenceType } from "../enums/presence-type.enum";

export interface PresenceModel {
    id?: number;
    jid: string;
    type: PresenceType;
    status?: string;
}