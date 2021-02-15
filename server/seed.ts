import dotenv from 'dotenv'
import { exit } from 'process'
import faker from 'faker'

import mongoose from 'mongoose'
import { connectDB } from './mongoConnection'
import { Request } from './models/requestModel'
import { RequestGroup } from './models/requestGroupModel'

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
      console.error('\x1b[31m', "Failed to delete all documents in 'request' collection")
      console.log('\x1b[0m')
      exit()
    }
  })
  RequestGroup.deleteMany((err) => {
    if (err) {
      console.error('\x1b[31m', "Failed to delete all documents in 'requestGroup' collection")
      console.log('\x1b[0m')
      exit()
    }
  })

  faker.seed(2021)

  const numGroups = 5
  const numTypesPerGroup = 5
  const numRequestsPerType = 50

  console.log('\x1b[34m', 'Seeding data')
  console.log('\x1b[0m')
  const promises = []
  for (let i = 0; i < numGroups; i++) {
    const requestTypes = []
    for (let j = 0; j < numTypesPerGroup; j++) {
      const requestIDs = []
      for (let k = 0; k < numRequestsPerType; k++) {
        const request = new Request({
          _id: mongoose.Types.ObjectId(),
          request_id: faker.random.alphaNumeric(6),
          client_id: faker.random.alphaNumeric(6)
        })
        requestIDs.push(request._id) // store IDs to allocate among groups + types
        const promise = request.save().catch((err) => {
          if (err) {
            console.error('\x1b[31m', 'Attempted to seed request # ' + k + ' for group ' + i + ', type ' + j + ' but failed:')
            console.log('\x1b[0m')
            console.error(err)
            exit()
          }
        })
        promises.push(promise) // for tracking completion
      }

      const type = {
        name: faker.commerce.product(),
        requests: {
          fulfilled: [],
          deleted: [],
          open: requestIDs
        }
      }
      requestTypes.push(type)
    }

    const group = new RequestGroup({
      name: faker.commerce.department(),
      description: faker.lorem.sentence(),
      requirements: faker.lorem.sentence(),
      image: 'https://picsum.photos/200',
      requestTypes: requestTypes
    })
    const promise = group.save().catch((err) => {
      if (err) {
        console.error('\x1b[31m', 'Attempted to seed group #' + i + ' but failed:')
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
