import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router-dom";

import { allRequirementMessagesInOrder, validatePasswordAndUpdateRequirementSetters } from '../services/auth'
import ConfirmationModal from "./ConfirmationModal";
import LogoModal from "../components/organisms/LogoModal";
import { TextField } from "../components/atoms/TextField"

const ResetPasswordModal: FunctionComponent = () => {
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hasOneLowerCase, setHasOneLowerCase] = useState(false);
  const [hasOneUpperCase, setHasOneUpperCase] = useState(false);
  const [hasOneNumber, setHasOneNumber] = useState(false);
  const [hasOneSymbol, setHasOneSymbol] = useState(false);
  const [hasTwelveCharacterMin, setHasTwelveCharacterMin] = useState(false);
  const handleClose = () => setRedirect("/");
  const [requirements, setRequirements] = useState(allRequirementMessagesInOrder);
  const [redirect, setRedirect] = useState("");
  // const [errors, setErrors] = useState({ email: "", password: "" });
  // const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const requirementsAreFulfilled = !hasOneLowerCase || !hasOneUpperCase || !hasOneNumber || !hasOneSymbol || !hasTwelveCharacterMin;

  const email = "";
  const errors = { email: "", password: "" };
  const confirmationEmailSent = false;
  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO(bonnie-chin): get user from oobcode in URL
    // TODO(bonnie-chin): reset user password
  };

  const requirementToStateSetterMap = new Map([
    ['lowerCase', setHasOneLowerCase],
    ['upperCase', setHasOneUpperCase],
    ['number', setHasOneNumber],
    ['symbol', setHasOneSymbol],
    ['twelveCharacters', setHasTwelveCharacterMin],
  ]);

  const onChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setRequirements(validatePasswordAndUpdateRequirementSetters(password, requirementToStateSetterMap));
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