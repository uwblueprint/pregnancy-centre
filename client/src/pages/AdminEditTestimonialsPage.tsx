import React, { FunctionComponent, useState } from "react";

import AdminPage from "../components/layouts/AdminPage";
import { Button } from "../components/atoms/Button";
import DonorHomepageConfig from "../config/donorHomepageConfig.json";
import { DonorHomepageConfig as DonorHomepageConfigType } from "../data/types/donorHomepageConfig";
import EditStatisticsSection from "../components/molecules/EditStatisticsSection";

export type EditTestimonialsFormState = {
    careClosetVisitsStatError: string;
    diapersDistributedStatError: string;
    donorHomepageConfig: DonorHomepageConfigType;
    regularDonorsStatError: string;
};

const initialFormState: EditTestimonialsFormState = {
    careClosetVisitsStatError: "",
    diapersDistributedStatError: "",
    donorHomepageConfig: DonorHomepageConfig,
    regularDonorsStatError: ""
};

// export type EditTestimonialsContextValueType =

export const EditTestimonialsContext = React.createContext<{
    formState: EditTestimonialsFormState;
    setFormState: (newFormState: EditTestimonialsFormState) => void;
}>({
    formState: {
        careClosetVisitsStatError: "",
        diapersDistributedStatError: "",
        donorHomepageConfig: DonorHomepageConfig,
        regularDonorsStatError: ""
    },
    setFormState: () => {}
});

const AdminEditTestimonialsPage: FunctionComponent = () => {
    const [formState, setFormState] = useState<EditTestimonialsFormState>(initialFormState);

    // const [regularDonorsStat, setRegularDonorsStat] = useState(
    //     findStatistic(StatisticType.REGULAR_DONORS, DonorHomepageConfig.statistics)
    // );
    // const [diapersDistributedStat, setDiapersDistributedStat] = useState(
    //     findStatistic(StatisticType.DIAPERS_DISTRIBUTED, DonorHomepageConfig.statistics)
    // );
    // const [careClosetVisitsStat, setCareClosetVisitsStat] = useState(
    //     findStatistic(StatisticType.CARE_CLOSET_VISITS, DonorHomepageConfig.statistics)
    // );
    // const [regularDonorsStatError, setRegularDonorsStatError] = useState("");
    // const [diapersDistributedStatError, setDiapersDistributedError] = useState("");
    // const [careClosetVisitsStatError, setCareClosetVisitsStatError] = useState("");

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
