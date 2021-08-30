import React, { FunctionComponent, useState } from "react";

import { DonorHomepageConfig as DonorHomepageConfigType, MapQuote } from "../data/types/donorHomepageConfig";
import AdminPage from "../components/layouts/AdminPage";
import { Button } from "../components/atoms/Button";
import DonorHomepageConfig from "../config/donorHomepageConfig.json";
import EditMapQuotesSection from "../components/molecules/EditMapQuotesSection";
import EditStatisticsSection from "../components/molecules/EditStatisticsSection";

export type MapQuoteEditState = MapQuote & { isEditing: boolean; isSavedBefore: boolean; error: string };

export type EditTestimonialsFormState = {
    careClosetVisitsStatError: string;
    diapersDistributedStatError: string;
    donorHomepageConfig: DonorHomepageConfigType;
    mapQuotes: Array<MapQuoteEditState>;
    regularDonorsStatError: string;
};

const initialFormState: EditTestimonialsFormState = {
    careClosetVisitsStatError: "",
    diapersDistributedStatError: "",
    donorHomepageConfig: DonorHomepageConfig,
    mapQuotes: DonorHomepageConfig.map.testimonials.map((mapQoute) => ({
        ...mapQoute,
        isEditing: false,
        isSavedBefore: true,
        error: ""
    })),
    regularDonorsStatError: ""
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

    const handleSave = () => {
        console.log("save");
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
                        <EditMapQuotesSection />
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
