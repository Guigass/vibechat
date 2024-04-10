import { PresenceModel } from "./presence.model";

export interface ContactModel {
    jid: string;
    name: string;
    presence: PresenceModel;
    groups: string[];
}
