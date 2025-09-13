import net from "node:net";
import { EventEmitter } from "node:events";

function parseRequestMessage(requestData) {
  const [head, body] = requestData.split("\r\n\r\n");

  const lines = head.split("\r\n");
  const [method, path, version] = lines[0].split(" ");
  const headers = {};

  for (let i = 1; i < lines.length; i++) {
    const [key, value] = lines[i].split(": ");
    headers[key] = value;
  }

  return {
    head: {
      method,
      path,
      version,
      headers,
    },
    body,
  };
}

const server = net.createServer((socket) => {
  let requestData = "";

  socket.on("data", (chunk) => {
    requestData += chunk.toString();

    if (requestData.includes("\r\n\r\n")) {
      const response =
        "HTTP/1.1 200 OK\r\n" +
        "Content-Type: text/plain\r\n" +
        "Content-Length: 13\r\n" +
        "\r\n" +
        "Hello, world!";

      socket.write(response, (err) => {
        if (err) {
          console.error("Socket write error: ", err);
        }
      });

      console.log(parseRequestMessage(requestData));

      socket.end();
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected!");
  });

  socket.on("error", (err) => {
    console.error("Socket error: ", err);
  });
});

server.listen(8888, () => {
  console.log("HTTP server running...");
});

class Server extends EventEmitter {
  #_server;

  constructor({ port = 8000, host = "127.0.0.1" }) {
    super();
    this.port = port;
    this.host = host;
  }

  #handleRequestMessage(chunk) {
    
  }

  start() {
    this.#_server = net.createServer((_socket) => {
        _socket.on("data", this.#handleRequestMessage)
    });

    this.#_server.listen(this.port, this.host)
  }
}

const app = new Server({});

console.log(app.start());
