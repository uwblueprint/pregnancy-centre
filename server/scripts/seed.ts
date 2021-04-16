import dotenv from 'dotenv'
import { exit } from 'process'
import faker from 'faker'
import mongoose from 'mongoose'

import { connectDB } from '../database/mongoConnection'

import { Client } from '../database/models/clientModel'
import { Request } from '../database/models/requestModel'
import { RequestGroup } from '../database/models/requestGroupModel'
import { RequestType } from '../database/models/requestTypeModel'

// -----------------------------------------------------------------------------
// SEED REQUESTS/TAGS
// -----------------------------------------------------------------------------

dotenv.config()

const requestGroupNames = ["Strollers", "Cribs", "Gates", "Monitors", "Bibs", "Clothes", "Chairs", "Seats", "Mats", "Toys", "Pacifiers", 
                           "Dishes", "Slings", "Bags", "Books", "Electronics", "Yards", "Bassinets", "Bedding", "Machines", "Bottles", 
                           "Cutlery", "Mobile", "Hygiene", "Storage"];
const requestGroupImages = ["https://source.unsplash.com/RcgiSN482VI", "https://source.unsplash.com/7ydep8OEvbc", "https://source.unsplash.com/0hiUWSi7jvs"]

const numClients = 500
const numGroups = requestGroupNames.length
const numTypesPerGroup = 100
const maxNumRequestsPerType = 50
const probRequestDeleted = 0.05
const probRequestFulfilled = 0.2 // independent from probRequestDeleted
const startDate = new Date(2019, 0,1)
const endDate = new Date(Date.now())

faker.seed(2021)

const randomDate = (start = startDate, end = endDate) => {
  const result = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return result.getTime()
}

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

// create Client model object
const createClient = () => {
  return new Client({
    _id: mongoose.Types.ObjectId(),
    fullName: faker.name.firstName() + " " + faker.name.lastName()
  })
}

// create Request model object without references
const createRequest = () => {
  const isDeleted = Math.random() <= probRequestDeleted;
  const isFulfilled = Math.random() <= probRequestFulfilled;
  const dateCreated = randomDate()

  const request = new Request({
    _id: mongoose.Types.ObjectId(),
    quantity: Math.floor(Math.random() * 15) + 1,
    fulfilled: isFulfilled,
    createdAt: dateCreated
  })

  if (isDeleted) {
    request.deletedAt = new Date(randomDate(new Date(dateCreated)))
  }
  if (isFulfilled) {
    request.fulfilledAt = new Date(randomDate(new Date(dateCreated)))
  }

  return request
}

// create RequestType model object without references
const createRequestType = () => {
  const dateCreated = randomDate()

  return new RequestType({
    _id: mongoose.Types.ObjectId(),
    name: faker.commerce.product(),
    createdAt: dateCreated
  })
}

// create RequestGroup model object without references
const createRequestGroup = () => {
  const dateCreated = randomDate()

  return new RequestGroup({
    _id: mongoose.Types.ObjectId(),
    name: faker.random.arrayElement(requestGroupNames),
    // description is in the format specified by DraftJS
    description: '{"blocks":[{"key":"bv0s8","text":"' + faker.lorem.sentence() + '","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    image: faker.random.arrayElement(requestGroupImages),
    createdAt: dateCreated
  })
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
    const clientPromise = createClient(clientIDs, clientErrMsg) // pushes ID onto clientIDs
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
      const numRequestsPerType = Math.floor(Math.random() * maxNumRequestsPerType) // randomly choose number of requests for this requestType

      typeIDsForGroup.push(mongoose.Types.ObjectId())
      const requestIDsForType = []
      for (let requestIdx = 0; requestIdx < numRequestsPerType; requestIdx++) {
        requestIDsForType.push(mongoose.Types.ObjectId())
        const requestErrMsg = 'Attempted to seed request # ' + requestIdx + ' for group ' + groupIdx + ', type ' + typeIdx + ' but failed:'
        const requestPromise = createRequest(requestIDsForType[requestIdx], clientIDs, requestErrMsg)
        promises.push(requestPromise)
      }
      requestIDsForGroup.push(requestIDsForType)
      const requestTypeErrMsg = 'Attempted to seed type #' + typeIdx + ' for group ' + groupIdx + ' but failed:'
      const requestTypePromise = createRequestType(typeIDsForGroup[typeIdx], requestIDsForType, requestTypeErrMsg)
      promises.push(requestTypePromise)
    }
    requestIDs.push(requestIDsForGroup)
    typeIDs.push(typeIDsForGroup)
    const requestGroupErrMsg = 'Attempted to seed group #' + groupIdx + ' but failed:'
    const requestGroupPromise = createRequestGroup(groupIDs[groupIdx], requestGroupNames[groupIdx], requestGroupErrMsg)
    promises.push(requestGroupPromise)
  }

  Promise.all(promises).then(() => {
    // update Request with its RequestType, RequestType with its RequestGroup, and RequestGroup with its RequestTypes
    // note that this update takes place after the objects have all been created because the fields (requestType, requestGroup, requestTypes)
    // are all references to DB objects, so the DB objects must exist before we can set these fields
    const updatePromises = []
    for (let groupIdx = 0; groupIdx < numGroups; groupIdx++) {
      for (let typeIdx = 0; typeIdx < numTypesPerGroup; typeIdx++) {
        for (let requestIdx = 0; requestIdx < requestIDs[groupIdx][typeIdx].length; requestIdx++) {
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
