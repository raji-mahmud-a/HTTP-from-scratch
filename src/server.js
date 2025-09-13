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

  #getStatusText(statusCode) {
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

    return statusTexts.hasOwnProperty(statusCode) ? statusTexts[statusCode] : undefined
  }

  #buildResponseMessage(statusCode, headers, data) {
    let responseMessage = "";
    let statusText = this.#getStatusText(statusCode) || "Unknown";

    responseMessage +=
      "HTTP/1.1" + " " + statusCode + " " + statusText + "\r\n";

    for (let header of Object.entries(headers)) {
      const [name, value] = header;
      responseMessage += name + ": " + value + "\r\n";
    }

    if (!headers.hasOwnProperty("Content-Length")) {
      responseMessage +=
        "Content-Length: " + Buffer.byteLength(data).toString() + "\r\n";
    }

    responseMessage += "\r\n" + data;

    return responseMessage;
  }

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
              const response = buildResponse(
                this.statusCode,
                this.headers,
                data
              );

              console.log(response)
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
            response.setHeader("Content-Type", "text/html")
            response.status(404).send(`<span>${request.path} Not Found!<span>`)
          } else {
            const routeHandler = this.routes.get(routeKey);
            routeHandler(request, response);
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
