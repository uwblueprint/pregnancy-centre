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
  for (let i = 0; i < numClients; i++) {
    const client = new Client({
      _id: mongoose.Types.ObjectId(),
      clientId: faker.random.alphaNumeric(8),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    })
    clientIDs.push(client._id) // store IDs to allocate among groups + types
    const promise = client.save().catch((err) => {
      if (err) {
        console.error('\x1b[31m', 'Attempted to seed client # ' + i + ' but failed:')
        console.log('\x1b[0m')
        console.error(err)
        exit()
      }
    })
    promises.push(promise) // for tracking completion
  }

  const requestIDs = []
  for (let groupIdx = 0; groupIdx < numGroups; groupIdx++) {
    for (let typeIdx = 0; typeIdx < numTypesPerGroup; typeIdx++) {
      for (let requestIdx = 0; requestIdx < numRequestsPerType; requestIdx++) {
        const request = new Request({
          _id: mongoose.Types.ObjectId(),
          requestId: faker.random.alphaNumeric(6),
          client: faker.random.arrayElement(clientIDs)
        })
        requestIDs.push(request._id) // store IDs to allocate among groups + types
        const promise = request.save().catch((err) => {
          if (err) {
            console.error('\x1b[31m', 'Attempted to seed request # ' + requestIdx + ' for group ' + groupIdx + ', type ' + typeIdx + ' but failed:')
            console.log('\x1b[0m')
            console.error(err)
            exit()
          }
        })
        promises.push(promise) // for tracking completion
      }
    }
  }

  const typeIDs = []
  for (let groupIdx = 0; groupIdx < numGroups; groupIdx++) {
    for (let typeIdx = 0; typeIdx < numTypesPerGroup; typeIdx++) {
      const type = new RequestType({
        _id: mongoose.Types.ObjectId(),
        name: faker.commerce.product(),
        requests: {
          fulfilled: [],
          deleted: [],
          open: requestIDs
        },
      })
      typeIDs.push(type._id) // store IDs to allocate among groups + types
      const promise = type.save().catch((err) => {
        if (err) {
          console.error('\x1b[31m', 'Attempted to seed type #' + typeIdx + ' for group ' + groupIdx + ' but failed:')
          console.log('\x1b[0m')
          console.error(err)
          exit()
        }
      })
      promises.push(promise) // for tracking completion
    }
  }

  for (let groupIdx = 0; groupIdx < numGroups; groupIdx++) {
    const group = new RequestGroup({
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
    promises.push(promise) // for tracking completion
  }

  Promise.all(promises).then(() => {
    console.log('\x1b[34m', 'Finished seeding!')
    console.log('\x1b[0m')
    exit()
  })
})
