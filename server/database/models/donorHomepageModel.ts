import { Document, model, Schema, Types } from "mongoose";

interface MapPoint {
    x: number;
    y: number;
}

interface Testimonial {
    id: number;
    imagePath: string;
    testimonial: string;
}

interface Banner {
    header: string;
    description: string;
    imagePaths: Array<string>;
    interval: number;
}

interface TestimonialCarousel {
    testimonials: Array<Testimonial>;
    interval: number;
}

interface Map {
    defaultMarkerSize: string;
    markerSizes: Array<string>;
    points: Array<MapPoint>;
    testimonials: Array<Testimonial>;
}

enum StatisticType {
    REGULAR_DONORS = "REGULAR_DONORS",
    DIAPERS_DISTRIBUTED = "DIAPERS_DISTRIBUTED",
    CARE_CLOSET_VISITS = "CARE_CLOSET_VISITS"
}

interface Statistic {
    icon: string;
    measurement: string;
    stat: string;
    type: StatisticType;
}

interface StatisticMeasurement {
    measurement: string;
    type: StatisticType;
}

interface DonorHomepageInterface extends Document {
    _id: Types.ObjectId;

    // Properties
    map: Map;
    statistics: Array<Statistic>;
    banner: Banner;
    testimonialCarousel: TestimonialCarousel;
}

const DonorHomepageSchema = new Schema({
    // Properties
    map: {
        defaultMarkerSize: { type: String, required: true, default: "53px" },
        markerSizes: {
            type: [String],
            required: true,
            default: ["80px", "75px", "72px", "70px", "65px", "61px", "55px", "53px"]
        },
        points: [
            {
                x: { type: Number, required: true },
                y: { type: Number, required: true }
            }
        ],
        testimonials: [
            {
                id: { type: Number, required: true },
                imagePath: { type: String, required: true },
                testimonial: { type: String, required: true }
            }
        ]
    },
    statistics: [
        {
            icon: { type: String, required: true },
            measurement: { type: String, required: true },
            stat: { type: String, required: true },
            type: { type: String, required: true, enum: Object.keys(StatisticType) }
        }
    ],
    banner: {
        header: {
            type: String,
            required: true,
            default: "Help women and families in Kitchener-Waterloo thrive with your donation today"
        },
        description: {
            type: String,
            required: true,
            default: "Scroll to see our clients' current needs and arrange a donation"
        },
        imagePaths: {
            type: [String],
            required: true,
            default: [
                "https://firebasestorage.googleapis.com/v0/b/bp-pregnancy-centre-dev-7c10c.appspot.com/o/homepage_images%2Fbanner-img-1.jpg?alt=media&token=ed2309b1-c6ee-4aa6-ab43-11ded06a473a",
                "https://firebasestorage.googleapis.com/v0/b/bp-pregnancy-centre-dev-7c10c.appspot.com/o/homepage_images%2Fbanner-img-2.jpg?alt=media&token=802ada4d-4df0-4dda-8cf1-4e9b6194da50",
                "https://firebasestorage.googleapis.com/v0/b/bp-pregnancy-centre-dev-7c10c.appspot.com/o/homepage_images%2Fbanner-img-3.jpg?alt=media&token=b5886cb8-70b3-4600-b807-edbab5283cdd",
                "https://firebasestorage.googleapis.com/v0/b/bp-pregnancy-centre-dev-7c10c.appspot.com/o/homepage_images%2Fbanner-img-4.jpg?alt=media&token=54ff90e1-20ef-4a6b-b2ab-38db5cd087a5",
                "https://firebasestorage.googleapis.com/v0/b/bp-pregnancy-centre-dev-7c10c.appspot.com/o/homepage_images%2Fbanner-img-5.jpg?alt=media&token=3a2297f4-629d-4824-8259-77c2a5f89256"
            ]
        },
        interval: { type: Number, required: true, default: 10 }
    },
    testimonialCarousel: {
        testimonials: [
            {
                id: { type: Number, required: true },
                imagePath: { type: String, required: true },
                testimonial: { type: String, required: true }
            }
        ],
        interval: { type: Number, required: true, default: 10 }
    }
});

const DonorHomepage = model<DonorHomepageInterface>("DonorHomepage", DonorHomepageSchema);
export {
    DonorHomepage,
    DonorHomepageInterface,
    MapPoint,
    Statistic,
    Testimonial,
    StatisticMeasurement,
    StatisticType,
    Map,
    Banner,
    TestimonialCarousel
};
