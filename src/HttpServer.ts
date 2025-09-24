import net from "node:net";
import { EventEmitter } from "node:events";
import RequestMessage from "./request.js";
import ResponseMessage from "./response.js";
import utils from "./utils/httpParser.js";

interface ServerConfig {
    port: number;
    host: string;
}

type ServerHandler = (request: RequestMessage, response: ResponseMessage) => void

class HTTPServer extends EventEmitter implements ServerConfig {
    port: number;
    host: string;
    #server: net.Server;

    constructor({ port = 8000, host = "127.0.0.1" } = {}) {
        super();
        this.port = port;
        this.host = host;
    }

    makeServer(callback: ServerHandler) {
        this.#server = net.createServer((connection) => {
            let data = "";
            connection.on("data", (chunk: Buffer) => {
                data += chunk.toString();

                // check if request message has ended, to prevent responding to half recieved chunks of data
                if (data.includes("\r\n\r\n")) {
                    const parsedMessage = utils.parseRequestMessage(data);

                    if (parsedMessage) {
                        const request: RequestMessage = new RequestMessage(connection, parsedMessage)
                        const response: ResponseMessage = new ResponseMessage()
                        callback(request, response);
                        this.emit("request", request, response);
                    }
                }
            });
        });
    }
}

export default HTTPServer