import firebase from "./firebase";

interface AuthErrorMessageInterface {
  "auth/invalid-email": string;
  "auth/email-already-in-use": string;
  "invalid-domain": string;
  "invalid-password": string;
}

const AuthErrorMessage: AuthErrorMessageInterface = {
  //firebase
  "auth/invalid-email": "Invalid email.",
  "auth/email-already-in-use": "That email has already been registered.",
  //pre-firebase
  "invalid-domain": "Invalid email domain.",
  "invalid-password": "Please enter a valid password.",
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
