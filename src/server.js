import net from "node:net";

const server = net.createServer((socket) => {
  let requestData = "";

  socket.on("data", (data) => {
    requestData += data;

    const response =
      "HTTP/1.1 200 OK\r\n" +
      "Content-Type: text/plain\r\n" +
      "Content-Length: 13\r\n" +
      "\r\n" +
      "Hello, world!";

    socket.write(response, (err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
    })

    socket.end(() => {
        console.log("HTTP server started at port 8888")
    })
  });
});

server.listen(8888);
