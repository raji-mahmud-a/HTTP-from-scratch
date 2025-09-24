import net from "node:net";
import { Readable } from "node:stream";
import utils from "./utils/httpParser";

interface ParsedRequestMessage {
    method?: string | undefined,
    path?: string | undefined,
    version?: string | undefined,
    headers?: Record<string, string> | undefined,
    body?: string | undefined,
}

type RequestMessageType = ParsedRequestMessage | undefined

class RequestMessage extends Readable {
    requestMessage: RequestMessageType;
    constructor(connection: net.Socket, parsedMessage: RequestMessageType) {
        super();
        this.requestMessage = parsedMessage
    }
}

export default RequestMessage