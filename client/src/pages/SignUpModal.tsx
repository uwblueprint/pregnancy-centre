import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { FunctionComponent, useState } from "react";
import CommonModal from "../components/organisms/Modal";
import { createNewAccount } from "../services/auth";
import { Redirect } from "react-router-dom";
import Spacer from "../components/atoms/Spacer";

const SignUpModal: FunctionComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasOneLowerCase, setHasOneLowerCase] = useState(false);
  const [hasOneUpperCase, setHasOneUpperCase] = useState(false);
  const [hasOneNumber, setHasOneNumber] = useState(false);
  const [hasOneSymbol, setHasOneSymbol] = useState(false);
  const [hasTwelveCharacterMin, setHasTwelveCharacterMin] = useState(false);
  const handleClose = () => setShow(false);
  const initialReq: string[] = ["at least 1 lowercase letter", "at least 1 uppercase letter", "at least 1 number", "at least 1 symbol", "12 characters minimum"]
  const [requirements, setRequirements] = useState(initialReq);
  const [show, setShow] = useState(true);
  const [redirect, setRedirect] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const requirementsAreFulfilled = !hasOneLowerCase || !hasOneUpperCase || !hasOneNumber || !hasOneSymbol || !hasTwelveCharacterMin;

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNewAccount(email, password)
      .then((result) => {
        setErrors(result);
        if (result.email === "" && result.password === "") {
          setRedirect("/admin");
        }
      })
      .catch((err) => {
        setErrors(err);
      });
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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

  const modalTitle = "Create Your Account";
  const subtitle = "Register your email and create a password";

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
    <CommonModal title={modalTitle} subtitle={subtitle} show={show} handleClose={handleClose} body={
      <div>
        <form onSubmit={handleClick}>
          <div>
            <div className="row">
              <div className="text signup">Email Address</div>
              <div className="text error">{errors.email}</div>
            </div>
            {errors.email ?
              <div className={`row bordered error`}><input
                name="email"
                placeholder="Enter your company email"
                type="text"
                value={email}
                className={
                  errors.email
                    ? "text-field password error"
                    : "text-field password"
                }
                onChange={onChangeEmail}
              />
                <div
                  className="text-field-alert"
                ><i className="bi bi-exclamation-circle alert-icon"></i></div>
              </div> :
              <input
                name="email"
                placeholder="Enter your company email"
                type="text"
                value={email}
                className="text-field"
                onChange={onChangeEmail}
              />}
          </div>
          <div>
            <div className="row">
              <div className="text signup">
                Password
              </div>
              <div className="text error">{errors.password}</div>
            </div>
            <div className="pass-req">
              <OverlayTrigger placement="bottom" overlay={popover}>
                <input
                  type="password"
                  name="password"
                  className={
                    errors.password ? "text-field error" : "text-field"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={onChangePass}
                />
              </OverlayTrigger>
            </div>
          </div>
          <Spacer height={40} />
          <button
            role="link"
            className="button"
            disabled={requirementsAreFulfilled}
          >
            Sign Up
              </button>
          <div>
            <div
              onClick={() => {
                setRedirect("/login");
              }}
              className="text redirect center"
            >
              <u>{"Have an account?"}</u>
            </div>
          </div>
        </form>
      </div>} />
  );
}

export default SignUpModal;
