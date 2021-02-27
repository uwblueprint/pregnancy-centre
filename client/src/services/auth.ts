import firebase from "./firebase";

export const createNewAccount = async (
  email: string,
  password: string
): Promise<{ email: string; password: string }> => {
  //12 characters min., Contains: Upper, Lower, Number, Non-Alphanumeric
  const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})/;
  let errors = {
    email: "",
    password: "",
  };

  //needed to make ts happy
  interface errorMessageInterface {
    "auth/invalid-email": string;
    "auth/email-already-in-use": string;
    "invalid-domain": string;
    "invalid-password": string;
  }

  const errorMessageMap: errorMessageInterface = {
    //firebase
    "auth/invalid-email": "Invalid email.",
    "auth/email-already-in-use": "That email has already been registered.",
    //pre-firebase
    "invalid-domain": "Invalid email domain.",
    "invalid-password": "Please enter a valid password.",
  };

  if (!passwordRequirements.test(password)) {
    errors.password = errorMessageMap["invalid-password"];
  }
  if (!email.endsWith("@pregnancycentre.ca")) {
    errors.email = errorMessageMap["invalid-domain"];
  }

  if (!errors.email.length && !errors.password.length) {
    errors = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        return { email: "", password: "" };
      })
      .catch((error) => {
        const code: keyof errorMessageInterface = error.code;
        return { email: errorMessageMap[code], password: "" };
      });
  }

  return errors;
};
