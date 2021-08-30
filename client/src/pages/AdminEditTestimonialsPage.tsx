import { gql, useMutation } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import { Statistic, StatisticType } from "../data/types/donorHomepageConfig"
import AdminPage from "../components/layouts/AdminPage";
import { Button } from "../components/atoms/Button";
import DonorHomepageConfig from "../config/donorHomepageConfig.json";
import { DonorHomepageConfig as DonorHomepageConfigType } from "../data/types/donorHomepageConfig";
import EditClientStoriesSection from "../components/molecules/EditClientStoriesSection";
import EditStatisticsSection from "../components/molecules/EditStatisticsSection";

export type EditTestimonialsFormState = {
    careClosetVisitsStatError: string;
    diapersDistributedStatError: string;
    donorHomepageConfig: DonorHomepageConfigType;
    regularDonorsStatError: string;
    editingClientStory: boolean;
};

const initialFormState: EditTestimonialsFormState = {
    careClosetVisitsStatError: "",
    diapersDistributedStatError: "",
    donorHomepageConfig: DonorHomepageConfig,
    regularDonorsStatError: "",
    editingClientStory: false
};

export const EditTestimonialsContext = React.createContext<{
    formState: EditTestimonialsFormState;
    setFormState: (newFormState: EditTestimonialsFormState) => void;
}>({
    formState: initialFormState,
    setFormState: () => {}
});

const AdminEditTestimonialsPage: FunctionComponent = () => {
    const [formState, setFormState] = useState<EditTestimonialsFormState>(initialFormState);
    const updateDonorHomepageConfig = gql`
        mutation UpdateDonorHomepage($mapTestimonials: [TestimonialInput], $carouselTestimonials: [TestimonialInput], $statMeasurements : StatisticMeasurement) {
            updateDonorHomepage(mapTestimonials: $mapTestimonials, carouselTestimonials: $carouselTestimonials, statMeasurements: $statMeasurements) {
                
            }
        }
    `;
    const [mutateDonorHomepageConfig] = useMutation(updateDonorHomepageConfig);


    const handleSave = () => {
        console.log("save");
        const statistics = formState.donorHomepageConfig.statistics;
        const statMeasurements = {
            REGULAR_DONORS: "",
            DIAPERS_DISTRIBUTED: "",
            CARE_CLOSET_VISITS: ""
        }
        statistics.forEach((statistic : Statistic) => {
            const type = statistic.type.toString();
            statMeasurements[type] = statistic.measurement;
        })
        mutateDonorHomepageConfig({ variables: {
            mapTestimonials: formState.donorHomepageConfig.map.testimonials,
            carouselTestimonials: formState.donorHomepageConfig.testimonialCarousel.testimonials,
            statMeasurements: statMeasurements
        } });
    };

    return (
        <div className="admin-edit-testimonials-page">
            <AdminPage>
                <EditTestimonialsContext.Provider value={{ formState, setFormState }}>
                    <div className="page-content">
                        <div className="page-header">
                            <h1>Editing Main Page</h1>
                        </div>
                        <EditStatisticsSection />
                        <EditClientStoriesSection />
                    </div>
                    <div className="page-footer">
                        <Button className="save-button" text="Submit all changes" copyText="" onClick={handleSave} />
                    </div>
                </EditTestimonialsContext.Provider>
            </AdminPage>
        </div>
    );
};

export default AdminEditTestimonialsPage;
