import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router-dom";

import ConfirmationModal from "./ConfirmationModal";
import { createNewAccount } from "../services/auth";
import LogoModal from "../components/organisms/LogoModal";
import { TextField } from "../components/atoms/TextField"

const ResetPasswordModal: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hasOneLowerCase, setHasOneLowerCase] = useState(false);
  const [hasOneUpperCase, setHasOneUpperCase] = useState(false);
  const [hasOneNumber, setHasOneNumber] = useState(false);
  const [hasOneSymbol, setHasOneSymbol] = useState(false);
  const [hasTwelveCharacterMin, setHasTwelveCharacterMin] = useState(false);
  const handleClose = () => setRedirect("/");
  const initialReq: string[] = ["at least 1 lowercase letter", "at least 1 uppercase letter", "at least 1 number", "at least 1 symbol", "12 characters minimum"]
  const [requirements, setRequirements] = useState(initialReq);
  const [redirect, setRedirect] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const requirementsAreFulfilled = !hasOneLowerCase || !hasOneUpperCase || !hasOneNumber || !hasOneSymbol || !hasTwelveCharacterMin;

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNewAccount(email, password)
      .then((result) => {
        setErrors(result);
        if (result.email === "" && result.password === "") {
          setConfirmationEmailSent(true);
        }
      })
      .catch((err) => {
        setErrors(err);
      });
  };

  const requirementToTestMap = new Map([
    ['lowerCase', /^(?=.*[a-z])/],
    ['upperCase', /^(?=.*[A-Z])/],
    ['number', /^(?=.*[0-9])/],
    ['symbol', /^(?=.*[*!@#$%^&(){}[\]:;<>,.?/~_+\-=|\\])/],
    ['twelveCharacters', /^(?=.{12,})/]
  ]);

  const requirementToStateSetterMap = new Map([
    ['lowerCase', setHasOneLowerCase],
    ['upperCase', setHasOneUpperCase],
    ['number', setHasOneNumber],
    ['symbol', setHasOneSymbol],
    ['twelveCharacters', setHasTwelveCharacterMin],
  ]);

  const requirementToMessageMap = new Map([
    ['lowerCase', "at least 1 lowercase letter"],
    ['upperCase', "at least 1 uppercase letter"],
    ['number', "at least 1 number"],
    ['symbol', 'at least 1 symbol'],
    ['twelveCharacters', '12 characters minimum'],
  ]);


  const onChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    const copy: string[] = requirements;

    requirementToTestMap.forEach((test, key) => {
      const result = test.test(password)!;
      const message: string = requirementToMessageMap.get(key)!;
      requirementToStateSetterMap.get(key)!(result)

      // if requirement not in string and not in array, push into array
      if (!result && !copy.includes(message)) {
        copy.push(message);
      }
      // if requirement is in the string and the array has it, remove it from array
      else if (result && copy.includes(message)) {
        const index = copy.indexOf(message);
        copy.splice(index, 1);
      }
      setRequirements(copy);
    });

    setPassword(password);
  }

  const modalTitle = "Reset Your Password";
  const subtitle = "Enter a new password to continue";

  const popover = (
    <Popover id="popover-basic" show={requirementsAreFulfilled}>
      <Popover.Title as="h3">Password Requirements</Popover.Title>
      <Popover.Content>
        {
          requirements.length > 0 ?
            <ul>
              {
                requirements.map((i) => <li key={i}>{i}</li>)
              }
            </ul>
            :
            <div className="text signup">Your password meets the requirements!</div>
        }
      </Popover.Content>
    </Popover>
  );
  if (redirect !== "") {
    return <Redirect to={redirect} />;
  }
  return (
    <React.Fragment>
      <div className="reset-password-modal">
      <LogoModal title={modalTitle} subtitle={subtitle} show={!confirmationEmailSent} handleClose={handleClose} body={
        <div className="reset-password-modal">
          <form onSubmit={handleClick}>

            <div>
              <div className="row">
                <div className="text signup">
                  Password
              </div>
                <div className="text error">{errors.password}</div>
              </div>
              <div className="pass-req">
                <OverlayTrigger placement="bottom" overlay={popover}>
                  <div>
                    <TextField
                      input={password}
                      isErroneous={errors.password !== ""}
                      isDisabled={false}
                      onChange={onChangePass}
                      name="password"
                      placeholder="Enter your password"
                      type={hidePassword ? "password" : "text"}
                      iconClassName={hidePassword ? "bi bi-eye-fill" : "bi bi-eye-slash"}
                      onIconClick={() => {
                        setHidePassword(!hidePassword);
                      }}
                    >
                    </TextField>
                  </div>
                </OverlayTrigger>
              </div>
            </div>
            <button
              role="link"
              className="button signup"
            >
              Reset password
              </button>
            <div>
              <div
                onClick={() => {
                  setRedirect("/login");
                }}
                className="text redirect center"
              >
              </div>
            </div>
          </form>
        </div>} />
      {confirmationEmailSent && <ConfirmationModal email={email} resentEmail={true}></ConfirmationModal>}
      </div>
    </React.Fragment>
  );
}

export default ResetPasswordModal;