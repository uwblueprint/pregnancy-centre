import React, { FunctionComponent, useState } from "react";

import DonationFormProgressStepper from "../atoms/DonationFormProgressStepper";
import { ItemStatus } from "../../data/types/donationForm";

const DonationFormProgressStepperContainer: FunctionComponent<Record<string, never>> = () => {
    const [status, setStatus] = useState(ItemStatus.PENDING_APPROVAL);
    return (
        <div
            style={{
                marginTop: "30px",
                marginLeft: "30px",
                width: "190px"
            }}
        >
            <DonationFormProgressStepper status={status} onStatusChange={setStatus} />
        </div>
    );
};

export default DonationFormProgressStepperContainer;
