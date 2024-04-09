import { ContentHelper } from "../helpers/content.helper";

export class MessageModel {
    from: string;
    to: string;
    body: string;
    timestamp: Date;
    messageId: string;
    type: 'received' | 'sent';

    constructor(from: string, to: string, body: string, timestamp: Date, messageId: string, type: 'received' | 'sent') {
        this.from = from;
        this.to = to;
        this.body = body;
        this.timestamp = timestamp;
        this.messageId = messageId;
        this.type = type;
    }

    get contentType(): string {
        return ContentHelper.determineContentType(this.body);
    }
}