import { ContactModel } from "./contact.model";

export interface ContactGroupModel {
    name: string;
    contacts: ContactModel[];
}