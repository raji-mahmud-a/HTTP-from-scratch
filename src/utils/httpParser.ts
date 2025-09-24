function parseRequestMessage(requestData: string) {
    if (!requestData) return {}

    const [head, body] = requestData.split("\r\n\r\n");
    const lines = head.split("\r\n");

    const regex = {
        requestLine: /^(GET|POST)\s+(\S+)+\sHTTP\/(\d.\d)$/,
        headerLines: /^([^:]+):\s*(.*)$/,
    };

    const requestLine = regex.requestLine.exec(lines[0]);

    if (!requestLine) return undefined;

    const [_, method, path, version] = requestLine;

    const headers: Record<string, string> = {};

    for (let i = 0; i < lines.length; i++) {
        const headerLine = regex.headerLines.exec(lines[i]);

        if (headerLine) {
            let [_, key, value] = headerLine;
            key = key.toLowerCase();

            headers[key] = value;
        }
    }

    return { method, path, version, headers, body };
}

const utils = {
    parseRequestMessage
}

export default utils
