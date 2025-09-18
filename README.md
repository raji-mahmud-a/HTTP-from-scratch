# HTTP-from-scratch

A barebones HTTP/1.1 server built only with raw TCP sockets (`net` module), implemented my own routing system
No frameworks used.

## usage

```bash
$ git clone https://github.com/greatm3/HTTP-from-scratch

$ cd HTTP-from-scratch

$ npm start # node src/main.js
```

```js

// src/main.js

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
```

- open your browser and go to `http://127.0.0.1:8000`

## TODOs
- [x] Basic HTTP request parsing
- [x] GET method routing
- [x] Response object with status/headers
- [ ] POST method with body parsing
- [ ] Query parameter parsing (?name=value)
- [ ] Static file serving
- [ ] Error handling middleware

### RFC Features to add
### RFC Features to Add
- [ ] Support `Content-Length` body parsing  
- [ ] Implement `Transfer-Encoding: chunked` decoding  
- [ ] Connection persistence (`keep-alive` by default)  
- [ ] Handle `Connection: close` termination  
- [ ] Improve header parsing (case-insensitive keys, trim values)  
- [ ] Return standard headers (`Date`, `Server`, `Connection`)  
- [ ] Handle `405 Method Not Allowed`  
- [ ] Robust error handling for unhandled exceptions  
- [ ] Optional caching headers (`ETag`, `Cache-Control`)  

## What I Learned
- TCP socket programming
- HTTP protocol internals
- Request parsing and response formatting
- Routing system design
