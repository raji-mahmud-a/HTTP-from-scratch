import net from "node:net";
import { Readable } from "node:stream";

interface ParsedRequestMessage {
    method?: string | undefined;
    path?: string | undefined;
    version?: string | undefined;
    headers?: Record<string, string> | undefined;
    body?: string | undefined;
}

type RequestMessageType = ParsedRequestMessage | undefined;

class RequestMessage extends Readable {
    requestMessage: RequestMessageType;
    method: string;
    path: string;
    headers: Record<string, string>;
    body: string;
    constructor(connection: net.Socket, parsedMessage: RequestMessageType) {
        super();
        this.requestMessage = parsedMessage;
        this.method = parsedMessage?.method || "";
        this.path = parsedMessage?.path || "";
        this.headers = parsedMessage?.headers || {};
        this.body = parsedMessage?.body || "";
    }

    getHeader(header: string): string | undefined {
        return this.headers.hasOwnProperty(header)
            ? this.headers[header]
            : undefined;
    }
}

export default RequestMessage;
