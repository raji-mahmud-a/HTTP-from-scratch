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

      const headers = {};

      for (let i = 1; i < lines.length; i++) {
        const [key, value] = lines[i].split(": ");
        headers[key] = value;
      }

      return { method, path, version, headers, body };
    }
  }

  #buildResponseMessage(statusCode, headers, data) {}

  start() {
    this.#_server = net.createServer((_socket) => {
      let requestData = "";
      _socket.on("data", (chunk) => {
        requestData += chunk.toString();

        // check if request message has ended, to prevent responding to half recieved chunks of data
        if (chunk.toString().includes("\r\n\r\n")) {
          const parsedRequest = this.#parseRequestMessage(requestData);

          // the request object to pass to the routeHandler
          const request = {
            method: parsedRequest.method,
            path: parsedRequest.path,
            headers: parsedRequest.headers,
            body: parsedRequest.body,

            /**
             *
             * @param {string} header
             * @returns {boolean}
             */
            getHeader: (header) => {
              return request.headers.hasOwnProperty(header)
                ? request.headers[header]
                : undefined;
            },
          };

          // response object to send the routehandler

          const buildResponse = (statusCode, headers, data) => {
            return this.#buildResponseMessage(statusCode, headers, data);
          };

          const response = {
            statusCode: 200,
            headers: {},

            // i'm returning the object "this" so you can use object chaining, eg. response.status(200).setHeader("name", "value").send("data")
            status(code) {
              this.statusCode = code;
              return this;
            },

            setHeader(name, value) {
              this.headers[name] = value;
              return this;
            },

            send(data) {
              const response = buildResponse(this.statusCode, this.headers, data);
              _socket.write(response);
              _socket.end();
            },

            json(obj) {
              this.setHeader("Content-Type", "application/json");
              this.send(JSON.stringify(obj));
            },
          };

          const routeKey = `${request.method}:${request.path}`;

          if (!this.routes.has(routeKey)) {
            console.log("404");
          } else {
            const routeHandler = this.routes.get(routeKey);
            routeHandler(request, console);
          }
        }
      });

      _socket.on("error", (error) => {
        console.error("ERROR: ", error.message);
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
