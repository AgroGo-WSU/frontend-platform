import React, { useState } from 'react';
// import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword,
        doSignInWithGoogle,
        doCreateUserWithEmailAndPassword,
        doPasswordReset,
        doSignOut
 } from '../firebase/auth.ts';
import { useAuth } from '../contexts/authContext/authentication.tsx';
import { FirebaseError } from 'firebase/app';


function AuthenticationPopup() {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
        } finally {
            setIsSigningIn(false);
        }
    }

    // this is an event handler for the user submitting their login info
    // might change back to onSubmit if that's easier
    const onSubmitButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // preventDefault() stops the event that was going to happen by default from happening so that y ou can insert your own logic
        e.preventDefault();
        await handleAuthAction(() => doSignInWithEmailAndPassword(email, password));
    }

    const onSignUpButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await handleAuthAction(() => doCreateUserWithEmailAndPassword(email, password));
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
        <input 
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { onSubmitButton(e) }}>Click to sign in with email and password</button>
        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { onGoogleSignIn(e) }}>Click to sign in with Gooble</button>
        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { onPasswordReset(e) }}>Click to reset password</button>
        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { onSignUpButton(e) }}>Click to sign up</button>
        {userLoggedIn && <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { onSignOut(e) }}>Click to sign out</button>}
        </>
    )

}

export default AuthenticationPopup;