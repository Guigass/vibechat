import { PresenceModel } from "./presence.model";

export interface ContactModel {
    jid: string;
    name: string;
    groups: string[];
    subscription?: string;
    presence?: PresenceModel;
    hidden?: boolean;
    isTyping?: false;
}
