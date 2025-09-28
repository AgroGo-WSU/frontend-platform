import React, { useState } from 'react';
// import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword,
        doSignInWithGoogle,
        doCreateUserWithEmailAndPassword,
        doPasswordReset
 } from '../firebase/auth.ts';
import { useAuth } from '../contexts/authContext/authentication';


function AuthenticationPopup() {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // this is an event handler for the user submitting their login info
    // might chagne back to onSubmit if that's easier
    const onSubmitButton = async (e) => {
        // preventDefault() stops the event that was going to happen by default from happening so that y ou can insert your own logic
        e.preventDefault();
        if(!isSigningIn) {
            setIsSigningIn(true);
            await doSignInWithEmailAndPassword(email, password); // note: await functions are like async functions, but you're telling React not to go any further until this function returns
            console.log("I'm a hacket an I have ur gmail passwrod now");
        }
    }

    const onSignUpButton = async (e) => {
        e.preventDefault();
        if(!isSigningIn) {
            setIsSigningIn(true);
            await doCreateUserWithEmailAndPassword(email, password); 
        }
    }


    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if(!isSigningIn) {
            setIsSigningIn(true);
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false); // this is error handling for the 3rd party Google account signin, which sets the state back to false if that occurs
            });
        }
    }

    const onPasswordReset = async (e) => {
        e.preventDefault();
        if(!isSigningIn) {
            setIsSigningIn(true);
            await doPasswordReset(email); 
        }
    }

    console.log(userLoggedIn);


    return (
        <>
        <h1>I hope you remember your gmail password</h1>
        <button onClick={(e) => { onSubmitButton(e) }}>Click to sign in with email and password</button>
        <button onClick={(e) => { onGoogleSignIn(e) }}>Click to sign in with Gooble</button>
        <button onClick={(e) => { onPasswordReset(e) }}>Click to sign in with email and password</button>
        <button onClick={(e) => { onSignUpButton(e) }}>Click to sign up</button>
        </>
    )

}

export default AuthenticationPopup;