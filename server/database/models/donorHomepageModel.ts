import { Document, model, Schema, Types } from "mongoose";

interface MapPoint {
    markerSize: string;
    x: number;
    y: number;
}

interface Statistic {
    icon: string;
    measurement: string;
    stat: string;
}

interface Testimonial {
    id: number;
    imagePath: string;
    testimonial: string;
}

interface DonorHomepageInterface extends Document {
    _id: Types.ObjectId;

    // Properties
    map: {
        points: Array<MapPoint>;
        testimonials: Array<Testimonial>;
    };
    statistics: Array<Statistic>;
    banner: {
        header: string;
        description: string;
        imagePaths: Array<string>;
        interval: number;
    };
    testimonialCarousel: {
        testimonials: Array<Testimonial>;
        interval: number;
    };
}

const DonorHomepageSchema = new Schema({
    // Properties
    map: {
        points: [
            {
                markerSize: { type: String, required: true, default: "53px" },
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
            stat: { type: String, required: true }
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
        imagePaths: { type: [String], required: true },
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
export { DonorHomepage, DonorHomepageInterface, MapPoint, Statistic, Testimonial };
