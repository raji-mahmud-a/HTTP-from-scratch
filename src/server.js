import net from "node:net";

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
    }

    socket.end();
  });

  socket.on("close", () => {
    console.log("Client disconnected!")
  })

  socket.on("error", (err) => {
    console.error("Socket error: ", err)
  })
});

server.listen(8888, () => {
  console.log("HTTP server running...");
});
