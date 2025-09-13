import net from "node:net";

const server = net.createServer((socket) => {
  let requestData = "";

  socket.on("data", (data) => {
    requestData += data;

    const [head, body] = requestData.split("\r\n\r\n")

    console.log({ head, body })

  });
});

server.listen(8888);
