import net from "node:net";
import { EventEmitter } from "node:events";

class Server extends EventEmitter {
  #_server;

  constructor({ port = 8000, host = "127.0.0.1" }) {
    super();
    this.port = port;
    this.host = host;
    this.routes = new Map();
  }

  #handleRequestMessage(chunk) {}

  start() {
    this.#_server = net.createServer((_socket) => {
      _socket.on("data", (chunk) => {
        this.#handleRequestMessage(chunk);
      });
    });

    this.#_server.listen(this.port, this.host);
  }

  route(method, path, routeHandler) {
    if (!["GET", "POST"].includes(method.toUpperCase())) {
      throw new TypeError(`${method} method is not supported!`); 
    }

    const route = `${method.toUpperCase()}:${path}`;
    this.routes.set(route, routeHandler)
  }
}

const miniServer = { Server };

export default miniServer;
