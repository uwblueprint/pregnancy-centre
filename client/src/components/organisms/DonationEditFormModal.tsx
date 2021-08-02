import React, { FunctionComponent, useState } from "react";

import { gql, useMutation } from "@apollo/client";
import { DonationForm } from "../../data/types/donationForm";
import FormItem from "../molecules/FormItem";
import FormModal from "./FormModal";
import TextArea from "../atoms/TextArea";
import { TextField } from "../atoms/TextField";

interface Props {
    donationForm: DonationForm;
    handleClose: () => void;
    onSubmitComplete: (donationForm: DonationForm) => void;
}

const DonationEditFormModal: FunctionComponent<Props> = (props: Props) => {
    const [quantity, setQuantity] = useState(props.donationForm?.quantity ?? 0);
    const [notes, setNotes] = useState(props.donationForm?.adminNotes ?? "");
    const [quantityError, setQuantityError] = useState("");

    const updateDonationFormMutation = gql`
        mutation UpdateDonationForm($id: ID!, $adminNotes: String!, $quantity: Int!) {
            updateDonationForm(donationForm: { _id: $id, adminNotes: $adminNotes, quantity: $quantity }) {
                _id
            }
        }
    `;

    const [updateDonationForm] = useMutation(updateDonationFormMutation, {
        onCompleted: () => {
            const newDonationForm = { ...props.donationForm, quantity, adminNotes: notes.trim() ?? null };
            props.onSubmitComplete(newDonationForm);
        },
        onError: (error) => {
            console.log(error);
            props.handleClose();
        }
    });

    const updateQuantityError = (newQuantity: number) => {
        let error = "";
        if (newQuantity <= 0 || isNaN(newQuantity)) {
            error = "Enter a valid number";
        }
        setQuantityError(error);
        return error;
    };

    const onQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity);
        updateQuantityError(newQuantity);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tempQuantityError = updateQuantityError(quantity);
        if (tempQuantityError.length === 0) {
            updateDonationForm({
                variables: {
                    id: props.donationForm._id,
                    adminNotes: notes,
                    quantity
                }
            });
        }
    };

    const formTitle = `Confirm Dropoff${props.donationForm.name ? " for " + props.donationForm.name : ""}`;
    return (
        <FormModal
            className="donation-edit-form"
            show={true}
            handleClose={props.handleClose}
            title={formTitle}
            submitButtonText="Confirm"
            onSubmit={onSubmit}
            onCancel={props.handleClose}
        >
            <FormItem
                className="quantity-field"
                formItemName="Edit Quantity"
                errorString={quantityError}
                isDisabled={false}
                showErrorIcon={true}
                inputComponent={
                    <TextField
                        input={quantity.toString()}
                        isDisabled={false}
                        isErroneous={quantityError.length !== 0}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onQuantityChange(parseInt(e.target.value));
                        }}
                        name="quantity"
                        placeholder=""
                        type="number"
                        showRedErrorText={true}
                    />
                }
            />
            <FormItem
                className="notes-field"
                formItemName="Add Notes"
                errorString=""
                isDisabled={false}
                showErrorIcon={false}
                inputComponent={
                    <TextArea
                        isErroneous={false}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setNotes(e.target.value);
                        }}
                        placeholder="Insert any information about the item"
                        value={notes}
                    />
                }
            />
        </FormModal>
    );
};

export default DonationEditFormModal;
