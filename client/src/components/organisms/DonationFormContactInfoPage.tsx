import React, { FunctionComponent, useState } from "react";

import { Button } from "../atoms/Button";
import DonationFormPage from "../layouts/DonationFormPage";
import Donor from "../../data/types/donor";
import FormItem from "../molecules/FormItem";
import { TextField } from "../atoms/TextField";

interface Props {
  onNext: (donor: Donor) => void;
}

const DonationFormContactInfoPage: FunctionComponent<Props> = (
  props: Props
) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");

  const updateFirstNameError = (firstName: string) => {
    let error = "";
    if (firstName.length === 0) {
      error = "Please enter a name";
    }

    setFirstNameError(error);
    return error;
  };

  const updateLastNameError = (lastName: string) => {
    let error = "";
    if (lastName.length === 0) {
      error = "Please enter a name";
    }

    setLastNameError(error);
    return error;
  };

  const updatePhoneNumberError = (phoneNumber: string) => {
    let error = "";
    if (phoneNumber.length === 0) {
      error = "Please enter a phone number";
    } else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phoneNumber)) {
      // Simple regex to test if string has the format ###-###-####
      error = "Please enter a valid phone number (###-###-####)";
    }

    setPhoneNumberError(error);
    return error;
  };

  const updateEmailError = (email: string) => {
    let error = "";
    if (email.length === 0) {
      error = "Please enter an email address";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      // Simple regex to test if string has the format anystring@anystring.anystring
      error = "Please enter a valid email address";
    }

    setEmailError(error);
    return error;
  };

  const onFirstNameChange = (newFirstName: string) => {
    updateFirstNameError(newFirstName);
    setFirstName(newFirstName);
  };

  const onLastNameChange = (newLastName: string) => {
    updateLastNameError(newLastName);
    setLastName(newLastName);
  };

  const onPhoneNumberChange = (newPhoneNumber: string) => {
    if (newPhoneNumber.length === 3 || newPhoneNumber.length === 7) {
      newPhoneNumber = newPhoneNumber.concat("-");
    }
    updatePhoneNumberError(newPhoneNumber);
    setPhoneNumber(newPhoneNumber);
  };

  const onEmailChange = (newEmail: string) => {
    updateEmailError(newEmail);
    setEmail(newEmail);
  };

  const onNext = () => {
    const tempFirstNameError = updateFirstNameError(firstName);
    const tempLastNameError = updateLastNameError(lastName);
    const tempPhoneNumberError = updatePhoneNumberError(phoneNumber);
    const tempEmailError = updateEmailError(email);

    if (
      tempFirstNameError.length === 0 &&
      tempLastNameError.length === 0 &&
      tempPhoneNumberError.length === 0 &&
      tempEmailError.length === 0
    ) {
      props.onNext({
        email,
        firstName,
        lastName,
        phoneNumber,
      });
    }
  };

  return (
    <DonationFormPage
      className="donation-form-contact-info-page"
      footer={
        <Button
          className="next-button"
          text="Next"
          copyText=""
          onClick={onNext}
        />
      }
      pageName="Contact Information"
      pageInstructions="Please fill out your contact information so that The Pregnancy Centre can notify you about donation approval and drop off details."
    >
      <div className="contact-info-form">
        <FormItem
          className="first-name-field"
          formItemName="First Name *"
          errorString={firstNameError}
          isDisabled={false}
          showErrorIcon={false}
          inputComponent={
            <TextField
              input={firstName}
              isDisabled={false}
              isErroneous={firstNameError.length !== 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onFirstNameChange(e.target.value);
              }}
              name="firstName"
              placeholder="e.x. Jane"
              type="text"
              showRedErrorText={true}
            />
          }
        />
        <FormItem
          className="last-name-field"
          formItemName="Last Name *"
          errorString={lastNameError}
          isDisabled={false}
          showErrorIcon={false}
          inputComponent={
            <TextField
              input={lastName}
              isDisabled={false}
              isErroneous={lastNameError.length !== 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onLastNameChange(e.target.value);
              }}
              name="lastName"
              placeholder="e.x. Doe"
              type="text"
              showRedErrorText={true}
            />
          }
        />
        <FormItem
          className="phone-number-field"
          formItemName="Phone Number *"
          errorString={phoneNumberError}
          isDisabled={false}
          showErrorIcon={false}
          inputComponent={
            <TextField
              input={phoneNumber}
              isDisabled={false}
              isErroneous={phoneNumberError.length !== 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onPhoneNumberChange(e.target.value);
              }}
              name="phoneNumber"
              placeholder="e.x. 123-456-7890"
              type="text"
              showRedErrorText={true}
            />
          }
        />
        <FormItem
          className="email-field"
          formItemName="Email Address *"
          errorString={emailError}
          isDisabled={false}
          showErrorIcon={false}
          inputComponent={
            <TextField
              input={email}
              isDisabled={false}
              isErroneous={emailError.length !== 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onEmailChange(e.target.value);
              }}
              name="email"
              placeholder="e.x. janedoe@gmail.com"
              type="text"
              showRedErrorText={true}
            />
          }
        />
      </div>
    </DonationFormPage>
  );
};

export default DonationFormContactInfoPage;