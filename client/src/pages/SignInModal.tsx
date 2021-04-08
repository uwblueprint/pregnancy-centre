import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router-dom";

import { AuthErrorMessage, signIn } from "../services/auth";
import CommonModal from "../components/organisms/Modal";
import ConfirmationModal from "./ConfirmationModal";

const SignInModal: FunctionComponent = () => {
  const initialErrors = { email: "", password: "" }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(initialErrors);
  const [hidePassword, setHidePassword] = useState(true);
  const [redirect, setRedirect] = useState("");
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);

  const handleClose = () => setRedirect("/");

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(email, password).then((res) => {
      setErrors(res)
      if (!res.email.length && !res.password.length) {
        setRedirect("/admin")
      }
      if (res.email === AuthErrorMessage["unconfirmed-email"]) {
        setConfirmationEmailSent(true)
      }
    }).catch((err) => {
      setErrors(err)
    })
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const modalTitle = "Welcome to Employee Login";
  const subtitle = "Sign in to continue";

  if (redirect !== "") {
    return <Redirect to={redirect} />;
  }
  return (
    <React.Fragment>
      <CommonModal
        title={modalTitle}
        subtitle={subtitle}
        show={!confirmationEmailSent}
        handleClose={handleClose}
        body={
          <div>
            <form onSubmit={handleClick}>
              <div>
                <div className="row">
                  <div className="text signup">Email Address</div>
                  <div className="text error">{errors.email}</div>
                </div>

                <div className={errors.email && `row bordered error`}><input
                  name="email"
                  placeholder="Enter your company email"
                  type="text"
                  value={email}
                  className={errors.email ? "text-field-input password error" : "text-field-input"}
                  onChange={onChangeEmail}
                />
                  <div
                    className={errors.email ? "text-field-input-alert" : "hidden"}
                  ><i className="bi bi-exclamation-circle alert-icon"></i></div>
                </div>
              </div>

              <div>
                <div>
                  <div className="row">
                    <div className="text signup">
                      Password
                </div>
                    <div className="text error">{errors.password}</div>
                  </div>
                  <div className="row bordered">
                    <input
                      type={hidePassword ? "password" : "text"}
                      name="password"
                      className={
                        errors.password
                          ? "text-field-input password error"
                          : "text-field-input password"
                      }
                      placeholder="Enter your password"
                      value={password}
                      onChange={onChangePass}
                    />
                    <div
                      className="text-field-input-btn"
                      onClick={() => {
                        setHidePassword(!hidePassword);
                      }}
                    >
                      {hidePassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="text redirect right"
                onClick={() => {
                  console.log("TODO: setRedirect('/password reset link')");
                }}
              >
                Forgot your password?
            </div>
              <button role="link" className="button signin">
                Sign in
            </button>
              <div>

                <div
                  className="text redirect center"
                  onClick={() => {
                    setRedirect("/signup");
                  }}
                >
                  <u>{"Don't have an account?"}</u>
                </div>
              </div>
            </form>
          </div >
        }
      />
      {confirmationEmailSent && <ConfirmationModal email={email} resentEmail={true}></ConfirmationModal>}
    </React.Fragment>
  );
};

export default SignInModal;
