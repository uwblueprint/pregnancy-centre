import React, { FunctionComponent, useState } from "react";
import LogoModal from "../components/organisms/LogoModal";
import { Redirect } from "react-router-dom";

import { AuthErrorMessage, signIn } from "../services/auth";
import ConfirmationModal from "./ConfirmationModal";
import FormItem from "../components/molecules/FormItem";
import { TextField } from "../components/atoms/TextField";

const SignInModal: FunctionComponent = () => {
    const initialErrors = { email: "", password: "" };
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState(initialErrors);
    const [hidePassword, setHidePassword] = useState(true);
    const [redirect, setRedirect] = useState("");
    const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);

    const handleClose = () => setRedirect("/");

    const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signIn(email, password)
            .then((res) => {
                setErrors(res);
                if (!res.email.length && !res.password.length) {
                    setRedirect("/admin");
                }
                if (res.email === AuthErrorMessage["unconfirmed-email"]) {
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
            <LogoModal
                title={modalTitle}
                subtitle={subtitle}
                show={!confirmationEmailSent}
                handleClose={handleClose}
                body={
                    <div className="sign-in-modal">
                        <form onSubmit={handleClick}>
                            <FormItem
                                className="email-form-item"
                                formItemName="Email Address"
                                errorString={errors.email}
                                isDisabled={false}
                                inputComponent={
                                    <TextField
                                        type="text"
                                        name="email"
                                        placeholder="Enter your company email"
                                        input={email}
                                        onChange={onChangeEmail}
                                        isDisabled={false}
                                        isErroneous={errors.email !== ""}
                                    />
                                }
                            />
                            <FormItem
                                className="password-form-item"
                                formItemName="Password"
                                errorString={errors.password}
                                isDisabled={false}
                                inputComponent={
                                    <TextField
                                        type={hidePassword ? "password" : "text"}
                                        name="password"
                                        placeholder="Enter your password"
                                        input={password}
                                        onChange={onChangePass}
                                        isDisabled={false}
                                        isErroneous={errors.password !== ""}
                                        iconClassName={hidePassword ? "bi bi-eye" : "bi bi-eye-slash"}
                                        onIconClick={() => {
                                            setHidePassword(!hidePassword);
                                        }}
                                    />
                                }
                            />
                            <div
                                className="text redirect right"
                                onClick={() => {
                                    setRedirect("/email-password-reset");
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
                    </div>
                }
            />
            {confirmationEmailSent && <ConfirmationModal email={email} resentEmail={true}></ConfirmationModal>}
        </React.Fragment>
    );
};

export default SignInModal;
