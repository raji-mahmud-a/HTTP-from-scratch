import net from "node:net"
import { Writable } from "node:stream";

class ResponseMessage extends Writable {
    statusCode: number
    headers: Record<string, string>
    constructor(connection: net.Socket) {
        super();
        this.headers = {}
    }

    setHeader(key: string, value: string) {
        this.headers[key] = value;
    }

    send(data: string) {

    }
}

export default ResponseMessage