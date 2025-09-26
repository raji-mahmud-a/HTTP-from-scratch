import HTTPServer from "./src/HttpServer";

const server = new HTTPServer()

server.makeServer((req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.write("<h1>Hello</h1>")
    res.connection.end()
})
 

server.listen()