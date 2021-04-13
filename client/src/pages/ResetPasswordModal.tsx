import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router-dom";

import { allRequirementMessagesInOrder, validatePasswordAndUpdateRequirementSetters } from '../services/auth'
import { handlePasswordReset } from "../services/auth";
import LogoModal from "../components/organisms/LogoModal";
import { TextField } from "../components/atoms/TextField";

const ResetPasswordModal: FunctionComponent = () => {
  const [password, setPassword] = useState(""); // can we put these all in an array somehow?????
  const [hidePassword, setHidePassword] = useState(true);
  // const [hasOneLowerCase, setHasOneLowerCase] = useState(false);
  // const [hasOneUpperCase, setHasOneUpperCase] = useState(false);
  // const [hasOneNumber, setHasOneNumber] = useState(false);
  // const [hasOneSymbol, setHasOneSymbol] = useState(false);
  // const [hasTwelveCharacterMin, setHasTwelveCharacterMin] = useState(false);
  const handleClose = () => setRedirect("/");
  const [requirements, setRequirements] = useState(allRequirementMessagesInOrder);
  const [redirect, setRedirect] = useState("");
  const [passwordResetAttempted, setPasswordResetAttempted] = useState(false);
  const [passwordResetSuccessful, setPasswordResetSuccessful] = useState(false);

  const errors = { email: "", password: "" };
  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (requirements.length == 0) {
      const URLParams = new URLSearchParams(window.location.href);
      const actionCode = URLParams.get("oobCode");
      console.log(actionCode);
      if (actionCode) {
        handlePasswordReset(actionCode, password)
          .then((resp: boolean) => {
            console.log(resp);
            if (resp) {
              setPasswordResetSuccessful(true);
            } else {
              setPasswordResetSuccessful(false);
            }
            setPasswordResetAttempted(true);
          })
      }

    }
  };

  // const requirementToStateSetterMap = new Map([
  //   ['lowerCase', setHasOneLowerCase],
  //   ['upperCase', setHasOneUpperCase],
  //   ['number', setHasOneNumber],
  //   ['symbol', setHasOneSymbol],
  //   ['twelveCharacters', setHasTwelveCharacterMin],
  // ]);

  const onChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setRequirements(validatePasswordAndUpdateRequirementSetters(password));
    setPassword(password);
  }

  const modalTitle = "Reset Your Password";
  const subtitle = "Enter a new password to continue";

  const popover = (
    <Popover id="popover-basic" show={requirements.length > 0}>
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
            <div className="text signup">
              Your password meets the requirements!
            </div>
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
        <LogoModal title={modalTitle} subtitle={subtitle} show={!passwordResetAttempted} handleClose={handleClose} body={
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
                  
                  className="text redirect center"
                >
                </div>
              </div>
            </form>
          </div>} />
        <LogoModal show={passwordResetAttempted && passwordResetSuccessful} title={"Password Reset Successful"} subtitle={''} handleClose={() => setRedirect("/")} body={
          <span>
            <div className="text">
              Your password has now been changed. You may now close this window or login with your new password using the button below.
            </div>
            <button className="button" onClick={() => setRedirect("/login")}>
              Log in
        </button>
          </span>
        } />
        <LogoModal show={passwordResetAttempted && !passwordResetSuccessful} title={"Password Reset Error"} subtitle={''} handleClose={() => setRedirect("/")} body={
          <span>
            <div className="text">
              Sorry about that, looks like there was an error in resetting your password!
            </div>
          </span>
        } />
      </div>
    </React.Fragment>
  );
}

export default ResetPasswordModal;