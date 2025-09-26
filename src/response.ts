import net from "node:net";
import { Writable } from "node:stream";

class ResponseMessage extends Writable {
    statusCode: number;
    headers: Record<string, string>;
    headersSent: boolean;
    connection: net.Socket;
    constructor(connection: net.Socket) {
        super();
        this.headers = {};
        this.statusCode = 200;
        this.headersSent = false;
        this.connection = connection;
    }

    setHeader(key: string, value: string) {
        this.headers[key] = value;
    }

    setStatusCode(statusCode: number) {
        if (typeof statusCode === "number") {
            this.statusCode = statusCode
        }
    }

    getStatusText(statusCode = this.statusCode) {
        const statusTexts = {
            200: "OK",
            201: "Created",
            204: "No Content",
            301: "Moved Permanetly",
            302: "Found",
            304: "Not Modified",
            400: "Bad Request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not Found",
            405: "Method Not Allowed",
            409: "Conflict",
            422: "Unprocessable Entity",
            500: "Internal Server Error",
            502: "Bad Gateway",
            503: "Service Unavailable",
        };

        return statusTexts.hasOwnProperty(statusCode)
            ? statusTexts[statusCode]
            : undefined;
    }

    buildResponse(
        statusCode = this.statusCode,
        headers = this.headers,
        data: string
    ) {
        let responseMessage = "";
        let statusText: string = this.getStatusText(statusCode) || "Unknown";

        responseMessage += "HTTP/1.1" + " " + statusCode + statusText + "\r\n";

        for (let header of Object.entries(headers)) {
            const [key, value] = header;
            responseMessage += key + ": " + value + "\r\n";
        }

        if (!headers.hasOwnProperty("Content-Length")) {
            responseMessage += "Content-Length: " + Buffer.byteLength(data).toString() + "\r\n"
        }

        responseMessage += "\r\n" + data

        return responseMessage;
    }

    _write(
        chunk: any,
        encoding: BufferEncoding,
        callback: (error?: Error | null) => void
    ): void {
        try {
            if (!this.headersSent) {
                const response = this.buildResponse(this.statusCode, this.headers, chunk)
                this.connection.write(Buffer.from(response), encoding, callback)
                this.headersSent = false;
            } else {
                this.connection.write(chunk, encoding, callback)
            }
        } catch(e) {
            callback(e as Error)
        }
    }
}

export default ResponseMessage;
