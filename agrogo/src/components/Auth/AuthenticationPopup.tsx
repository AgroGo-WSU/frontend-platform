import React, { useState } from 'react';
import { doSignInWithEmailAndPassword,
        doSignInWithGoogle,
        doCreateUserWithEmailAndPassword,
        doPasswordReset,
        doSignOut
 } from '../firebase/auth.ts';
import { useAuth } from '../contexts/authContext/authentication.tsx';
import { FirebaseError } from 'firebase/app';
import LoginMenu from './LoginMenu.tsx';
import SignupMenu from './SignupMenu.tsx';

function AuthenticationPopup() {
    const { userLoggedIn } = useAuth();

    const [email] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    // Common wrapper for all authentication actions, a similar try/catch/finally block is used for all
    const handleAuthAction = async <T,>(action: () => Promise<T>) => {
        // These checks stops multiple authentication attempts when one is already being performed
        if(isSigningIn) return;
        if(isSigningOut) return;
        
        // Once that check has been performed, we can guarantee that we are using this authentication method
        // Set the flag to true so that no other authentication methods can be used while this one is in use
        setIsSigningIn(true);
        try {
            await action(); // note: await functions are like async functions, but you're telling React not to go any further until this function returns
        } catch(err) {
            if(err instanceof FirebaseError) {
                setErrorMessage(err.message);
                console.error("Firebase error:", err);
            } else {
                console.error("Unexpected error:", err);
            }
            throw err;
        } finally {
            setIsSigningIn(false);
        }
    }

    // this is an event handler for the user submitting their login info
    // might change back to onSubmit if that's easier
    const onLoginFromModal = async (creds: {
        email: string;
        password: string;
    }) => {
        await handleAuthAction(() => doSignInWithEmailAndPassword(creds.email, creds.password))
    }

    const onSignupFromModal = async(creds: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => {
        await handleAuthAction(() => doCreateUserWithEmailAndPassword(creds.email, creds.password))
    }

    const onGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await handleAuthAction(() => doSignInWithGoogle());
    }

    const onPasswordReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await handleAuthAction(() => doPasswordReset(email));
    }

    const onSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(!userLoggedIn) {
            setErrorMessage("Error: user already signed out...");
            return;
        }
        if(isSigningOut) return;
        setIsSigningOut(true);

        try {
            await doSignOut();
        } catch (err) {
            if(err instanceof FirebaseError) setErrorMessage(err.message);
        } finally {
            setIsSigningOut(false);
        }
    }

    console.log("userLoggedIn: ", userLoggedIn);
    console.log("isSigningIn: ", isSigningIn);
    console.error(errorMessage);

    return (
        <>
        <h1>I hope you remember your gmail password</h1>
        <button onClick={() => setShowLogin(true)}>Click to sign in with email and password</button>
        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { onGoogleSignIn(e) }}>Click to sign in with Gooble</button>
        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { onPasswordReset(e) }}>Click to reset password</button>
        <button onClick={() => setShowSignup(true)}>Click to sign up</button>
        {userLoggedIn && <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { onSignOut(e) }}>Click to sign out</button>}
        <LoginMenu 
            show={showLogin} 
            onClose={() => setShowLogin(false)} 
            onLogin={onLoginFromModal}
        />
        <SignupMenu
            show={showSignup}
            onClose={() => setShowSignup(false)}
            onSignup={onSignupFromModal}
        />
        </>
    )

}

export default AuthenticationPopup;