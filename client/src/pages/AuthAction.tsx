import React from "react";

import EmailConfirmedModal from "./EmailConfirmedModal";
import ResetPasswordModal from "./ResetPasswordModal";

const AuthAction: React.FunctionComponent<Record<string, never>> = () => {
    const url = new URL(window.location.href);
    const URLParams = new URLSearchParams(url.search);
    const actionCode = URLParams.get("oobCode");
    const mode = URLParams.get("mode");

    return (
        <>
            {mode === "verifyEmail" && actionCode && <EmailConfirmedModal actionCode={actionCode} />}
            {mode === "resetPassword" && actionCode && <ResetPasswordModal actionCode={actionCode} />}
        </>
    );
};

export default AuthAction;
