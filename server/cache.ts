import { Request } from "./models/requestModel";

// TODO: add typing

class Cache {
    name: string;
    model: any;
    query: any;
    data: any;

    constructor(name, model, query) {
        this.name = name;
        this.model = model;
        this.query = query;
    }

    exec() {
        this.query.exec()
        .then((data) => {
            this.data = data;
            console.log("Finished caching " + this.name + " cache");
        })
        .catch((error) => {
            console.error("ERROR: Failed to fetch Requests from MongoDB");
        });
    }

    init() {
        this.exec();
        this.model.watch().on('change', this.exec);
    }

    getData() {
        return this.data;
    }
}

const RequestsCache = new Cache("Request", Request, Request.find());

export { Cache, RequestsCache };
