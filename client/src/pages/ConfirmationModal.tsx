import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router-dom";

import LogoModal from "../components/organisms/LogoModal";

interface Props {
    email: string;
    resentEmail: boolean;
}

const ConfirmationModal: FunctionComponent<Props> = (props: Props) => {
    const [redirect, setRedirect] = useState("");

    const handleClose = () => setRedirect("/");

    if (redirect !== "") {
        return <Redirect to={redirect} />;
    }

    return (
        <LogoModal
            show={true}
            title={"Confirm Your Email"}
            subtitle={""}
            handleClose={handleClose}
            body={
                <span>
                    <div className="text">
                        {props.resentEmail
                            ? "We've just resent a confirmation email to the following address."
                            : "We’ve just sent an email to the following email address."}
                    </div>
                    <div className="text link">{props.email}</div>
                    <div className="text">
                        You’ll have 3 days to open the confirmation link in the email to confirm that you own the email
                        address.
                    </div>
                    <div className="text">You’ll then be able to login as an employee.</div>
                    <button className="button" onClick={handleClose}>
                        I understand
                    </button>
                </span>
            }
        ></LogoModal>
    );
};

export default ConfirmationModal;
