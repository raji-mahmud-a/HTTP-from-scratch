import net from "node:net";
import { EventEmitter } from "node:events";


class Server extends EventEmitter {
  #_server;

  constructor({ port = 8000, host = "127.0.0.1" }) {
    super();
    this.port = port;
    this.host = host;
    this.routes = ["GET", "POST"]
  }

  #handleRequestMessage(chunk) {
    
  }

  start() {
    this.#_server = net.createServer((_socket) => {
        _socket.on("data", this.#handleRequestMessage)
    });

    this.#_server.listen(this.port, this.host)
  }
  
  route(method, path, routeHandler) {
    if (!this.routes.includes(method.toUpperCase())) {
        let err = new TypeError(`${method} method is not supported!`)
        routeHandler(err)
    }
  }
}

const miniServer = { Server }

export default miniServer 
