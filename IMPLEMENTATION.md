# HTTP Server Improvements Checklist

## 🔴 Critical Issues (Fix Immediately)

### Security & Correctness
- [ ] **Add request size limits** to prevent memory exhaustion attacks
  - Set MAX_REQUEST_SIZE constant (e.g., 1MB)
  - Track totalBytes in data handler
  - Respond with 413 Payload Too Large when exceeded
  - Close connection after limit breach

- [ ] **Fix Content-Length based parsing** to prevent request smuggling
  - Parse Content-Length header from request
  - Only consider request complete when: headerEndIndex + 4 + contentLength bytes received
  - Don't rely solely on `\r\n\r\n` detection
  - Handle missing Content-Length for GET/HEAD requests

- [ ] **Fix headersSent bug in response.ts**
  - Line: `this.headersSent = false;` should be `this.headersSent = true;`
  - After sending headers, set flag to true, not false

### HTTP Compliance
- [ ] **Support all HTTP methods** in request parsing
  - Change regex from `(GET|POST)` to `([A-Z]+)`
  - Support: PUT, DELETE, PATCH, OPTIONS, HEAD, CONNECT, TRACE

- [ ] **Validate Host header** (required in HTTP/1.1)
  - Check if Host header exists in request
  - Respond with 400 Bad Request if missing
  - Per RFC 7230 section 5.4

## 🟡 Important Issues (Fix Soon)

### Connection Management
- [ ] **Fix timeout handling** in httpServer.ts
  - Clear timeout when request completes successfully
  - Reset timeout for persistent connections between requests
  - Prevent timeout from killing connection prematurely

- [ ] **Remove redundant `connection.end()` in close handler**
  - Connection is already closed when 'close' event fires
  - This call does nothing and can be removed

### Data Handling
- [ ] **Make query parameter handling consistent**
  - parseQuery returns `undefined` or object
  - Constructor defaults to `{}`
  - Pick one: always return object or always allow undefined

- [ ] **Decide on stream vs property for request body**
  - Current `_read()` implementation pushes entire body at once
  - Either: implement proper streaming (chunk by chunk)
  - Or: remove Readable inheritance and use body as plain property

### Response Improvements
- [ ] **Expand status code map** in response.ts
  - Add: 100 Continue, 206 Partial Content
  - Add: 307 Temporary Redirect, 308 Permanent Redirect
  - Add: 410 Gone, 429 Too Many Requests
  - Add: 501 Not Implemented, 504 Gateway Timeout

## 🟢 Feature Additions (Future Enhancements)

### Essential HTTP/1.1 Features
- [ ] **Implement chunked transfer encoding support**
  - Parse `Transfer-Encoding: chunked` header
  - Handle chunk size lines (hex format)
  - Reassemble chunks into complete body
  - Handle trailing headers

- [ ] **Add Expect: 100-continue support**
  - Detect `Expect: 100-continue` header
  - Send `HTTP/1.1 100 Continue` before reading body
  - Allow server to reject before client sends large body

- [ ] **Implement HTTP pipelining**
  - Handle multiple requests on single connection
  - Queue responses in correct order
  - Maintain request-response ordering

### Content Handling
- [ ] **Add multipart/form-data parsing**
  - Parse boundary from Content-Type header
  - Handle file uploads
  - Parse mixed text and binary data
  - Support multiple files in single request

- [ ] **Implement compression support**
  - Parse `Accept-Encoding` header
  - Support gzip compression
  - Support deflate compression
  - Add `Content-Encoding` to response

- [ ] **Add Range request support (HTTP 206)**
  - Parse `Range` header
  - Support byte ranges (e.g., bytes=0-1023)
  - Respond with 206 Partial Content
  - Send `Content-Range` header

### Developer Experience
- [ ] **Add request/response logging**
  - Log method, path, status code
  - Include timestamp
  - Optional verbose mode for headers/body

- [ ] **Implement better error handling**
  - Catch parsing errors gracefully
  - Send proper 400 Bad Request responses
  - Don't crash server on malformed requests
  - Add error event emitter with context

- [ ] **Add request timeout configuration**
  - Make timeout configurable per-server
  - Add per-request timeout option
  - Emit timeout events

## 📚 Learning Additions 

- [ ] **Add HTTPS support**
  - Use tls.createServer() instead of net.createServer()
  - Handle SSL/TLS certificates
  - Support both HTTP and HTTPS

- [ ] **Implement HTTP/2 support**
  - Use http2 module
  - Handle binary framing
  - Support multiplexing

- [ ] **Add WebSocket upgrade support**
  - Detect Upgrade header
  - Perform WebSocket handshake
  - Switch protocols from HTTP to WebSocket

## Testing Checklist

- [ ] Test with large request bodies (>1MB)
- [ ] Test with malformed HTTP requests
- [ ] Test concurrent connections
- [ ] Test persistent connections (keep-alive)
- [ ] Test connection timeout behavior
- [ ] Test with missing required headers
- [ ] Test all HTTP methods
- [ ] Test query parameter edge cases (arrays, duplicates)
- [ ] Test different Content-Types
- [ ] Load test with tools like `wrk` or `autocannon`

---

