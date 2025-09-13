import { Server } from "./server.js"

const server = new Server(); // default port: 8000, host: 127.0.0.1

server.route("GET", "/", (request, response) => {
    response.setHeader("Content-Type", "text/html");
    response.send("<h1>Hello world</h1>");
})

server.route("GET", "/json", (request, response) => {
    response.json({ message: "hello, world" })
})

server.route("GET", "/error", (request, response) => {
    response.status(404).send("Not Found");
})

server.start()