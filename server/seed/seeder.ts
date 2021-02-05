import mongoose from 'mongoose';
import faker from 'faker';

import { Request } from "../models/requestModel";
import { Tag } from "../models/tagModel";

const data = [];
faker.seed(2021);
for (var i = 0; i < 200; i++) {
    data.push(new Request({
        request_id: faker.random.alphaNumeric(6),
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        image: "https://picsum.photos/200",
        priority: faker.random.number(3),
        tags: [
            new Tag({
                type: 'LOCATION',
                value: faker.address.city()
            }),
            new Tag({
                type: 'CATEGORY',
                value: faker.commerce.product()
            }),
            new Tag({
                type: 'PRICE_RANGE',
                value: [faker.finance.amount(1,50,2), faker.finance.amount(51,100,2)]
            })
        ]
    }));
}

console.log(data);

// TODO: only seed if DB is empty - or maybe connect to a dev collection instead of prod

const uri = "";
const options = {

};

/*mongoose.connect(uri, options);
mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB");
    console.log("Seeding MongoDB");
});
mongoose.connection.on('error', (error) => {
    console.log(error);
});*/