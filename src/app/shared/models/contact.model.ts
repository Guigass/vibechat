import { PresenceModel } from "./presence.model";

export interface ContactModel {
    jid: string;
    name: string;
    groups: string[];
    subscription?: string;
    presence?: PresenceModel;
    hidden?: boolean;
    isTyping?: false;
    userinfo?: VCardModel;
}

export interface VCardModel{
    jid: string;
    fullname: string;
    nickname: string;
    email: string;
    phone: string;
    givenName: string;
    familyName: string;
    avatar: string;
}
