import net from "node:net";
import { Readable } from "node:stream";

interface ParsedRequestMessage {
    method?: string | undefined;
    path?: string | undefined;
    version?: string | undefined;
    headers?: Record<string, string> | undefined;
    body?: Record<string, string> | string | undefined;
    query?: {} | undefined
}

type RequestMessageType = ParsedRequestMessage | undefined;

class RequestMessage extends Readable {
    requestMessage: RequestMessageType;
    method: string;
    path: string;
    headers: Record<string, string>;
    body: Record<string, string> | string;
    query: {}
    constructor(connection: net.Socket, parsedMessage: RequestMessageType) {
        super();

        if (!connection || !parsedMessage) {
            throw new Error("Invalid arguments provided to RequestMessage constructor");
        }

        this.requestMessage = parsedMessage;
        this.method = parsedMessage?.method || "";
        this.path = parsedMessage?.path || "";
        this.headers = parsedMessage?.headers || {};
        this.body = parsedMessage?.body || {};
        this.query = parsedMessage?.query || {}
    }

    getHeader(header: string): string | undefined {
        return this.headers.hasOwnProperty(header)
            ? this.headers[header]
            : undefined;
    }

    // just push everything at once for now
    _read(size: number): void {
        this.push(this.body);
        this.push(null);
    }


}

export default RequestMessage;
