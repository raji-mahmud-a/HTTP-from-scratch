# HTTP-from-scratch

A barebones HTTP/1.1 server built only with raw TCP sockets (`net` module), implemented my own routing system
No frameworks used.

## usage

```sh
$ git clone https://github.com/greatm3/HTTP-from-scratch

$ cd HTTP-from-scratch

# Install dependencies
npm install

# compiles the typescript to js, creates a dist/ directory
npm build

```

## Usage
```js

import HTTPServer from "./dist/HttpServer.js";

const server = new HTTPServer({
    port: 8000,
    host: "127.0.0.1"
}) // even without providing the host and port, it defaults to localhost and port: 8000

server.makeServer((req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.write("<h1>Hello</h1>")
    res.connection.end()
})
 

server.listen()

```

- open your browser and go to `http://127.0.0.1:8000`

## TODOs
- [x] Basic HTTP request parsing
- [x] GET method routing
- [x] Response object with status/headers
- [ ] POST method with body parsing
- [ ] Query parameter parsing (?name=value)
- [ ] Static file serving 

### RFC Features to Add
- [x] Support `Content-Length` body parsing  
- [ ] Implement `Transfer-Encoding: chunked` decoding  
- [ ] Connection persistence (`keep-alive` by default)  
- [ ] Handle `Connection: close` termination  
- [x] Improve header parsing (case-insensitive keys, trim values)  
- [ ] Return standard headers (`Date`, `Server`, `Connection`)  
- [ ] Handle `405 Method Not Allowed`  
- [ ] Robust error handling for unhandled exceptions  
- [ ] Optional caching headers (`ETag`, `Cache-Control`)  
