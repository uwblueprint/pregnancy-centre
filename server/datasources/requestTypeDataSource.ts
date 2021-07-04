import CachedMongooseDataSource from "./cachedMongooseDataSource";
import { RequestTypeCache } from "../database/cache";
import { RequestTypeDocument } from "../models/requestTypeModel";

export default class RequestTypeDataSource extends CachedMongooseDataSource<RequestTypeDocument> {
    constructor() {
        super(RequestTypeCache);
    }
}
