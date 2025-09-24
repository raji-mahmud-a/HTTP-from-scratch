

function parseRequestMessage(requestData: string) {
    const [head, body] = requestData.split("\r\n\r\n")
    const lines = head.split("\r\n")

    const regex = {
        requestLine: /^(GET|POST)\s+(\S+)+\sHTTP\/(\d.\d)$/,
        headerLines: /^([^:]+):\s*(.*)$/
    }
})