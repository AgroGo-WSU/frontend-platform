import { auth } from "./firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updatePassword, 
    sendEmailVerification

 } from "firebase/auth"; // the firebase/auth in your node_modules

// for more info on how react works and how these functions get used in the app, look at my notes in authentication.ts

// now we're going to writ ethe the actual functions to create a new user, sign in a user, and signin users from 3rd party services
// we can also add password reset, password change, and email verification

// create a new user
export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

// sign in using email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// sign in with Google
export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // for testing purposes, you can see the user info with this: result.user
    return result;
};

// sign out function
export const doSignOut = () => {
    return auth.signOut();
};

// password reset
export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

// update password
export const doUpdatePassword = (password) => {
    return updatePassword(auth.currentUser, password);
};

// send email verification
export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`
    });
};