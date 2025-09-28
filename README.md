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

const server = new HTTPServer() 

server.makeServer((req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.write("<h1>Hello</h1>")
})
 

server.listen(3971, () => {
    console.log("Started at ::3971")
})

```

- open your browser and go to `http://127.0.0.1:3971`

```js
// HTTP server class inherits from EventEmitter class, so on recieving data, the instance emits a request message

server.on("request", (req, res) => {
    // knock yourself out.
})
```

## TODOs
- [x] Basic HTTP request parsing
- [x] GET method routing
- [x] Response object with status/headers
- [ ] POST method with body parsing
- [ ] Query parameter parsing (?name=value)
- [ ] Static file serving 

### RFC Features to Add 

## DISCLAIMER
- This project is for learning purposes. Not intended for production use, see [LICENSE](LICENSE).