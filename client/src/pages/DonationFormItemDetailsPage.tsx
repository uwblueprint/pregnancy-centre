import React, { FunctionComponent, useEffect, useState } from "react";

import BaseDonationForm from "../data/types/donationForm";
import { Button } from "../components/atoms/Button";
import DonationFormPage from "../components/layouts/DonationFormPage";
import DonationItemCard from "../components/atoms/DonationItemCard";
import DonationItemForm from "../components/molecules/DonationItemForm";
import HorizontalDividerLine from "../components/atoms/HorizontalDividerLine";
import RequestGroup from "../data/types/requestGroup";

type DonationForm = BaseDonationForm & { isSaved: boolean; isSavedBefore: boolean };

interface Props {
    initialDonationForms: Array<BaseDonationForm>;
    onNext: (donationForms: Array<BaseDonationForm>) => void;
    pageNumber: number; // Index starting at 1
    steps: Array<string>;
}

const DonationFormItemDetailsPage: FunctionComponent<Props> = (props: Props) => {
    const [donationForms, setDonationForms] = useState<Array<DonationForm>>(
        props.initialDonationForms.map((baseDonationForm) => ({
            isSaved: true,
            isSavedBefore: true,
            ...baseDonationForm
        }))
    );
    const [showFormUnsavedError, setShowFormUnsavedError] = useState(false);
    const [numSavedBeforeDonationForms, setNumSavedBeforeDonationForms] = useState(props.initialDonationForms.length);
    const [existsSavedDonationFormsBeingEdited, setExistsSavedDonationFormsBeingEdited] = useState(false);

    // TODO(meganniu): replace mock request groups with data from GraphQL query
    const requestGroups: Array<RequestGroup> = [
        { _id: "1", name: "Bassinet" },
        { _id: "2", name: "Exersaucer" },
        { _id: "3", name: "Bag" }
    ];

    const onCreateDonationForm = () => {
        setDonationForms((oldDonationForms) => [...oldDonationForms, { isSaved: false, isSavedBefore: false }]);
    };

    const onSaveDonationForm = (newBaseDonationForm: BaseDonationForm, idx: number) => {
        const newDonationForm = { isSaved: true, isSavedBefore: true, ...newBaseDonationForm };
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

    const allFormsAreSaved = donationForms.reduce(
        (allAreSaved, donationForm) => allAreSaved && donationForm.isSaved,
        true
    );

    const onChangePage = () => {
        if (allFormsAreSaved) {
            props.onNext(donationForms);
            return;
        }
        setShowFormUnsavedError(true);
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
                <>
                    <span className="form-counter">
                        {`Total items saved: ${numSavedBeforeDonationForms.toString()}${
                            existsSavedDonationFormsBeingEdited ? "*" : ""
                        }`}
                    </span>
                    <div className="nav-buttons">
                        <Button className="back-button" text="Back" copyText="" onClick={onChangePage} />
                        <Button className="next-button" text="Next" copyText="" onClick={onChangePage} />
                    </div>
                </>
            }
            pageName={props.steps[props.pageNumber - 1]}
            pageNumber={props.pageNumber}
            pageInstructions="Please select the item(s) you would lik   e to donate. If you do not see your item in the TPC’s current list of needs, type in the name of your item."
            steps={props.steps}
        >
            <>
                {donationForms.map((donationForm, idx) => (
                    <>
                        {donationForm.isSaved ? (
                            <DonationItemCard
                                donationForm={donationForm}
                                showDeleteIcon={donationForms.length === 0}
                                onEdit={() => onEditDonationForm(idx)}
                                onDelete={() => onDeleteDonationForm(idx)}
                            />
                        ) : (
                            <DonationItemForm
                                initialDonationForm={donationForm.isSavedBefore ? donationForm : undefined}
                                requestGroups={requestGroups}
                                showFormUnsavedError={showFormUnsavedError}
                                onDelete={() => onDeleteDonationForm(idx)}
                                onSave={(newBaseDonationForm: BaseDonationForm) =>
                                    onSaveDonationForm(newBaseDonationForm, idx)
                                }
                            />
                        )}
                        {idx !== donationForms.length - 1 && <HorizontalDividerLine />}
                    </>
                ))}
                <span className="add-item-trigger" onClick={onCreateDonationForm}>
                    {donationForms.length === 0 ? "+ Donate an Item" : "+ Donate Another Item"}
                </span>
            </>
        </DonationFormPage>
    );
};

export default DonationFormItemDetailsPage;
