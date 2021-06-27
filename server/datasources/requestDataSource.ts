import CachedMongooseDataSource from "./cachedMongooseDataSource";
import { RequestCache } from "../database/cache";
import { RequestDocument } from "../models/requestModel";

export default class RequestDataSource extends CachedMongooseDataSource<RequestDocument> {
    constructor() {
        super(RequestCache);
    }
}
