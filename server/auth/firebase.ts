import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
});

export async function getUser(cookie) {
  console.log(cookie);
  const user = await verifyUserSessionToken(cookie);
  return { id: user?.uid, admin: user?.admin };
}

const verifyUserSessionToken = async (token) => {
  //Verify session cookies tokens with firebase admin.
  //This is a low overhead operation.
  console.log(token);
  const user = await admin
    .auth()
    .verifySessionCookie(token, true /** checkRevoked */);
  console.log(user);
  if (user.uid) {
    console.log(user);
    return user;
  } else {
    throw new AuthError({ message: "User Session Token Verification Error" });
  }
};

export class AuthError extends Error {
  constructor(
    error: { message: string; stack?: any } = { message: "Not authorized" }
  ) {
    super(error.message);
  }
}
