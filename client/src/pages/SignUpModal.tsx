import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router-dom";

import { allRequirementMessagesInOrder, validatePasswordAndUpdateRequirementSetters } from "../services/auth";
import ConfirmationModal from "./ConfirmationModal";
import { createNewAccount } from "../services/auth";
import LogoModal from "../components/organisms/LogoModal";

const SignUpModal: FunctionComponent = () => {
    const [email, setEmail] = useState("");
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
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
    const requirementsAreFulfilled =
        !hasOneLowerCase || !hasOneUpperCase || !hasOneNumber || !hasOneSymbol || !hasTwelveCharacterMin;

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

    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const requirementToStateSetterMap = new Map([
        ["lowerCase", setHasOneLowerCase],
        ["upperCase", setHasOneUpperCase],
        ["number", setHasOneNumber],
        ["symbol", setHasOneSymbol],
        ["twelveCharacters", setHasTwelveCharacterMin]
    ]);

    const onChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setRequirements(validatePasswordAndUpdateRequirementSetters(password, requirementToStateSetterMap));
        setPassword(password);
    };

    const modalTitle = "Create Your Account";
    const subtitle = "Register your email and create a password";

    const popover = (
        <Popover id="popover-basic" show={requirementsAreFulfilled}>
            <Popover.Title as="h3">Password Requirements</Popover.Title>
            <Popover.Content>
                {requirements.length > 0 ? (
                    <ul>
                        {requirements.map((i) => (
                            <li key={i}>{i}</li>
                        ))}
                    </ul>
                ) : (
                    <div className="text signup">Your password meets the requirements!</div>
                )}
            </Popover.Content>
        </Popover>
    );
    if (redirect !== "") {
        return <Redirect to={redirect} />;
    }
    return (
        <React.Fragment>
            <LogoModal
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
                                <div className={errors.email && `row bordered error`}>
                                    <input
                                        name="email"
                                        placeholder="Enter your company email"
                                        type="text"
                                        value={email}
                                        className={
                                            errors.email ? "text-field-input password error" : "text-field-input"
                                        }
                                        onChange={onChangeEmail}
                                    />
                                    <div className={errors.email ? "text-field-input-alert" : "hidden"}>
                                        <i className="bi bi-exclamation-circle alert-icon"></i>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="row">
                                    <div className="text signup">Password</div>
                                    <div className="text error">{errors.password}</div>
                                </div>
                                <div className="pass-req">
                                    <OverlayTrigger placement="bottom" overlay={popover}>
                                        <input
                                            type={hidePassword ? "password" : "text"}
                                            name="password"
                                            className={errors.password ? "text-field-input error" : "text-field-input"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={onChangePass}
                                        />
                                    </OverlayTrigger>
                                    <i
                                        onClick={() => setHidePassword(!hidePassword)}
                                        className={hidePassword ? "bi bi-eye" : "bi bi-eye-slash"}
                                    />
                                </div>
                            </div>
                            <button role="link" className="button signup" disabled={requirementsAreFulfilled}>
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
                    </div>
                }
            />
            {confirmationEmailSent && <ConfirmationModal email={email} resentEmail={true}></ConfirmationModal>}
        </React.Fragment>
    );
};

export default SignUpModal;
