require('dotenv').config();
import mongoose from 'mongoose';
import faker from 'faker';
import { exit } from 'process';

import { Request } from "../models/requestModel";
import { TagEnum } from "../models/tagSchema";
import { connectDB } from "../mongoConnection";

//-----------------------------------------------------------------------------
// SEED REQUESTS/TAGS
//-----------------------------------------------------------------------------

// connect to DB, and on success, seed documents
connectDB(() => {
    // Reset collections
    Request.deleteMany((err) => {
        if (err) {
            console.error('\x1b[31m', "Failed to delete all documents in 'requests' collection");
            console.log('\x1b[0m');
            exit();
        }
    });

    const num_requests = 1;
    const num_tags_per_request = 3;

    faker.seed(2021);
    for (var i = 0; i < num_requests; i++) {
        var request_tags = []
        for (var j = 0; j < num_tags_per_request; j++) {
            const tag_type = Math.floor(Math.random() * TagEnum.length);
            var tag_value;

            switch (tag_type) {
                case 0: // 'LOCATION'
                    tag_value = faker.commerce.product();
                    break;
                case 1: // 'CATEGORY'
                    tag_value = faker.address.city();
                    break;
                case 3: // 'PRICE_RANGE'
                    tag_value = [faker.finance.amount(1,50,2), faker.finance.amount(51,100,2)];
                    break;
                default:
                    tag_value = "";
            }

            const tag = {
                type: TagEnum[tag_type],
                value: tag_value
            };
            request_tags.push(tag);
        }

        const request = new Request({
            request_id: faker.random.alphaNumeric(6),
            name: faker.commerce.productName(),
            description: faker.lorem.sentence(),
            image: "https://picsum.photos/200",
            priority: faker.random.number(3),
            tags: request_tags
        });
        request.save((err) => {
            if (err) {
                console.error('\x1b[31m', "Attempted to seed request #" + i + " but failed:");
                console.log('\x1b[0m');
                console.error(err);
                exit();
            }
        });
    }
});
