import { Writable } from "node:stream";

class ResponseMessage extends Writable {
    statusCode: number
    constructor() {
        super();

    }
}

export default ResponseMessage