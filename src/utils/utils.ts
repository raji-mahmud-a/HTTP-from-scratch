function parseRequestMessage(requestData: string) {
    if (!requestData) return {};

    const [head, body] = requestData.split("\r\n\r\n");
    const lines = head.split("\r\n");

    const regex = {
        requestLine: /^([A-Za-z]+)\s+(\S+)+\sHTTP\/(\d.\d)$/,
        headerLines: /^([^:]+):\s*(.*)$/,
    };

    const requestLine = regex.requestLine.exec(lines[0]);

    if (!requestLine) return undefined;

    const [_, method, path, version] = requestLine;

    const [pathName, queryString] = path.split("?");

    const headers: Record<string, string> = {};

    for (let i = 0; i < lines.length; i++) {
        const headerLine = regex.headerLines.exec(lines[i]);

        if (headerLine) {
            let [_, key, value] = headerLine;
            key = key.toLowerCase();

            headers[key] = value;
        }
    }

    function parseFormData(body: string) {
        const params = {};

        body.split("&").forEach((entry) => {
            const [key, value] = entry.split("=");
            params[key] = value;
        });

        return params;
    }

    function isValidJson(string: string) {
        if (!string || typeof string !== "string") return false;

        try {
            JSON.parse(string);
            return true;
        } catch (error) {
            return false;
        }
    }

    // query params if any
    function parseQuery(queryString) {
        if (!queryString) return undefined;

        queryString = new URLSearchParams(queryString);

        let result = {};
        for (let field of queryString) {
            const [key, value] = field;
            if (result[key]) {
                if (Array.isArray(result[key])) {
                    result[key].push(value);
                } else {
                    result[key] = [result[key], value];
                }
            } else {
                result[key] = value;
            }
        }

        return result;
    }

    let parsedBody: string | Record<string, string> = body;

    const contentType = headers["content-type"];

    if (contentType === "application/json" && body) {
        if (isValidJson(body)) {
            parsedBody = JSON.parse(body);
        }
    } else if (contentType === "application/x-www-form-urlencoded" && body) {
        parsedBody = parseFormData(body);
    }

    return {
        method,
        path: pathName,
        version,
        headers,
        body: parsedBody,
        query: parseQuery(queryString),
    };
}

const utils = { parseRequestMessage };

export default utils;
