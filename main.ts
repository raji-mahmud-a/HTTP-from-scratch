import HTTPServer from "./src/HttpServer";

const server = new HTTPServer()

server.makeServer((req, res) => {

})

server.on("request")