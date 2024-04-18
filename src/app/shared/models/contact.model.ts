import { PresenceModel } from "./presence.model";

export interface ContactModel {
    id?: number;
    jid: string;
    name: string;
    groups: string[];
    subscription?: string;
    hidden?: boolean;
    isTyping?: false;
    presence?: PresenceModel;
}