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

const numClients = 300
const numGroups = requestGroupNames.length
const numTypesPerGroup = 10
const maxNumRequestsPerType = 50
const maxQuantityPerRequest = 15
const probRequestDeleted = 0.05
const probRequestFulfilled = 0.2 // independent from probRequestDeleted
const startDate = new Date(2019, 0,1)
const endDate = new Date(Date.now())

faker.seed(2021)

const randomDate = (start = startDate, end = endDate) => {
  const result = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return result.getTime()
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
    quantity: Math.floor(Math.random() * maxQuantityPerRequest) + 1,
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
  const dateCreated = new Date(randomDate())

  return new RequestType({
    _id: mongoose.Types.ObjectId(),
    name: faker.commerce.product(),
    createdAt: dateCreated
  })
}

// create RequestGroup model object without references
const createRequestGroup = () => {
  const dateCreated = new Date(randomDate())

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
connectDB(async () => {
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

  const clients = []
  for (let i = 0; i < numClients; i++) {
    const client = createClient()
    clients.push(client)
  }
  await Client.create(clients)

  for (let i = 0; i < numGroups; i++) {
    const requestGroup =  createRequestGroup()
    requestGroup.requestTypes = []
    await requestGroup.save()

    for (let j = 0; j < numTypesPerGroup; j++) {
      const requestType = createRequestType()
      requestType.requests = []
      requestType.requestGroup = requestGroup._id
      await requestType.save()

      const numRequestsPerType = Math.floor(Math.random() * maxNumRequestsPerType)
      for (let k = 0; k < numRequestsPerType; k++) {
        const request = createRequest()
        request.client = faker.random.arrayElement(clients)._id
        request.requestType = requestType._id
        await request.save()

        requestType.requests.push({
          _id: request._id,
          createdAt: request.createdAt,
          deletedAt: request.deletedAt,
          fulfilledAt: request.fulfilledAt
        })
      }

      requestGroup.requestTypes.push({
        _id: requestType._id
      })

      await requestType.save()
    }
    await requestGroup.save()
  }

  console.log('\x1b[34m', 'Finished seeding!')
  console.log('\x1b[0m')
  exit()
})
