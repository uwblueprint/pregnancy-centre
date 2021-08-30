export enum StatisticType {
    REGULAR_DONORS = "REGULAR_DONORS",
    DIAPERS_DISTRIBUTED = "DIAPERS_DISTRIBUTED",
    CARE_CLOSET_VISITS = "CARE_CLOSET_VISITS"
}

export interface Point {
    x: number;
    y: number;
}

export interface Testimonial {
    id: number;
    imagePath: string;
    testimonial: string;
}

export interface Statistic {
    icon: string;
    measurement: string;
    stat: string;
    type: StatisticType;
}

export interface DonorHomepageConfig {
    map: {
        defaultMarkerSize: string;
        markerSizes: Array<string>;
        points: Array<Point>;
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
