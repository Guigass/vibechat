export interface VCardModel{
    id?: number;
    jid: string;
    fullname: string;
    nickname: string;
    email: string;
    phone: string;
    givenName: string;
    familyName: string;
    avatar: string;
    updatedAt?: Date;
}