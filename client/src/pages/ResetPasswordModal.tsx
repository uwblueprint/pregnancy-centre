import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router-dom";

import { allRequirementMessagesInOrder, validatePasswordAndUpdateRequirementSetters } from "../services/auth";
import { handlePasswordReset } from "../services/auth";
import LogoModal from "../components/organisms/LogoModal";
import { TextField } from "../components/atoms/TextField";

interface Props {
    actionCode: string;
}

const ResetPasswordModal: FunctionComponent<Props> = (props: Props) => {
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const handleClose = () => setRedirect("/");
    const [requirements, setRequirements] = useState(allRequirementMessagesInOrder);
    const [redirect, setRedirect] = useState("");
    const [passwordResetAttempted, setPasswordResetAttempted] = useState(false);
    const [passwordResetSuccessful, setPasswordResetSuccessful] = useState(false);

    const errors = { email: "", password: "" };
    const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (requirements.length == 0) {
            handlePasswordReset(props.actionCode, password).then((resp: boolean) => {
                if (resp) {
                    setPasswordResetSuccessful(true);
                } else {
                    setPasswordResetSuccessful(false);
                }
                setPasswordResetAttempted(true);
            });
        }
    };

    const onChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setRequirements(validatePasswordAndUpdateRequirementSetters(password));
        setPassword(password);
    };

    const modalTitle = "Reset Your Password";
    const subtitle = "Enter a new password to continue";

    const popover = (
        <Popover id="popover-basic" show={requirements.length > 0}>
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
            <div className="reset-password-modal">
                <LogoModal
                    title={modalTitle}
                    subtitle={subtitle}
                    show={!passwordResetAttempted}
                    handleClose={handleClose}
                    body={
                        <div className="reset-password-modal">
                            <form onSubmit={handleClick}>
                                <div>
                                    <div className="row">
                                        <div className="text signup">Password</div>
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
                                                ></TextField>
                                            </div>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                                <button role="link" className="button reset-pass">
                                    Reset password
                                </button>
                            </form>
                        </div>
                    }
                />
                <LogoModal
                    show={passwordResetAttempted && passwordResetSuccessful}
                    title={"Password Reset Successful"}
                    subtitle={""}
                    handleClose={() => setRedirect("/")}
                    body={
                        <span>
                            <div className="text">
                                Your password has now been changed. You may now close this window or login with your new
                                password using the button below.
                            </div>
                            <button className="button" onClick={() => setRedirect("/login")}>
                                Log in
                            </button>
                        </span>
                    }
                />
                <LogoModal
                    show={passwordResetAttempted && !passwordResetSuccessful}
                    title={"Password Reset Error"}
                    subtitle={""}
                    handleClose={() => setRedirect("/")}
                    body={
                        <span>
                            <div className="text">
                                Sorry about that, looks like there was an error in resetting your password!
                            </div>
                        </span>
                    }
                />
            </div>
        </React.Fragment>
    );
};

export default ResetPasswordModal;
