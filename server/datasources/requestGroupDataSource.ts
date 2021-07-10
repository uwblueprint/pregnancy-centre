import CachedMongooseDataSource from "./cachedMongooseDataSource";
import { RequestGroupCache } from "../database/cache";
import { RequestGroupDocument } from "../models/requestGroupModel";

export default class RequestGroupDataSource extends CachedMongooseDataSource<RequestGroupDocument> {
    constructor() {
        super(RequestGroupCache);
    }
}
