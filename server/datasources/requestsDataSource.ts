import mongoose from 'mongoose';
import { DataSource } from 'apollo-datasource';
import { RequestsCache } from '../cache';
import { Request } from '../models/requestModel';

import { config } from '../config';

export default class RequestDataSource extends DataSource {
    constructor() {
        super();
    }

    async getRequestById(id) {
        id = mongoose.Types.ObjectId("60207ba42605bb489cb80e1d");
        var result;

        if (config.caching) {
            result = RequestsCache.getData().filter(request => request._id.equals(id))[0];
        } else {
            Request.findById(id).exec()
            .then((res) => {
                result = res[0];
            })
            .catch((err) => {
                console.error(err);
            });
        }

        return this.requestReducer(result);
    }

    async getRequests() {
        var result;

        if (config.caching) {
            result = RequestsCache.getData();
        } else {
            Request.find().exec()
            .then((res) => {
                result = res;
            })
            .catch((err) => {
                console.error(err);
            });
        }

        return result.map((request) => this.requestReducer(request));
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
