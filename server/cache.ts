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

    init() {
        this.data = this.query.exec();
        this.model.watch().on('change', () => this.query.exec());
    }

    getData() {
        return this.data;
    }
}

import { Request } from "./models/requestModel";
const RequestsCache = new Cache(Request, Request.find());

export { RequestsCache };
