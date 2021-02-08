import { DataSource } from 'apollo-datasource';
import { RequestsCache } from '../cache';
import { Request, RequestDocument } from '../models/requestModel';

export default class RequestDataSource extends DataSource {
    constructor() {
        super();
    }

    async getRequestById(id) {
        // with cache
        return RequestsCache.getData().filter(request => request._id == id)[0]

        // with mongoose
        const response = await Request.findById(id);
        return this.requestReducer(response);
    }

    async getRequests() {
        // with cache
        return RequestsCache.getData();

        // with mongoose
        const res = await Request.find();
        return res.map(request => this.requestReducer(request));
    }

    requestReducer(request) {
        return {
            _id: request._id,
            request_id: request.request_id,
            name: request.name,
            description: request.description,
            date_created: request.date_created,
            archived: request.archived,
            deleted: request.deleted,
            fulfilled: request.fulfilled,
            image: request.image,
            priority: request.priority,
            tags: request.tags
        }
    }
}
