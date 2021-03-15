import { Types } from 'mongoose'

interface ServerResponseInterface {
    success: boolean,
    message: string,
    id: Types.ObjectId
}

export { ServerResponseInterface }