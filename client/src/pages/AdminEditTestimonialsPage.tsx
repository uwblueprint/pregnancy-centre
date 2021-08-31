import React, { FunctionComponent, useEffect, useState } from "react";

import { DonorHomepageConfig as DonorHomepageConfigType, MapQuote } from "../data/types/donorHomepageConfig";
import AdminPage from "../components/layouts/AdminPage";
import { Button } from "../components/atoms/Button";
import DonorHomepageConfig from "../config/donorHomepageConfig.json";
import EditMapQuotesSection from "../components/molecules/EditMapQuotesSection";
import { Alert, Spinner } from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";

import AdminPage from "../components/layouts/AdminPage";
import { Button } from "../components/atoms/Button";
import { DonorHomepageConfig as DonorHomepageConfigType } from "../data/types/donorHomepageConfig";
import EditClientStoriesSection from "../components/molecules/EditClientStoriesSection";

import EditStatisticsSection from "../components/molecules/EditStatisticsSection";
import { Statistic } from "../data/types/donorHomepageConfig";

export type MapQuoteEditState = MapQuote & {
    isEditing: boolean;
    isSavedBefore: boolean;
    imageError: string;
    textAreaError: string;
};

export type EditTestimonialsFormState = {
    careClosetVisitsStatError: string;
    diapersDistributedStatError: string;
    donorHomepageConfig: DonorHomepageConfigType;
    editingClientStory: boolean,
    mapQuotes: Array<MapQuoteEditState>;
    regularDonorsStatError: string;
};

const initialFormState: EditTestimonialsFormState = {
    careClosetVisitsStatError: "",
    diapersDistributedStatError: "",
    donorHomepageConfig: DonorHomepageConfig,
    editingClientStory: false,
    mapQuotes: DonorHomepageConfig.map.testimonials.map((mapQoute) => ({
        ...mapQoute,
        isEditing: false,
        isSavedBefore: true,
        imageError: "",
        textAreaError: ""
    })),
    regularDonorsStatError: "",
};

export const EditTestimonialsContext = React.createContext<{
    formState: EditTestimonialsFormState;
    setFormState: (newFormState: EditTestimonialsFormState) => void;
}>({
    formState: initialFormState,
    setFormState: () => {}
})

const AdminEditTestimonialsPage: FunctionComponent = () => {
    const [formState, setFormState] = useState<EditTestimonialsFormState | undefined>(undefined);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const query = gql`
        query GetDonorHomepage {
            donorHomepage {
                map {
                    testimonials {
                        id
                        imagePath
                        testimonial
                    }
                }
                statistics {
                    icon
                    measurement
                    stat
                    type
                }
                testimonialCarousel {
                    testimonials {
                        id
                        imagePath
                        testimonial
                    }
                }
            }
        }
    `;
    const { error } = useQuery(query, {
        onCompleted: (data: { donorHomepage: DonorHomepageConfigType }) => {
            const res = JSON.parse(JSON.stringify(data.donorHomepage));
            const initialFormState = {
                careClosetVisitsStatError: "",
                diapersDistributedStatError: "",
                donorHomepageConfig: res,
                regularDonorsStatError: "",
                editingClientStory: false
            };
            setFormState(initialFormState);
        }
    });
    if (error) console.log(error.graphQLErrors);

    const updateDonorHomepageConfig = gql`
        mutation UpdateDonorHomepage(
            $mapTestimonials: [TestimonialInput!]
            $carouselTestimonials: [TestimonialInput!]
            $statMeasurements: StatisticMeasurement
        ) {
            updateDonorHomepage(
                mapTestimonials: $mapTestimonials
                carouselTestimonials: $carouselTestimonials
                statMeasurements: $statMeasurements
            ) {
                map {
                    testimonials {
                        id
                    }
                }
                testimonialCarousel {
                    testimonials {
                        id
                    }
                }
                statistics {
                    measurement
                }
            }
        }
    `;
    const [mutateDonorHomepageConfig] = useMutation(updateDonorHomepageConfig, {
        onCompleted: () => {
            setShowSuccessAlert(true);
        }
    });

    useEffect(() => {
        if (!showSuccessAlert) return;
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 5000);
    }, [showSuccessAlert])

    const handleSave = () => {
        console.log("save");
        if (formState == undefined) return;
        const statistics = formState.donorHomepageConfig.statistics;
        const statMeasurements: {
            [key: string]: string;
        } = {
            REGULAR_DONORS: "",
            DIAPERS_DISTRIBUTED: "",
            CARE_CLOSET_VISITS: ""
    };
        statistics.forEach((statistic: Statistic) => {
            const type = statistic.type.toString();
            statMeasurements[type] = statistic.measurement;
        });
        mutateDonorHomepageConfig({
            variables: {
                mapTestimonials: formState.donorHomepageConfig.map.testimonials,
                carouselTestimonials: formState.donorHomepageConfig.testimonialCarousel.testimonials,
                statMeasurements: statMeasurements
            }
        });
    };

    return (
        <div className="admin-edit-testimonials-page">
            <AdminPage>
                {formState == undefined ? (
                    <div className="spinner">
                        <Spinner animation="border" role="status" />
                    </div>
                ) : (
                    <EditTestimonialsContext.Provider value={{ formState, setFormState }}>
                        {showSuccessAlert && (
                            <Alert variant="success"> Changes have been updated successfully! </Alert>
                        )}
                        <div className="page-content">
                            <div className="page-header">
                                <h1>Editing Main Page</h1>
                            </div>
                            <EditStatisticsSection />
                            <EditClientStoriesSection/>
                            <EditMapQuotesSection />
                        </div>
                        <div className="page-footer">
                            <Button
                                className="save-button"
                                text="Submit all changes"
                                copyText=""
                                onClick={handleSave}
                            />
                        </div>
                    </EditTestimonialsContext.Provider>
                )}
            </AdminPage>
        </div>
    );
};

export default AdminEditTestimonialsPage;