import React, { FunctionComponent, useEffect, useState } from "react";

import { DonationForm as BaseDonationForm } from "../data/types/donationForm";
import DonationFormPage from "../components/layouts/DonationFormPage";
import DonationItemCard from "../components/atoms/DonationItemCard";
import DonationItemForm from "../components/molecules/DonationItemForm";
import HorizontalDividerLine from "../components/atoms/HorizontalDividerLine";
import RequestGroup from "../data/types/requestGroup";

export type DonationForm = BaseDonationForm & { isSaved: boolean; isSavedBefore: boolean };

interface Props {
    initialDonationForms: Array<DonationForm>;
    onNext: (donationForms: Array<DonationForm>) => void;
    onPrevious: (donationForms: Array<DonationForm>) => void;
    pageNumber: number; // Index starting at 0
    steps: Array<string>;
}

const DonationFormItemDetailsPage: FunctionComponent<Props> = (props: Props) => {
    const [donationForms, setDonationForms] = useState<Array<DonationForm>>(
        props.initialDonationForms.length === 0
            ? [{ isSaved: false, isSavedBefore: false }]
            : props.initialDonationForms
    );
    const [formDetailsError, setFormDetailsError] = useState("");
    const [numSavedBeforeDonationForms, setNumSavedBeforeDonationForms] = useState(props.initialDonationForms.length);
    const [existsSavedDonationFormsBeingEdited, setExistsSavedDonationFormsBeingEdited] = useState(false);

    // TODO(meganniu): replace mock request groups with data from GraphQL query
    const requestGroups: Array<RequestGroup> = [
        { _id: "1", name: "Bassinet" },
        { _id: "2", name: "Exersaucer" },
        { _id: "3", name: "Bag" }
    ];

    const updateFormDetailsError = () => {
        let error = "";
        const allFormsAreSaved = donationForms.reduce(
            (allAreSaved, donationForm) => allAreSaved && donationForm.isSaved,
            true
        );
        if (!allFormsAreSaved) {
            error = "Please save item.";
        }

        setFormDetailsError(error);
        return error;
    };

    const onCreateDonationForm = () => {
        setDonationForms((oldDonationForms) => [...oldDonationForms, { isSaved: false, isSavedBefore: false }]);
    };

    const onChangeDonationForm = (newDonationForm: DonationForm, idx: number) => {
        const tempDonationForms = donationForms.slice();
        if (idx >= 0 && idx < tempDonationForms.length) {
            tempDonationForms[idx] = newDonationForm;
        }
        setDonationForms(tempDonationForms);
    };

    const onEditDonationForm = (idx: number) => {
        const tempDonationForms = donationForms.slice();
        if (idx >= 0 && idx < tempDonationForms.length) {
            tempDonationForms[idx].isSaved = false;
        }
        setDonationForms(tempDonationForms);
    };

    const onDeleteDonationForm = (idx: number) => {
        const tempDonationForms = donationForms.slice();
        if (idx >= 0 && idx < tempDonationForms.length) {
            tempDonationForms.splice(idx, 1);
        }
        setDonationForms(tempDonationForms);
    };

    const onNextPage = () => {
        const tempFormDetailsError = updateFormDetailsError();

        if (tempFormDetailsError.length !== 0) {
            return;
        }
        props.onNext(donationForms);
    };

    const onPreviousPage = () => {
        console.log(donationForms);
        props.onPrevious(donationForms);
    };

    useEffect(() => {
        const newNumSavedBeforeDonationForms = donationForms.reduce(
            (counter, donationForm) => counter + (donationForm.isSavedBefore ? 1 : 0),
            0
        );
        const newExistsSavedDonationFormsBeingEdited = donationForms.find(
            (donationForm) => donationForm.isSaved === false && donationForm.isSavedBefore === true
        )
            ? true
            : false;

        setNumSavedBeforeDonationForms(newNumSavedBeforeDonationForms);
        setExistsSavedDonationFormsBeingEdited(newExistsSavedDonationFormsBeingEdited);
    }, [donationForms]);

    return (
        <DonationFormPage
            className="donation-form-item-details-page"
            footer={
                <span className="form-counter">
                    {`Total items saved: ${numSavedBeforeDonationForms.toString()}${
                        existsSavedDonationFormsBeingEdited ? "*" : ""
                    }`}
                </span>
            }
            includeContentHeader={true}
            includeFooter={true}
            nextButtonText="Next"
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            pageName={props.steps[props.pageNumber]}
            pageNumber={props.pageNumber}
            pageInstructions="Please select the item(s) you would like to donate. If you do not see your item in the TPC’s current list of needs, type in the name of your item."
            previousButtonText="Back"
            steps={props.steps}
        >
            <>
                {donationForms.map((donationForm, idx) =>
                    donationForm.isSaved ? (
                        <DonationItemCard
                            donationForm={donationForm}
                            key={idx}
                            showDeleteIcon={donationForms.length > 1}
                            onEdit={() => onEditDonationForm(idx)}
                            onDelete={() => onDeleteDonationForm(idx)}
                            showEditIcon={true}
                        />
                    ) : (
                        <>
                            {idx !== 0 && donationForms[idx - 1].isSaved && <HorizontalDividerLine />}
                            <DonationItemForm
                                donationForm={donationForm}
                                key={idx}
                                requestGroups={requestGroups}
                                showDeleteButton={donationForms.length > 1}
                                formDetailsError={formDetailsError}
                                onChange={(newDonationForm: DonationForm) => {
                                    onChangeDonationForm(newDonationForm, idx);
                                }}
                                onDelete={() => onDeleteDonationForm(idx)}
                                onSave={(newDonationForm: DonationForm) => onChangeDonationForm(newDonationForm, idx)}
                            />
                            {idx !== donationForms.length - 1 && <HorizontalDividerLine />}
                        </>
                    )
                )}
                <p className="add-item-trigger" onClick={onCreateDonationForm}>
                    {donationForms.length === 0 ? "+ Donate an Item" : "+ Donate Another Item"}
                </p>
            </>
        </DonationFormPage>
    );
};

export default DonationFormItemDetailsPage;
