import React, { FunctionComponent, useState } from 'react';
import { Redirect } from "react-router-dom";

import LogoModal from '../components/organisms/LogoModal';
import { sendPasswordResetEmail } from '../services/auth'

const SendResetPasswordEmailModal: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [resetPasswordEmailSent, setResetPasswordEmailSent] = useState(false)
  const [redirect, setRedirect] = useState("");


  const handleClose = () => setRedirect("/");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendPasswordResetEmail(email).then((error) => {
      if (error === "") {
        setResetPasswordEmailSent(true)
      }
      else {
        setErrors(error)
      }
    })
  }

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  if (redirect !== "") {
    return <Redirect to={redirect} />;
  }

  return (
    <>
      <LogoModal
        title={"Reset Your Password"}
        subtitle={"Enter your email to continue"}
        show={!resetPasswordEmailSent}
        handleClose={handleClose}
        body={
          <div className="send-reset-password-email-modal">
            <form onSubmit={handleSubmit}>
              <div>
                <div className="row">
                  <div className="text signup">Email Address</div>
                  <div className="text error">{errors}</div>
                </div>

                <div className={errors && `row bordered error`}><input
                  name="email"
                  placeholder="Enter your company email"
                  type="text"
                  value={email}
                  className={errors ? "text-field-input password error" : "text-field-input"}
                  onChange={onChangeEmail}
                />
                  <div
                    className={errors ? "text-field-input-alert" : "hidden"}
                  ><i className="bi bi-exclamation-circle alert-icon"></i></div>
                </div>
              </div>

              <button role="link" className="button">
                Email password reset link
              </button>
            </form>
          </div >
        } />
      <LogoModal show={resetPasswordEmailSent} title={"Email Sent"} subtitle={''} handleClose={handleClose} body={
        <span>
          <div className="text">
            Check your email and click on the password reset link to reset the password to your account.
            < div className="text" >
              The link will expire after X days, after which you’ll have to request another reset link.
            </div >
          </div >
          <button className="button" onClick={handleClose}>
            I understand
        </button>
        </span >
      } />
    </>
  );
}

export default SendResetPasswordEmailModal;