import React, { FunctionComponent, useContext } from "react";

import { Statistic, StatisticType } from "../../data/types/donorHomepageConfig";
import FormItem from "../molecules/FormItem";
import { TextField } from "../atoms/TextField";
import { EditTestimonialsContext } from "../../pages/AdminEditTestimonialsPage";

const EditStatisticsSection: FunctionComponent = () => {
    const { formState, setFormState } = useContext(EditTestimonialsContext);
    const { careClosetVisitsStatError, diapersDistributedStatError, regularDonorsStatError } = formState;
    const findStat = (statType: StatisticType) =>
        formState.donorHomepageConfig.statistics.find((stat) => stat.type === statType);
    let regularDonorsStat: Statistic | null = findStat(StatisticType.REGULAR_DONORS) ?? null;
    let diapersDistributedStat: Statistic | null = findStat(StatisticType.DIAPERS_DISTRIBUTED) ?? null;
    let careClosetVisitsStat: Statistic | null = findStat(StatisticType.CARE_CLOSET_VISITS) ?? null;

    const setStatistic = (measurement: string, statisticType: StatisticType) => {
        if (careClosetVisitsStat == null || diapersDistributedStat == null || regularDonorsStat == null) {
            return;
        }
        switch (statisticType) {
            case StatisticType.CARE_CLOSET_VISITS:
                careClosetVisitsStat.measurement = measurement;
                break;
            case StatisticType.DIAPERS_DISTRIBUTED:
                diapersDistributedStat.measurement = measurement;
                break;
            case StatisticType.REGULAR_DONORS:
                regularDonorsStat.measurement = measurement;
                break;
        }
        setFormState({
            ...formState,
            donorHomepageConfig: {
                ...formState.donorHomepageConfig,
                statistics: [regularDonorsStat, diapersDistributedStat, careClosetVisitsStat]
            }
        });
    };

    const capitalizeFirstLetter = (str: string) => {
        if (str.length === 0) {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const getStatisticField = (statistic: Statistic, errorMessage: string) => (
        <div className="statistic-field">
            <FormItem
                formItemName={capitalizeFirstLetter(statistic.measurement)}
                errorString={errorMessage}
                isDisabled={false}
                showErrorIcon={true}
                labelBoostrapIcon={statistic.icon}
                inputComponent={
                    <TextField
                        input={statistic.stat}
                        isDisabled={false}
                        isErroneous={false}
                        showRedErrorText={true}
                        onChange={(e) => setStatistic(e.target.value, statistic.type as StatisticType)}
                        name={`${statistic.measurement} field`}
                        placeholder=""
                        type="text"
                    />
                }
            />
        </div>
    );

    return (
        <div className="edit-statistics-section">
            <h1>Statistics</h1>
            <div className="text-fields">
                {regularDonorsStat != null && getStatisticField(regularDonorsStat, regularDonorsStatError)}
                {diapersDistributedStat != null &&
                    getStatisticField(diapersDistributedStat, diapersDistributedStatError)}
                {careClosetVisitsStat != null && getStatisticField(careClosetVisitsStat, careClosetVisitsStatError)}
            </div>
        </div>
    );
};

export default EditStatisticsSection;
