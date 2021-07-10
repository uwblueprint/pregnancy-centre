import React, { FunctionComponent, useState } from "react";

import ApproveStatusIcon from "../../assets/donation-form-approve-status.svg";
import ConfirmStatusIcon from "../../assets/donation-form-confirm-status.svg";
import { DonationItemStatus } from "../../data/types/donationForm";
import MatchStatusIcon from "../../assets/donation-form-match-status.svg";

interface StepData {
    icon: typeof ApproveStatusIcon;
    label: string;
    nextStatus: DonationItemStatus;
    status: DonationItemStatus;
}

interface Props {
    status: DonationItemStatus;
    onStatusChange: (newStatus: DonationItemStatus) => void;
}

const DonationFormProgressStepper: FunctionComponent<Props> = (props: Props) => {
    const steps: Array<StepData> = [
        {
            icon: ApproveStatusIcon,
            label: "Approve",
            nextStatus: DonationItemStatus.PENDING_DROPOFF,
            status: DonationItemStatus.PENDING_APPROVAL
        },
        {
            icon: ConfirmStatusIcon,
            label: "Confirm",
            nextStatus: DonationItemStatus.PENDING_MATCH,
            status: DonationItemStatus.PENDING_DROPOFF
        },
        {
            icon: MatchStatusIcon,
            label: "Match",
            nextStatus: DonationItemStatus.MATCHED,
            status: DonationItemStatus.PENDING_MATCH
        }
    ];
    return (
        <div className="donation-form-progress-stepper">
            {steps.map((stepData: StepData) => (
                <div
                    className={"step " + (props.status === stepData.status ? "active-step" : "disabled-step")}
                    key={stepData.label}
                    onClick={() => {
                        if (props.status === stepData.status) {
                            props.onStatusChange(stepData.nextStatus);
                        }
                    }}
                >
                    <img src={stepData.icon} />
                    <h1 className="step-label">{stepData.label}</h1>
                </div>
            ))}
        </div>
    );
};

export default DonationFormProgressStepper;
