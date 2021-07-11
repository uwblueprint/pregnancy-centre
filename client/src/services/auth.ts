import firebase from "./firebase";

interface AuthErrorMessageInterface {
    "auth/invalid-email": string;
    "auth/email-already-in-use": string;
    "invalid-domain": string;
    "invalid-password": string;
    "auth/user-not-found": string;
    "auth/wrong-password": string;
    "empty-email": string;
    "empty-password": string;
    "unconfirmed-email": string;
}

export const AuthErrorMessage: AuthErrorMessageInterface = {
    //firebase (https://firebase.google.com/docs/reference/js/firebase.auth.Auth)
    "auth/invalid-email": "Invalid email",
    "auth/email-already-in-use": "That email has already been registered",
    "auth/user-not-found": "No account with this email",
    "auth/wrong-password": "Password is incorrect",
    //pre-firebase
    "invalid-domain": "Invalid email domain",
    "invalid-password": "Please enter a valid password",
    "empty-email": "Please enter your email",
    "empty-password": "Please enter your password",
    "unconfirmed-email": "Please use the link sent to your email to confirm your account"
};

export const requirementToTestMap: Array<{ req: string; test: RegExp }> = [
    { req: "lowerCase", test: /^(?=.*[a-z])/ },
    { req: "upperCase", test: /^(?=.*[A-Z])/ },
    { req: "number", test: /^(?=.*[0-9])/ },
    { req: "symbol", test: /^(?=.*[*!@#$%^&(){}[\]:;<>,.?/~_+\-=|\\])/ },
    { req: "twelveCharacters", test: /^(?=.{12,})/ }
];

export const requirementToMessageMap = new Map([
    ["lowerCase", "at least 1 lowercase letter"],
    ["upperCase", "at least 1 uppercase letter"],
    ["number", "at least 1 number"],
    ["symbol", "at least 1 symbol"],
    ["twelveCharacters", "12 characters minimum"]
]);

// Requirement messages in the order of requirementToTestMap
export const allRequirementMessagesInOrder: Array<string> = requirementToTestMap.map(({ req }) => {
    const msg = requirementToMessageMap.get(req);
    if (!msg) return "";
    return msg;
});

const emailDomain = process.env.REACT_APP_EMAIL_DOMAIN ? process.env.REACT_APP_EMAIL_DOMAIN : "@pregnancycentre.ca";

export const createNewAccount = async (
    email: string,
    password: string
): Promise<{ email: string; password: string }> => {
    //12 characters min., Contains: Upper, Lower, Number, Non-Alphanumeric (see group below)
    const passwordRequirements =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*.! @#$%^&(){}[\]:;<>,.?/~_+-=|\\])(?=.{12,})/;
    let errors = {
        email: "",
        password: ""
    };

    //needed to make ts happy

    if (!passwordRequirements.test(password)) {
        errors.password = AuthErrorMessage["invalid-password"];
    }
    if (!email.endsWith(emailDomain)) {
        errors.email = AuthErrorMessage["invalid-domain"];
    }

    if (!errors.email.length && !errors.password.length) {
        errors = await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                const user = firebase.auth().currentUser;
                user?.sendEmailVerification();
                return { email: "", password: "" };
            })
            .catch((error) => {
                const code: keyof AuthErrorMessageInterface = error.code;
                return { email: AuthErrorMessage[code], password: "" };
            });
    }

    return errors;
};

export const handlePasswordReset = async (actionCode: string, newPassword: string): Promise<boolean> => {
    const error = await firebase
        .auth()
        .confirmPasswordReset(actionCode, newPassword)
        .then(() => true)
        .catch(() => false);

    return error;
};

export const sendPasswordResetEmail = async (email: string): Promise<string> => {
    if (email.length === 0) {
        return AuthErrorMessage["empty-email"];
    }

    if (!email.endsWith(emailDomain)) {
        return AuthErrorMessage["invalid-domain"];
    }

    const error = await firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => "")
        .catch((err) => {
            const code: keyof AuthErrorMessageInterface = err.code;
            return AuthErrorMessage[code];
        });

    return error;
};

export const handleVerifyEmail = async (actionCode: string): Promise<string> => {
    const error = await firebase
        .auth()
        .applyActionCode(actionCode)
        .then((resp) => {
            return resp;
        })
        .catch((err) => {
            return err.code;
        });
    return error;
};

export const signIn = async (email: string, password: string): Promise<{ email: string; password: string }> => {
    let errors = { email: "", password: "" };
    if (!email.length || !password.length) {
        errors = {
            email: email.length ? "" : AuthErrorMessage["empty-email"],
            password: password.length ? "" : AuthErrorMessage["empty-password"]
        };
    } else {
        errors = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(async () => {
                const user = firebase.auth().currentUser;

                if (user && !user.emailVerified) {
                    user?.sendEmailVerification();
                    return {
                        email: AuthErrorMessage["unconfirmed-email"],
                        password: ""
                    };
                }
                return await postToken();
            })
            .catch((error) => {
                const code: keyof AuthErrorMessageInterface = error.code;
                return {
                    email: code !== "auth/wrong-password" ? AuthErrorMessage[code] : "",
                    password: code === "auth/wrong-password" ? AuthErrorMessage[code] : ""
                };
            });
    }
    return errors;
};

async function postToken() {
    const errors = await firebase
        .auth()
        .currentUser?.getIdToken()
        .then(async (token) => {
            const res = await fetch(`${process.env.REACT_APP_GRAPHQL_SERVER_URL}/sessionLogin`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: token })
            });

            return res?.status === 200
                ? { email: "", password: "" }
                : {
                      email: "Something went wrong. Please try again.",
                      password: " "
                  };
        });

    return (
        errors || {
            email: "Something went wrong. Please try again.",
            password: " "
        }
    );
}

export const validatePasswordAndUpdateRequirementSetters = (
    password: string,
    requirementToSetterMap?: Map<string, (state: boolean) => void>
): Array<string> => {
    const missingRequirements: Array<string> = [];

    requirementToTestMap.forEach(({ req, test }) => {
        const result = test.test(password);
        if (result === false) {
            const reqMsg = requirementToMessageMap.get(req);
            if (reqMsg) {
                missingRequirements.push(reqMsg);
            }
        }
        if (requirementToSetterMap) {
            requirementToSetterMap.get(req)!(result);
        }
    });

    return missingRequirements;
};
