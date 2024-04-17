import { PresenceModel } from "./presence.model";
import { VCardModel } from "./vcard.model";

export interface ContactModel {
    id?: number;
    jid: string;
    name: string;
    groups: string[];
    subscription?: string;
    presence?: PresenceModel;
    hidden?: boolean;
    isTyping?: false;
    userinfo?: VCardModel;
}