import net from "node:net";
import { EventEmitter } from "node:events";
import RequestMessage from "./request";
import ResponseMessage from "./response";

interface ServerConfig {
    port: number;
    host: string
}

class HTTPServer extends EventEmitter implements ServerConfig {
    port: number
    host: string
    server: net.Server

    constructor({ port = 8000, host = "127.0.0.1" } = {}) {
        super();
        this.port = port
        this.host = host
    }

    makeServer(request?: RequestMessage, response?: ResponseMessage) {
        if (request && response) {

        }
    }
}
