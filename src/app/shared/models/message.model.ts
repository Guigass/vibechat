import { ContentHelper } from "../helpers/content.helper";

export class MessageModel {
    id?: number;
    from: string;
    to: string;
    body: string;
    timestamp: Date;
    serverId: string;
    resultId?: number;
    ticked?: boolean;
    read?: boolean;
    
    constructor(props: MessageProps) {
        this.from = props.from;
        this.to = props.to;
        this.body = props.body;
        this.timestamp = props.timestamp;
        this.serverId = props.serverId;
        this.resultId = props.resultId;
        this.ticked = props.ticked;
        this.read = props.read;
    }

    get contentType(): string {
        return ContentHelper.determineContentType(this.body);
    }
}

interface MessageProps {
    from: string;
    to: string;
    body: string;
    timestamp: Date;
    serverId: string;
    ticked?: boolean;
    read?: boolean;
    resultId?: number;
}