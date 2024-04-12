import { PresenceModel } from "./presence.model";

export interface ContactModel {
    jid: string;
    name: string;
    subscription?: string;
    groups: string[];
    presence?: PresenceModel;
}
