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
}

const AuthErrorMessage: AuthErrorMessageInterface = {
  //firebase (https://firebase.google.com/docs/reference/js/firebase.auth.Auth)
  "auth/invalid-email": "Invalid email.",
  "auth/email-already-in-use": "That email has already been registered.",
  "auth/user-not-found": "No account with this email",
  "auth/wrong-password": "Password is incorrect",
  //pre-firebase
  "invalid-domain": "Invalid email domain.",
  "invalid-password": "Please enter a valid password.",
  "empty-email": "Please enter your email",
  "empty-password": "Please enter your password",
};

export const createNewAccount = async (
  email: string,
  password: string
): Promise<{ email: string; password: string }> => {
  //12 characters min., Contains: Upper, Lower, Number, Non-Alphanumeric (see group below)
  const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*.! @#$%^&(){}[\]:;<>,.?/~_+-=|\\])(?=.{12,})/;
  let errors = {
    email: "",
    password: "",
  };

  //needed to make ts happy

  if (!passwordRequirements.test(password)) {
    errors.password = AuthErrorMessage["invalid-password"];
  }
  if (!email.endsWith("@pregnancycentre.ca")) {
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

export const handleVerifyEmail = async (
  actionCode: string
): Promise<string> => {
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

export const signIn = async (
  email: string,
  password: string
): Promise<{ email: string; password: string }> => {
  let errors = { email: "", password: "" };
  if (!email.length || !password.length) {
    errors = {
      email: email.length ? "" : AuthErrorMessage["empty-email"],
      password: password.length ? "" : AuthErrorMessage["empty-password"],
    };
  } else {
    errors = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        const result = await firebase
          .auth()
          .currentUser?.getIdToken()
          .then(async (token) => {
            const res = await fetch(
              `${process.env.REACT_APP_GRAPHQL_SERVER_URL}/sessionLogin`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: token }),
              }
            )
              .then((res) => {
                return res?.status === 200
                  ? { email: "", password: "" }
                  : {
                      email: "Something went wrong. Please try again.",
                      password: "",
                    };
              })
              .catch(() => {
                return {
                  email: "Something went wrong. Please try again.",
                  password: "",
                };
              });
            return res;
          })
          .catch(() => {
            return {
              email: "Something went wrong. Please try again.",
              password: "",
            };
          });
        return (
          result || {
            email: "Something went wrong. Please try again.",
            password: "",
          }
        );
      })
      .catch((error) => {
        const code: keyof AuthErrorMessageInterface = error.code;
        return {
          email: code !== "auth/wrong-password" ? AuthErrorMessage[code] : "",
          password:
            code === "auth/wrong-password" ? AuthErrorMessage[code] : "",
        };
      });
  }
  return errors;
};
