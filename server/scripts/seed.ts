import dotenv from 'dotenv'
import { exit } from 'process'
import faker from 'faker'
import mongoose from 'mongoose'

import { connectDB } from '../database/mongoConnection'

import { Client } from '../models/clientModel'
import { Request } from '../models/requestModel'
import { RequestGroup } from '../models/requestGroupModel'
import { RequestType } from '../models/requestTypeModel'

// -----------------------------------------------------------------------------
// SEED REQUESTS/TAGS
// -----------------------------------------------------------------------------

dotenv.config()

const createClient = (clientIDs, clientIdx) => {
  const client = new Client({
    _id: mongoose.Types.ObjectId(),
    clientId: faker.random.alphaNumeric(8),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  })
  clientIDs.push(client._id) // store IDs to allocate among groups + types
  const promise = client.save().catch((err) => {
    if (err) {
      console.error('\x1b[31m', 'Attempted to seed client # ' + clientIdx + ' but failed:')
      console.log('\x1b[0m')
      console.error(err)
      exit()
    }
  })
  return promise
}

const createRequest = (requestID, clientIDs, requestTypeID, requestIdx, groupIdx, typeIdx) => {
  const request = new Request({
    _id: requestID,
    requestId: faker.random.alphaNumeric(6),
    client: faker.random.arrayElement(clientIDs),
    requestType: requestTypeID
  })
  const promise = request.save().catch((err) => {
    if (err) {
      console.error('\x1b[31m', 'Attempted to seed request # ' + requestIdx + ' for group ' + groupIdx + ', type ' + typeIdx + ' but failed:')
      console.log('\x1b[0m')
      console.error(err)
      exit()
    }
  })
  return promise
}

const createRequestType = (typeID, requestIDsForType, requestGroupID, typeIdx, groupIdx) => {
  const type = new RequestType({
    _id: typeID,
    name: faker.commerce.product(),
    requests: {
      fulfilled: [],
      deleted: [],
      open: requestIDsForType
    },
    requestGroup: requestGroupID
  })
  const promise = type.save().catch((err) => {
    if (err) {
      console.error('\x1b[31m', 'Attempted to seed type #' + typeIdx + ' for group ' + groupIdx + ' but failed:')
      console.log('\x1b[0m')
      console.error(err)
      exit()
    }
  })
  return promise
}

const createRequestGroup = (groupID, typeIDs, groupIdx) => {
  const group = new RequestGroup({
    _id: groupID,
    name: faker.commerce.department(),
    description: faker.lorem.sentence(),
    requirements: faker.lorem.sentence(),
    image: 'https://picsum.photos/200',
    requestTypes: typeIDs
  })
  const promise = group.save().catch((err) => {
    if (err) {
      console.error('\x1b[31m', 'Attempted to seed group #' + groupIdx + ' but failed:')
      console.log('\x1b[0m')
      console.error(err)
      exit()
    }
  })
  return promise
}

// connect to DB, and on success, seed documents
connectDB(() => {
  console.log('\x1b[34m', 'Beginning to seed')
  console.log('\x1b[0m')

  // Reset collections
  Request.deleteMany((err) => {
    if (err) {
      console.error('\x1b[31m', "Failed to delete all documents in 'requests' collection")
      console.log('\x1b[0m')
      exit()
    }
  })
  RequestGroup.deleteMany((err) => {
    if (err) {
      console.error('\x1b[31m', "Failed to delete all documents in 'requestGroups' collection")
      console.log('\x1b[0m')
      exit()
    }
  })
  RequestType.deleteMany((err) => {
    if (err) {
      console.error('\x1b[31m', "Failed to delete all documents in 'requestTypes' collection")
      console.log('\x1b[0m')
      exit()
    }
  })
  Client.deleteMany((err) => {
    if (err) {
      console.error('\x1b[31m', "Failed to delete all documents in 'client' collection")
      console.log('\x1b[0m')
      exit()
    }
  })

  faker.seed(2021)

  const numClients = 50
  const numGroups = 5
  const numTypesPerGroup = 5
  const numRequestsPerType = 50

  console.log('\x1b[34m', 'Seeding data')
  console.log('\x1b[0m')
  const promises = []

  const clientIDs = []
  for (let clientIdx = 0; clientIdx < numClients; clientIdx++) {
    const clientPromise = createClient(clientIDs, clientIdx)
    promises.push(clientPromise) // for tracking completion
  }

  for (let groupIdx = 0; groupIdx < numGroups; groupIdx++) {
    const groupID = mongoose.Types.ObjectId()
    const typeIDsForGroup = []
    for (let typeIdx = 0; typeIdx < numTypesPerGroup; typeIdx++) {
      typeIDsForGroup.push(mongoose.Types.ObjectId())
      const requestIDsForType = []
      for (let requestIdx = 0; requestIdx < numRequestsPerType; requestIdx++) {
        requestIDsForType.push(mongoose.Types.ObjectId())
        promises.push(createRequest(requestIDsForType[requestIdx], clientIDs, typeIDsForGroup[typeIdx], requestIdx, groupIdx, typeIdx))
      }
      promises.push(createRequestType(typeIDsForGroup[typeIdx], requestIDsForType, groupID, typeIdx, groupIdx))
    }
    promises.push(createRequestGroup(groupID, typeIDsForGroup, groupIdx))
  }

  Promise.all(promises).then(() => {
    console.log('\x1b[34m', 'Finished seeding!')
    console.log('\x1b[0m')
    exit()
  })
})
