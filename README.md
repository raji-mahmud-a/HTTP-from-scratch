# HTTP-from-scratch

A barebones HTTP/1.1 server built only with raw TCP sockets (`net` module), immplemented my own routing system
No frameworks used.

## usage

```js

// src/main.js

import { Server } from "./server.js"

const server = new Server(); // default port: 8000, host: 127.0.0.1

server.route("GET", "/", (request, response) => {
    response.setHeader("Content-Type", "text/plain");
    response.send("Hello world");
})

server.route("GET", "/error", (request, response) => {
    response.status(404).send("Not Found");
})
```

- open your browser and go to `http://127.0.0.1:8000`