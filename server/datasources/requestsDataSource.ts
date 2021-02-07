import { DataSource } from 'apollo-datasource';
import { RequestsCache } from '../cache';
import { Request, RequestDocument } from '../models/requestModel';

export default class RequestDataSource extends DataSource {
    constructor() {
        super();
    }

    async getRequestById(id) {
        // with cache
        // return RequestsCache.getData().filter(request => request._id === id);
        // with mongoose
        Request.findById({_id: "60204d37bfc3910e48f6337a"}).exec()
        .then((res) => {
            return this.requestReducer(JSON.stringify(res));
        })
        .catch((err) => {
            console.error(err);
        });
    }

    async getRequests() {
        // with cache
        return RequestsCache.getData();
        // with mongoose
        const res = await Request.find();
        return res.map((res) => {this.requestReducer(res)});
    }

    requestReducer(request) {
        return {
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
