import firebase from "./firebase";

export const createNewAccount = (email: string, password: string) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userData) => {
      console.log(userData.user);
    });
};
