import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Request, RequestDocument } from '../models/requestModel';

export default class RequestDataSource extends MongoDataSource<RequestDocument> {
    async getRequestById(id) {
        const response = await Request.findById(id);
        return this.requestReducer(response[0]);
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
