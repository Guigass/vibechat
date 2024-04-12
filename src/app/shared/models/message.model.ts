import { ContentHelper } from "../helpers/content.helper";

export class MessageModel {
    from: string;
    to: string;
    body: string;
    timestamp: Date;
    id: string;
    type: 'received' | 'sent';
    ticked?: boolean;
    read?: boolean;

    constructor(from: string, to: string, body: string, timestamp: Date, messageId: string, type: 'received' | 'sent', ticked?: boolean, read?: boolean) {
        this.from = from;
        this.to = to;
        this.body = body;
        this.timestamp = timestamp;
        this.id = messageId;
        this.type = type;
        this.ticked = ticked;
        this.read = read;
    }

    get contentType(): string {
        return ContentHelper.determineContentType(this.body);
    }
}