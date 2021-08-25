import {
    Banner,
    DonorHomepage,
    DonorHomepageInterface,
    Map,
    Statistic,
    StatisticMeasurement,
    Testimonial,
    TestimonialCarousel
} from "../../database/models/donorHomepageModel";

const getDonorHomepageData = async <Type>(property: string): Promise<Type> => {
    return DonorHomepage.find()
        .exec()
        .then((donorHomepageData) => {
            return donorHomepageData[0][property];
        });
};

const donorHomepageQueryResolvers = {
    donorHomepageBanner: async (): Promise<Banner> => {
        return getDonorHomepageData<Banner>("banner");
    },
    donorHomepageTestimonialCarousel: async (): Promise<TestimonialCarousel> => {
        return getDonorHomepageData<TestimonialCarousel>("testimonialCarousel");
    },
    donorHomepageMap: async (): Promise<Map> => {
        return getDonorHomepageData<Map>("map");
    },
    donorHomepageStatistics: async (): Promise<Array<Statistic>> => {
        return getDonorHomepageData<Array<Statistic>>("statistics");
    }
};

const donorHomepageMutationResolvers = {
    updatedonorHomepageBanner: async (
        mapTestimonials: Array<Testimonial>,
        testimonialCarousel: TestimonialCarousel,
        statMeasurements: Array<StatisticMeasurement>,
        { authenticateUser }
    ): Promise<DonorHomepageInterface> => {
        return authenticateUser().then(async () => {
            const map = await donorHomepageQueryResolvers.donorHomepageMap();
            map.testimonials = mapTestimonials;

            const statistics = await donorHomepageQueryResolvers.donorHomepageStatistics();
            statistics.forEach((statistic) => {
                statMeasurements.forEach((statMeasurement) => {
                    if (statistic.type === statMeasurement.type) {
                        statistic.measurement = statMeasurement.measurement;
                    }
                });
            });

            const donorHomepage = {
                map: map,
                statistics: statistics,
                testimonialCarousel: testimonialCarousel
            };
            return DonorHomepage.findOneAndUpdate({}, donorHomepage);
        });
    }
};

export { donorHomepageMutationResolvers, donorHomepageQueryResolvers };
