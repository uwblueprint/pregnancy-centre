import dotenv from "dotenv";
import { exit } from "process";
import faker from "faker";
import mongoose from "mongoose";

import { connectDB } from "../database/mongoConnection";

import { DonationForm, DonationItemCondition, DonationItemStatus } from "../database/models/donationFormModel";
import { Request } from "../database/models/requestModel";
import { RequestGroup } from "../database/models/requestGroupModel";
import { RequestType } from "../database/models/requestTypeModel";

// -----------------------------------------------------------------------------
// SEED REQUESTS/TAGS
// -----------------------------------------------------------------------------

dotenv.config();

const requestGroupNames = [
    "Strollers",
    "Cribs",
    "Gates",
    "Monitors",
    "Bibs",
    "Clothes",
    "Chairs",
    "Seats",
    "Mats",
    "Toys",
    "Pacifiers",
    "Dishes",
    "Slings",
    "Bags",
    "Books",
    "Electronics",
    "Yards",
    "Bassinets",
    "Bedding",
    "Machines",
    "Bottles",
    "Cutlery",
    "Mobile",
    "Hygiene",
    "Storage"
];
const requestGroupImages = [
    "https://source.unsplash.com/RcgiSN482VI",
    "https://source.unsplash.com/7ydep8OEvbc",
    "https://source.unsplash.com/0hiUWSi7jvs"
];
const donationFormConditions: string[] = Object.keys(DonationItemCondition);
const donationFormStatuses: string[] = Object.keys(DonationItemStatus);

const numGroups = requestGroupNames.length;
const numTypesPerGroup = 5;
const maxNumRequestsPerType = 10;
const maxUnclassifiedDonationForms = 10;
const maxDonationFormsPerRequestGroup = 10;
const maxQuantityPerRequest = 15;
const maxQuantityPerDonationForm = 15;
const probRequestDeleted = 0.05;
const probRequestFulfilled = 0.2; // independent from probRequestDeleted
const startDate = new Date(2019, 0, 1);
const endDate = new Date(Date.now());

faker.seed(2021);

const randomDate = (start = startDate, end = endDate) => {
    const result = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return result.getTime();
};

// create Request model object without references
const createRequest = () => {
    const isDeleted = Math.random() <= probRequestDeleted;
    const isFulfilled = Math.random() <= probRequestFulfilled;
    const dateCreated = randomDate();

    const request = new Request({
        _id: mongoose.Types.ObjectId(),
        quantity: Math.floor(Math.random() * maxQuantityPerRequest) + 1,
        clientName: faker.name.firstName() + " " + faker.name.lastName(),
        createdAt: dateCreated
    });

    if (isDeleted) {
        request.deletedAt = new Date(randomDate(new Date(dateCreated)));
    }
    if (isFulfilled) {
        request.fulfilledAt = new Date(randomDate(new Date(dateCreated)));
    }

    return request;
};

// create RequestType model object without references
const createRequestType = () => {
    const dateCreated = new Date(randomDate());

    return new RequestType({
        _id: mongoose.Types.ObjectId(),
        name: faker.commerce.product(),
        createdAt: dateCreated
    });
};

// create RequestGroup model object without references
const createRequestGroup = (name: string) => {
    const dateCreated = new Date(randomDate());

    return new RequestGroup({
        _id: mongoose.Types.ObjectId(),
        name,
        // description is in the format specified by DraftJS
        description:
            '{"blocks":[{"key":"bv0s8","text":"' +
            faker.lorem.sentence() +
            '","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
        image: faker.random.arrayElement(requestGroupImages),
        createdAt: dateCreated
    });
};

// create DonationForm model object
// optionally pass in a requestGroup to classify the donation item
const createDonationForm = (requestGroup = null) => {
    const dateCreated = new Date(randomDate());

    // if not classified under a requestGroup, generate random name
    const name = requestGroup ? requestGroup.name : faker.commerce.product();
    const status = faker.random.arrayElement(donationFormStatuses);
    const statusFields: { status: string; donatedAt?: Date; matchedAt?: Date } = {
        status
    };
    if (status === DonationItemStatus.PENDING_MATCH || status === DonationItemStatus.MATCHED) {
        statusFields.donatedAt = new Date(randomDate(dateCreated));
    }
    if (status === DonationItemStatus.MATCHED) {
        statusFields.matchedAt = new Date(randomDate(statusFields.donatedAt));
    }

    const quantity = Math.floor(Math.random() * maxQuantityPerDonationForm) + 1;

    return new DonationForm({
        _id: mongoose.Types.ObjectId(),
        contact: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.phoneNumber("!##-!##-####")
        },
        name: name,
        description: faker.lorem.sentence(),
        ...(!!requestGroup && { requestGroup: requestGroup._id }),
        quantity: quantity,
        quantityRemaining: quantity,
        age: Math.floor(Math.random() * 21), // random integer between 0 and 20
        condition: faker.random.arrayElement(donationFormConditions),
        createdAt: dateCreated,
        ...statusFields
    });
};

// connect to DB, and on success, seed documents
connectDB(async () => {
    console.log("\x1b[34m", "Beginning to seed");
    console.log("\x1b[0m");

    // Reset collections
    Request.deleteMany((err) => {
        if (err) {
            console.error("\x1b[31m", "Failed to delete all documents in 'requests' collection");
            console.log("\x1b[0m");
            exit();
        }
    });
    RequestGroup.deleteMany((err) => {
        if (err) {
            console.error("\x1b[31m", "Failed to delete all documents in 'requestGroups' collection");
            console.log("\x1b[0m");
            exit();
        }
    });
    RequestType.deleteMany((err) => {
        if (err) {
            console.error("\x1b[31m", "Failed to delete all documents in 'requestTypes' collection");
            console.log("\x1b[0m");
            exit();
        }
    });
    DonationForm.deleteMany((err) => {
        if (err) {
            console.error("\x1b[31m", "Failed to delete all documents in 'donationForms' collection");
            console.log("\x1b[0m");
            exit();
        }
    });

    console.log("\x1b[34m", "Seeding data");
    console.log("\x1b[0m");

    const numUnclassifiedDonationGroups = Math.floor(Math.random() * maxUnclassifiedDonationForms);

    // generate donation items that don't belong to any requestGroup
    for (let i = 0; i < numUnclassifiedDonationGroups; i++) {
        const donationForm = createDonationForm();
        await donationForm.save();
    }

    for (let i = 0; i < numGroups; i++) {
        const requestGroup = createRequestGroup(requestGroupNames[i]);
        requestGroup.requestTypes = [];
        requestGroup.donationForms = [];
        await requestGroup.save();

        const numClassifiedDonationForms = Math.floor(Math.random() * maxDonationFormsPerRequestGroup);

        // generate donation items under a request group
        for (let j = 0; j < numClassifiedDonationForms; j++) {
            const donationForm = createDonationForm(requestGroup);
            await donationForm.save();
            requestGroup.donationForms.push({ _id: donationForm._id });
        }

        for (let j = 0; j < numTypesPerGroup; j++) {
            const requestType = createRequestType();
            requestType.requests = [];
            requestType.requestGroup = requestGroup._id;
            await requestType.save();

            const numRequestsPerType = Math.floor(Math.random() * maxNumRequestsPerType);
            for (let k = 0; k < numRequestsPerType; k++) {
                const request = createRequest();
                request.matchedDonations = [];
                request.requestType = requestType._id;

                await request.save();

                requestType.requests.push({
                    _id: request._id,
                    createdAt: request.createdAt,
                    deletedAt: request.deletedAt,
                    fulfilledAt: request.fulfilledAt
                });
            }

            requestGroup.requestTypes.push({
                _id: requestType._id
            });

            await requestType.save();
        }
        await requestGroup.save();
    }

    console.log("\x1b[34m", "Finished seeding!");
    console.log("\x1b[0m");
    exit();
});
