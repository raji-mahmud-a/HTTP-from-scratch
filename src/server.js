import net from "node:net";
import { EventEmitter } from "node:events";

class Server extends EventEmitter {
  #_server;

  /**
   * Creates a new Server instance
   * @param {Object} [options = {}] - Server configuration options
   * @param {number} [options.port=8000] - port to bind on
   * @param {string} [options.host="127.0.0.1"] - host to bind on
   */
  constructor({ port = 8000, host = "127.0.0.1" } = {}) {
    super();
    this.port = port;
    this.host = host;
    this.routes = new Map();
  }

  #parseRequestMessage(requestMessage) {
    if (requestMessage.includes("\r\n\r\n")) {
      const [head, body] = requestMessage.split("\r\n\r\n");

      const lines = head.split("\r\n");
      const [method, path, version] = lines[0].split(" ");

      const headers = Object.create(null);

      for (let i = 1; i < lines.length; i++) {
        const [key, value] = lines[i].split(": ");
        headers[key] = value;
      }

      return { method, path, version, headers, body };
    }
  }

  start() {
    this.#_server = net.createServer((_socket) => {
      _socket.on("data", (chunk) => {
        // check if request message has ended, to prevent responding to half recieved chunks of data
        if (chunk.toString().includes("\r\n\r\n")) {
          this.#parseRequestMessage(chunk.toString());
        }
      });
    });

    this.#_server.listen(this.port, this.host);
  }

  /**
   *
   * @param {string} method - HTTP method (GET, POST)
   * @param {string} path - Route path
   * @param {Function} routeHandler - handler for the path and method
   */
  route(method, path, routeHandler) {
    if (!["GET", "POST"].includes(method.toUpperCase())) {
      throw new TypeError(`${method} method is not supported!`);
    }

    const route = `${method.toUpperCase()}:${path}`;
    this.routes.set(route, routeHandler);
  }
}

const miniServer = { Server };

export default miniServer;
