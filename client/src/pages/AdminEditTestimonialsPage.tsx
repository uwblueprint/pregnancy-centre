import React, { FunctionComponent, useEffect, useState } from "react";

import { Alert, Spinner } from "react-bootstrap";
import {
    DonorHomepageConfig as DonorHomepageConfigType,
    Statistic,
    Testimonial
} from "../data/types/donorHomepageConfig";
import { gql, useMutation, useQuery } from "@apollo/client";
import AdminPage from "../components/layouts/AdminPage";
import { Button } from "../components/atoms/Button";
import EditClientStoriesSection from "../components/molecules/EditClientStoriesSection";
import EditMapQuotesSection from "../components/molecules/EditMapQuotesSection";
import EditStatisticsSection from "../components/molecules/EditStatisticsSection";

export type MapQuoteEditState = Testimonial & {
    isEditing: boolean;
    isSavedBefore: boolean;
    imageError: string;
    textAreaError: string;
};

export type EditTestimonialsFormState = {
    careClosetVisitsStatError: string;
    diapersDistributedStatError: string;
    donorHomepageConfig: DonorHomepageConfigType | null;
    editingClientStory: boolean;
    mapQuotes: Array<MapQuoteEditState>;
    regularDonorsStatError: string;
};

const InitialFormState: EditTestimonialsFormState = {
    careClosetVisitsStatError: "",
    diapersDistributedStatError: "",
    donorHomepageConfig: null,
    editingClientStory: false,
    mapQuotes: [],
    regularDonorsStatError: ""
};

export const EditTestimonialsContext = React.createContext<{
    formState: EditTestimonialsFormState;
    setFormState: (newFormState: EditTestimonialsFormState) => void;
}>({
    formState: InitialFormState,
    setFormState: () => {}
});

const AdminEditTestimonialsPage: FunctionComponent = () => {
    const [formState, setFormState] = useState<EditTestimonialsFormState | null>(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [saveError, setSaveError] = useState("");
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
            const res: DonorHomepageConfigType = JSON.parse(JSON.stringify(data.donorHomepage));
            const initialFormState = {
                ...InitialFormState,
                mapQuotes: res.map.testimonials.map((testimonial) => ({
                    ...testimonial,
                    isEditing: false,
                    isSavedBefore: true,
                    imageError: "",
                    textAreaError: ""
                })),
                donorHomepageConfig: res
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
    }, [showSuccessAlert]);

    const handleSave = () => {
        if (formState == null || formState.donorHomepageConfig == null) return;
        if (formState.editingClientStory || formState.mapQuotes.find((quote) => quote.isEditing) != null) {
            setSaveError("Save all testimonials and map quotes");
            return;
        }
        setSaveError("");
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
                        {showSuccessAlert && <Alert variant="success"> Changes have been updated successfully! </Alert>}
                        <div className="page-content">
                            <div className="page-header">
                                <h1>Editing Main Page</h1>
                            </div>
                            <EditStatisticsSection />
                            <EditClientStoriesSection />
                            <EditMapQuotesSection />
                        </div>
                        <div className="page-footer">
                            <div className="save-error">
                                {saveError && (
                                    <>
                                        <i className="error-icon bi bi-exclamation-circle alert-icon" />
                                        <h1 className="error-message">{saveError}</h1>
                                    </>
                                )}
                            </div>
                            <div className="button-containter">
                                <Button
                                    className="save-button"
                                    text="Submit all changes"
                                    copyText=""
                                    onClick={handleSave}
                                />
                            </div>
                        </div>
                    </EditTestimonialsContext.Provider>
                )}
            </AdminPage>
        </div>
    );
};

export default AdminEditTestimonialsPage;
