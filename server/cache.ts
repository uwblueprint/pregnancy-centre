import mongoose from 'mongoose';

// TODO: add typing

class Cache {
    model: any;
    query: any;
    data: any;

    constructor(model, query) {
        this.model = model;
        this.query = query;
    }

    exec() {
        this.query.exec()
        .then((data) => {
            this.data = data;
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

import { Request } from "./models/requestModel";
const RequestsCache = new Cache(Request, Request.find());

export { Cache, RequestsCache };
