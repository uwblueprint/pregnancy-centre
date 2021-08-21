import dotenv from "dotenv";
import { exit } from "process";
import faker from "faker";
import mongoose from "mongoose";

import { connectDB } from "../database/mongoConnection";

import { DonationForm, DonationItemCondition, DonationItemStatus } from "../database/models/donationFormModel";
import { DonorHomepage } from "../database/models/donorHomepageModel";
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

const createDonorHomepage = () => {
    const carouselInterval = 10;
    const numMapTestimonials = faker.datatype.number({
        'min': 1,
        'max': 8
    });
    const numStats = 3;
    const map = {
        defaultMarkerSize: "53px",
        markerSizes: ["80px", "75px", "72px", "70px", "65px", "61px", "55px", "53px"],
        points: [
            {
                x: 0.28,
                y: 0.62
            },
            {
                x: 0.69,
                y: 0.54
            },
            {
                x: 0.45,
                y: 0.2
            },
            {
                x: 0.1,
                y: 0.35
            },
            {
                x: 0.62,
                y: 0.75
            },
            {
                x: 0.33,
                y: 0.39
            },
            {
                x: 0.78,
                y: 0.75
            },
            {
                x: 0.47,
                y: 0.63
            }
        ],
        testimonials: [],
        statistics: []
    };

    // Setting mapTestimonials
    for (let i = 0; i < numMapTestimonials; i++) {
        const testimonial = {
            id: i + 1,
            imagePath: faker.image.imageUrl(),
            testimonial: faker.lorem.sentence()
        };
        map.testimonials.push(testimonial);
    }

    // Setting statistics
    const statIcons = ["bi bi-people", "bi bi-calendar4", "bi bi-door-closed"];
    const statText = [
        "regular donors in the past year",
        "diapers distributed every month",
        "visits to our care closet"
    ];
    const stats = [];
    for (let i = 0; i < numStats; i++) {
        const stat = {
            icon: statIcons[i],
            measurement: `${faker.datatype.number()}+`,
            stat: statText[i]
        };
        stats.push(stat);
    }

    const banner = {
        header: "Help women and families in Kitchener-Waterloo thrive with your donation today",
        description: "Scroll to see our clients' current needs and arrange a donation",
        images: [
            "https://firebasestorage.googleapis.com/v0/b/bp-pregnancy-centre-dev-7c10c.appspot.com/o/homepage_images%2Fbanner-img-1.jpg?alt=media&token=ed2309b1-c6ee-4aa6-ab43-11ded06a473a",
            "https://firebasestorage.googleapis.com/v0/b/bp-pregnancy-centre-dev-7c10c.appspot.com/o/homepage_images%2Fbanner-img-2.jpg?alt=media&token=802ada4d-4df0-4dda-8cf1-4e9b6194da50",
            "https://firebasestorage.googleapis.com/v0/b/bp-pregnancy-centre-dev-7c10c.appspot.com/o/homepage_images%2Fbanner-img-3.jpg?alt=media&token=b5886cb8-70b3-4600-b807-edbab5283cdd",
            "https://firebasestorage.googleapis.com/v0/b/bp-pregnancy-centre-dev-7c10c.appspot.com/o/homepage_images%2Fbanner-img-4.jpg?alt=media&token=54ff90e1-20ef-4a6b-b2ab-38db5cd087a5",
            "https://firebasestorage.googleapis.com/v0/b/bp-pregnancy-centre-dev-7c10c.appspot.com/o/homepage_images%2Fbanner-img-5.jpg?alt=media&token=3a2297f4-629d-4824-8259-77c2a5f89256"
        ],
        interval: carouselInterval
    };

    const numCarouselTestimonials = faker.datatype.number({
        'min': 1,
        'max': 5
    });
    const testimonialCarousel = {
        testimonials: [],
        interval: carouselInterval
    };
    for (let i = 0; i < numCarouselTestimonials; i++) {
        const testimonial = {
            image: faker.image.imageUrl(),
            testimonial: faker.lorem.sentence()
        };
        testimonialCarousel.testimonials.push(testimonial);
    }

    return new DonorHomepage({
        _id: mongoose.Types.ObjectId(),
        map: map,
        statistics: stats,
        banner: banner,
        testimonialCarousel: testimonialCarousel
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
                _id: requestType._id,
                name: requestType.name,
                deletedAt: requestType.deletedAt
            });

            await requestType.save();
        }
        await requestGroup.save();
    }

    const donorHomepage = createDonorHomepage();
    await donorHomepage.save();

    console.log("\x1b[34m", "Finished seeding!");
    console.log("\x1b[0m");
    exit();
});
