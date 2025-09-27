import net from "node:net";
import { EventEmitter } from "node:events";
import RequestMessage from "./request.js";
import ResponseMessage from "./response.js";
import utils from "./utils/utils.js";

type ServerHandler = (
    request: RequestMessage,
    response: ResponseMessage
) => void;

class HTTPServer extends EventEmitter {
    #server: net.Server;

    constructor() {
        super();
    }

    makeServer(callback?: ServerHandler) {
        this.#server = net.createServer((connection) => {
            let data = "";
            connection.on("data", (chunk: Buffer) => {
                data += chunk.toString();

                // check if request message has ended, to prevent responding to half recieved chunks of data
                if (data.includes("\r\n\r\n")) {
                    const parsedMessage = utils.parseRequestMessage(data);

                    if (parsedMessage) {
                        const request: RequestMessage = new RequestMessage(
                            connection,
                            parsedMessage
                        );
                        const response: ResponseMessage = new ResponseMessage(
                            connection
                        );
                        if (callback) {
                            callback(request, response);
                            this.emit("request", request, response);
                        } else {
                            this.emit("request", request, response);
                        }
                    }
                }
            });
        });
    }

    listen(port: number, host: string, callback?: () => void): void;
    listen(port: number, callback?: () => void): void;
    listen(
        options: { port: number; host?: string },
        callback?: () => void
    ): void;

    listen(
        portOrOptions: number | { port: number; host?: string },
        hostOrCb?: string | (() => void),
        maybeCb?: () => void
    ): void {
        let port: number;
        let host: string | undefined;
        let callback: (() => void) | undefined;

        if (typeof portOrOptions === "number") {
            port = portOrOptions;

            if (typeof hostOrCb === "string") {
                host = hostOrCb;
                callback = maybeCb;
            } else if (typeof hostOrCb === "function") {
                callback = hostOrCb;
            }
        } else {
            port = portOrOptions.port;
            host = portOrOptions.host;
            callback = hostOrCb as (() => void) | undefined;
        }

        this.#server.listen(port, host);
        if (callback) {
            callback();
        }
    }
}
// }

export default HTTPServer;
