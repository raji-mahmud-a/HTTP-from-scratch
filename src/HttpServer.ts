import net from "node:net";
import { EventEmitter } from "node:stream";

interface ServerConfig {
    port?: number;
    host?: string
}

class HTTPServer extends EventEmitter implements ServerConfig {
    port: number
    host: string

    constructor({ port = 8000, host = "127.0.0.1" } = {}) {
        super();
        this.port = port
        this.host = host
    }

    start()
}
