import { PresenceType } from "../enums/presence-type.enum";

export interface PresenceModel {
    jid: string;
    type: PresenceType;
    status?: string;
}