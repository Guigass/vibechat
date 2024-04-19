import { ContentHelper } from "../helpers/content.helper";

export class MessageModel {
    id?: number;
    from: string;
    to: string;
    body: string;
    timestamp: Date;
    serverId: string;
    ticked?: boolean;
    read?: boolean;
    
    constructor(from: string, to: string, body: string, timestamp: Date, serverId: string, ticked?: boolean, read?: boolean) {
        this.from = from;
        this.to = to;
        this.body = body;
        this.timestamp = timestamp;
        this.serverId = serverId;
        this.ticked = ticked;
        this.read = read;
    }

    get contentType(): string {
        return ContentHelper.determineContentType(this.body);
    }
}