import dotenv from 'dotenv'
import { exit } from 'process'
import faker from 'faker'

import { connectDB } from './mongoConnection'
import { Request } from './models/requestModel'
import { TagEnum } from './models/tagSchema'

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

  const numRequests = 1
  const numTagsPerRequest = 5

  console.log('\x1b[34m', 'Seeding ' + numRequests + ' requests with ' + numTagsPerRequest + ' tags each')
  console.log('\x1b[0m')
  faker.seed(2021)
  for (let i = 0; i < numRequests; i++) {
    const requestTags = []
    for (let j = 0; j < numTagsPerRequest; j++) {
      const tagType = Math.floor(Math.random() * TagEnum.length)
      let tagValue

      switch (tagType) {
        case 0: // 'CATEGORY'
          tagValue = { category: faker.commerce.product() }
          break
        case 1: // 'LOCATION'
          tagValue = { city: faker.address.city() }
          break
        case 3: // 'PRICE_RANGE'
          tagValue = { low: faker.finance.amount(1, 50, 2), high: faker.finance.amount(51, 100, 2) }
          break
        default:
          tagValue = ''
      }

      const tag = {
        type: TagEnum[tagType],
        value: tagValue
      }
      requestTags.push(tag)
    }

    const request = new Request({
      request_id: faker.random.alphaNumeric(6),
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      image: 'https://picsum.photos/200',
      priority: faker.random.number(3),
      tags: requestTags
    })
    request.save((err) => {
      if (err) {
        console.error('\x1b[31m', 'Attempted to seed request #' + i + ' but failed:')
        console.log('\x1b[0m')
        console.error(err)
        exit()
      }
    })
  }

  console.log('\x1b[34m', 'Finished seeding!')
  console.log('\x1b[0m')
})
