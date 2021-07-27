/*
  Script for migrating from the .env -> OLD_MONGO_URI 
  db containing the db schema used in phase 1 to 
  .env -> MONGO_URI db containing the new schema.

  To use:
  - ensure .env has appropriate OLD_MONGO_URI and MONGO_URI
  - ensure correct schema versioning of the two databases
  - run this script and leave running until it exits to ensure
    data integrity
  - preferred: verify contents of MONGO_URI are correct
*/


import dotenv from "dotenv";
import { exit } from "process";
import mongoose from "mongoose";

import { connectDB } from "../database/mongoConnection";

import { Request } from '../database/models/requestModel'
import { RequestGroup } from '../database/models/requestGroupModel'
import { RequestType } from '../database/models/requestTypeModel'

dotenv.config();

// ------------------------------------------------------------------- //
// OLD MODELS AND DOCUMENT TYPES
// ------------------------------------------------------------------- //

interface OldClientInterface {
  _id: mongoose.Types.ObjectId
  clientId: string
  fullName: string
  deleted: boolean
}
type OldClientDocument = OldClientInterface & mongoose.Document;
const OldClientSchema = new mongoose.Schema({
  clientId: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
})

interface OldRequestGroupInterface {
  _id: mongoose.Types.ObjectId
  name: string
  dateUpdated: Date,
  dateCreated: Date,
  description: string
  deleted: boolean
  requirements: string
  image: string
  requestTypes: [mongoose.Types.ObjectId]
}
type OldRequestGroupDocument = OldRequestGroupInterface & Document;
const OldRequestGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dateUpdated: {
    type: Date,
    required: true,
    default: Date.now()
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now()
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  description: {
    type: String
  },
  requirements: {
    type: String
  },
  image: {
    type: String
  },
  requestTypes: {
    type: [ { type: mongoose.Types.ObjectId, ref: 'RequestType' } ],
    default: []
  }
}, {
  timestamps: {
    currentTime: Date.now,
    updatedAt: 'dateUpdated',
    createdAt: 'dateCreated'
  }
})

interface OldRequestInterface {
  _id: mongoose.Types.ObjectId
  requestType: mongoose.Types.ObjectId
  requestId: string
  client: mongoose.Types.ObjectId
  dateUpdated: Date
  dateCreated: Date
  dateFulfilled: Date
  deleted: boolean
  fulfilled: boolean
  quantity: number 
}
type OldRequestDocument = OldRequestInterface & Document;
const OldRequestSchema = new mongoose.Schema({
  requestType: {
    type: mongoose.Types.ObjectId, ref: 'RequestType'
  },
  requestId: {
    type: String,
  },
  client: {
    type: mongoose.Types.ObjectId, ref: 'Client'
  },
  dateUpdated: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateFulfilled: {
    type: Date,
    required: false,
    default: undefined
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  fulfilled: {
    type: Boolean,
    required: true,
    default: false
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, {
  timestamps: {
    currentTime: Date.now,
    updatedAt: 'dateUpdated',
    createdAt: 'dateCreated'
  }
})

interface OldRequestTypeInterface {
  _id: mongoose.Types.ObjectId
  requestGroup: mongoose.Types.ObjectId
  name: string
  dateUpdated: Date,
  dateCreated: Date,
  deleted: boolean,
  requests: Array<mongoose.Types.ObjectId>
}
type OldRequestTypeDocument = OldRequestTypeInterface & Document
const OldRequestTypeSchema = new mongoose.Schema({
  requestGroup: {
    type: mongoose.Types.ObjectId, ref: 'RequestGroup'
  },
  name: {
    type: String,
    required: true
  },
  dateUpdated: {
    type: Date,
    required: true,
    default: Date.now()
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now()
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  requests: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'Request' }],
    default: []
  }
}, {
  timestamps: {
    currentTime: Date.now,
    updatedAt: 'dateUpdated',
    createdAt: 'dateCreated'
  }
})


// ------------------------------------------------------------------- //
// UTILITY FUNCTIONS
// ------------------------------------------------------------------- //

const createRequest = (_id, deleted, fulfilled, quantity, clientName, updatedAt, createdAt) => {
  const request = new Request({
    _id: _id,
    quantity: quantity,
    clientName: clientName,
    createdAt: createdAt,
    updatedAt: updatedAt
  })
  if (deleted) request.deletedAt = updatedAt
  if (fulfilled) request.fulfilledAt = updatedAt

  return request
}

const createRequestType = (_id, name, deleted, updatedAt, createdAt) => {
  const requestType = new RequestType({
    _id: _id,
    name: name,
    createdAt: createdAt,
    updatedAt: updatedAt
  })
  if (deleted) requestType.deletedAt = updatedAt

  return requestType
}

const createRequestGroup = (_id, name, description, image, deleted, updatedAt, createdAt) => {
  const requestGroup = new RequestGroup({
    _id: _id,
    name: name,
    description: description,
    image: image,
    createdAt: createdAt,
    updatedAt: updatedAt
  })
  if (deleted) requestGroup.deletedAt = updatedAt

  return requestGroup
}

const requestEmbeddingFromRequest = (request) => {
  const embedding = {
      _id: request._id,
      createdAt: request.createdAt ? request.createdAt : null,
  }
  if (request.deletedAt) embedding["deletedAt"] = request.deletedAt;
  if (request.fulfilledAt) embedding["fulfilledAt"] = request.fulfilledAt;
  return embedding;
}

const requestTypeEmbeddingFromRequestType = (requestType) => {
  return {
      _id: requestType._id
  }
}

const getOldData = async () => {
  const oldUri = process.env.OLD_MONGO_URI;
  const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false // use MongoDB driver's findOneAndUpdate() instead of its findAndModify() function
  }; 
  const conn = mongoose.createConnection(oldUri, options);

  const Client = conn.model('Client', OldClientSchema)
  const RequestGroup = conn.model('RequestGroup', OldRequestGroupSchema)
  const Request = conn.model('Request', OldRequestSchema)
  const RequestType = conn.model('RequestType', OldRequestTypeSchema)
  
  const clients = await Client.find().exec().then((data: Array<mongoose.Document>) => { 
    return data as unknown as Array<OldClientDocument>;
  });
  const requestgroups = await RequestGroup.find().exec().then((data: Array<mongoose.Document>) => { 
    return data as unknown as Array<OldRequestGroupDocument>;
  });
  const requests = await Request.find().exec().then((data: Array<mongoose.Document>) => { 
    return data as unknown as Array<OldRequestDocument>;
  });
  const requesttypes = await RequestType.find().exec().then((data: Array<mongoose.Document>) => { 
    return data as unknown as Array<OldRequestTypeDocument>;
  });

  return {clients: clients, requestgroups: requestgroups, requests: requests, requesttypes: requesttypes};
}

// ------------------------------------------------------------------- //
// MIGRATION SCRIPT
// ------------------------------------------------------------------- //

connectDB(async () => {
  console.log('Started migration!');

  console.log('Fetching old data!');
  const { clients: oldClients, requestgroups: oldRequestGroups, requests: oldRequests, requesttypes: oldRequestTypes } = await getOldData();
  console.log('Fetched old data!');
  
  const newRequestGroups = {};
  for (const requestGroup of oldRequestGroups) {
    const newRequestGroup = createRequestGroup(requestGroup._id, requestGroup.name, requestGroup.description, requestGroup.image, requestGroup.deleted, requestGroup.dateUpdated, requestGroup.dateCreated);
    newRequestGroups[newRequestGroup._id.toString()] = newRequestGroup;

    await newRequestGroup.save();
  }

  console.log('Migrated RequestGroups!');

  const newRequestTypes = {};
  for (const requestType of oldRequestTypes) {
    const newRequestType = createRequestType(requestType._id, requestType.name, requestType.deleted, requestType.dateUpdated, requestType.dateCreated);
    newRequestTypes[newRequestType._id.toString()] = newRequestType;

    const newRequestTypeEmbedding = requestTypeEmbeddingFromRequestType(newRequestType);
    newRequestGroups[requestType.requestGroup.toString()].requestTypes.push(newRequestTypeEmbedding);
    newRequestType.requestGroup = requestType.requestGroup;

    await newRequestType.save();
    await newRequestGroups[requestType.requestGroup.toString()].save();
  }
  console.log('Migrated RequestTypes!');
  console.log('Added RequestType embeddings to RequestGroups!');
  
  const newRequests = {};
  for (const request of oldRequests) {
    const client = oldClients.find((c : OldClientDocument) => {
      return request.client.equals(c._id);
    });

    if (client === undefined) {
      console.log("ERROR: FAILED TO FIND CLIENT WITH ID: " + request.client.toString());
      return;
    };

    const newRequest = createRequest(request._id, request.deleted, request.fulfilled, request.quantity, client.fullName, request.dateUpdated, request.dateCreated);
    newRequests[newRequest._id.toString()] = newRequest;

    const newRequestEmbedding = requestEmbeddingFromRequest(newRequest);
    newRequestTypes[request.requestType.toString()].requests.push(newRequestEmbedding);
    newRequest.requestType = request.requestType;

    await newRequest.save();
    await newRequestTypes[request.requestType.toString()].save();
  }
  console.log('Migrated Requests and Clients!');
  console.log('Added Request embeddings to RequestTypes!');

  console.log('Finished migration!');
  exit();
});
