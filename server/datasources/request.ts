export {}
const { DataSource } = require('apollo-datasource');
const Request  = require('../models/requestModel');


class RequestAPI extends DataSource {
    constructor() {
        super();
    }

    async getRequestById(id) {

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

module.exports = RequestAPI;
