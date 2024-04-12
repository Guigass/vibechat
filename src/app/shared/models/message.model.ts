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

    constructor(from: string, to: string, body: string, timestamp: Date, messageId: string, type: 'received' | 'sent') {
        this.from = from;
        this.to = to;
        this.body = body;
        this.timestamp = timestamp;
        this.id = messageId;
        this.type = type;
    }

    get contentType(): string {
        return ContentHelper.determineContentType(this.body);
    }
}