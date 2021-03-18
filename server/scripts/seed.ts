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

const numClients = 50
const numGroups = 5
const numTypesPerGroup = 5
const numRequestsPerType = 50

faker.seed(2021)

const requestGroupNames = ["Strollers", "Cribs", "Gates", "Monitors", "Bibs", "Clothes", "Chairs", "Seats", "Mats", "Toys", "Pacifiers", 
                           "Dishes", "Slings", "Bags", "Books", "Electronics", "Yards", "Bassinets", "Bedding", "Machines", "Bottles", 
                           "Cutlery", "Mobile", "Hygiene", "Storage"];
const requestGroupImages = ["https://source.unsplash.com/RcgiSN482VI", "https://source.unsplash.com/7ydep8OEvbc", "https://source.unsplash.com/0hiUWSi7jvs"]

const createSavePromise = (dbObject, msg) => {
  const promise = dbObject.save().catch((err) => {
    if (err) {
      console.error('\x1b[31m', msg)
      console.log('\x1b[0m')
      console.error(err)
      exit()
    }
  })
  return promise
}

const createClient = (clientIDs, errMsg) => {
  const client = new Client({
    _id: mongoose.Types.ObjectId(),
    clientId: faker.random.alphaNumeric(8),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName()
  })
  clientIDs.push(client._id) // store IDs to allocate among groups + types
  return createSavePromise(client, errMsg)
}

const createRequest = (requestID, clientIDs, requestTypeID, errMsg) => {
  const request = new Request({
    _id: requestID,
    requestId: faker.random.alphaNumeric(6),
    client: faker.random.arrayElement(clientIDs),
  })
  return createSavePromise(request, errMsg)
}

const createRequestType = (typeID, requestIDsForType, requestGroupID, errMsg) => {
  const type = new RequestType({
    _id: typeID,
    name: faker.commerce.product(),
    requests: requestIDsForType,
  })
  return createSavePromise(type, errMsg)
}

const createRequestGroup = (groupID, typeIDs, errMsg) => {
  const group = new RequestGroup({
    _id: groupID,
    name: faker.random.arrayElement(requestGroupNames),
    description: faker.lorem.sentence(),
    requirements: faker.lorem.sentence(),
    image: faker.random.arrayElement(requestGroupImages),
  })
  return createSavePromise(group, errMsg)
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

  console.log('\x1b[34m', 'Seeding data')
  console.log('\x1b[0m')
  const promises = []

  const clientIDs = []
  for (let clientIdx = 0; clientIdx < numClients; clientIdx++) {
    const clientErrMsg = 'Attempted to seed client # ' + clientIdx + ' but failed:'
    const clientPromise = createClient(clientIDs, clientErrMsg)
    promises.push(clientPromise) // for tracking completion
  }

  const groupIDs = []
  const typeIDs = []
  const requestIDs = []
  for (let groupIdx = 0; groupIdx < numGroups; groupIdx++) {
    groupIDs.push(mongoose.Types.ObjectId())
    const typeIDsForGroup = []
    const requestIDsForGroup = []
    for (let typeIdx = 0; typeIdx < numTypesPerGroup; typeIdx++) {
      typeIDsForGroup.push(mongoose.Types.ObjectId())
      const requestIDsForType = []
      for (let requestIdx = 0; requestIdx < numRequestsPerType; requestIdx++) {
        requestIDsForType.push(mongoose.Types.ObjectId())
        const requestErrMsg = 'Attempted to seed request # ' + requestIdx + ' for group ' + groupIdx + ', type ' + typeIdx + ' but failed:'
        const requestPromise = createRequest(requestIDsForType[requestIdx], clientIDs, typeIDsForGroup[typeIdx], requestErrMsg)
        promises.push(requestPromise)
      }
      requestIDsForGroup.push(requestIDsForType)
      const requestTypeErrMsg = 'Attempted to seed type #' + typeIdx + ' for group ' + groupIdx + ' but failed:'
      const requestTypePromise = createRequestType(typeIDsForGroup[typeIdx], requestIDsForType, groupIDs[groupIdx], requestTypeErrMsg)
      promises.push(requestTypePromise)
    }
    requestIDs.push(requestIDsForGroup)
    typeIDs.push(typeIDsForGroup)
    const requestGroupErrMsg = 'Attempted to seed group #' + groupIdx + ' but failed:'
    const requestGroupPromise = createRequestGroup(groupIDs[groupIdx], typeIDsForGroup, requestGroupErrMsg)
    promises.push(requestGroupPromise)
  }

  Promise.all(promises).then(() => {
    // update Request with its RequestType, RequestType with its RequestGroup, and RequestGroup with its RequestTypes
    // note that this update takes place after the objects have all been created because the fields (requestType, requestGroup, requestTypes)
    // are all references to DB objects, so the DB objects must exist before we can set these fields
    const updatePromises = []
    for (let groupIdx = 0; groupIdx < numGroups; groupIdx++) {
      for (let typeIdx = 0; typeIdx < numTypesPerGroup; typeIdx++) {
        for (let requestIdx = 0; requestIdx < numRequestsPerType; requestIdx++) {
          updatePromises.push(Request.findByIdAndUpdate(requestIDs[groupIdx][typeIdx][requestIdx], {requestType: typeIDs[groupIdx][typeIdx]}))
        }
        updatePromises.push(RequestType.findByIdAndUpdate(typeIDs[groupIdx][typeIdx], {requestGroup: groupIDs[groupIdx]}))
      }
      updatePromises.push(RequestGroup.findByIdAndUpdate(groupIDs[groupIdx], {requestTypes: typeIDs[groupIdx]}))
    }
    Promise.all(updatePromises).then(() => {
      console.log('\x1b[34m', 'Finished seeding!')
      console.log('\x1b[0m')
      exit()
    })
  })
})
