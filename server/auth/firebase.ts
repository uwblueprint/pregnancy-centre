import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
});

export async function getUser(cookie) {
  console.log("HELLLOOOOOO");
  console.log(typeof cookie);
  const user = await verifyUserSessionToken(cookie);
  return { id: user?.uid, admin: user?.admin };
}

const verifyUserSessionToken = async (token) => {
  //Verify session cookies tokens with firebase admin.
  //This is a low overhead operation.
  const user = await admin
    .auth()
    .verifySessionCookie(token, true /** checkRevoked */);
  if (user.uid) {
    return user;
  } else {
    throw new Error("User Session Token Verification Error");
  }
};
