import "./Modal.scss";
import React, { FunctionComponent, useState } from "react";
import CommonModal from "../components/organisms/Modal";
// import { createNewAccount } from "../services/auth";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { Redirect } from "react-router-dom";
import Spacer from "../components/atoms/Spacer";

const SignInModal: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleClose = () => setShow(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [show, setShow] = useState(true);
  const [hidePassword, setHidePassword] = useState(true);
  const [redirect, setRedirect] = useState("");

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(errors); //Change to sign in via firebase
    setRedirect("/");
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
    <CommonModal
      title={modalTitle}
      subtitle={subtitle}
      show={show}
      handleClose={handleClose}
      body={
        <div>
          <form onSubmit={handleClick}>
            <div>
              <div className="text signup">Email address {}</div>
              <input
                name="email"
                placeholder="Enter your company email"
                type="text"
                value={email}
                className={errors.email ? "input-field error" : "input-field"}
                onChange={onChangeEmail}
              />
            </div>
            <div>
              <div className="text signup">Password</div>
              <div className="row bordered">
                <input
                  type={hidePassword ? "password" : "text"}
                  name="password"
                  className={
                    errors.password
                      ? "input-field error"
                      : "input-field password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={onChangePass}
                />
                <div
                  className="input-field-btn"
                  onClick={() => {
                    setHidePassword(!hidePassword);
                  }}
                >
                  {hidePassword ? <EyeFilled /> : <EyeInvisibleFilled />}
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
            <Spacer height = {15}/>
            <button role="link" className="button">
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
        </div>
      }
    />
  );
};

export default SignInModal;
