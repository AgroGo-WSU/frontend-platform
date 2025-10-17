import React, { useState } from 'react';
import { doSignInWithEmailAndPassword,
        doSignInWithGoogle,
        doSignInWithGithub,
        doCreateUserWithEmailAndPassword,
        doPasswordReset,
} from '../firebase/auth.ts';
import { useAuth } from '../../hooks/UseAuth.tsx';
import { FirebaseError } from 'firebase/app';
import LoginMenu from './LoginMenu.tsx';
import SignupMenu from './SignupMenu.tsx';
import ResetPasswordMenu from './ResetPasswordMenu.tsx';
import '../../stylesheets/AuthenticationPopup.css';

function AuthenticationPopup() {
    const { userLoggedIn } = useAuth();

    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showReset, setShowReset] = useState(false);

    // Common wrapper for all authentication actions, a similar try/catch/finally block is used for all
    const handleAuthAction = async <T,>(action: () => Promise<T>) => {
        // These checks stops multiple authentication attempts when one is already being performed
        if(isSigningIn) return;
        
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

    const onGithubSignIn = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await handleAuthAction(() => doSignInWithGithub());
    }

    const onPasswordResetFromModal = async(creds: { email: string; }) => {
        try {
            await handleAuthAction(() => doPasswordReset(creds.email));
            console.log("Password reset email sent!");
        } catch (err) {
            console.error("Password reset failed:", err);
        }
    }

    console.log("userLoggedIn: ", userLoggedIn);
    console.log("isSigningIn: ", isSigningIn);
    console.error(errorMessage);

    return (
        <>
        <div className="auth-popup-container">
            <div className="auth-popup-card">
                <h2 className="auth-popup-title">Welcome Back</h2>
                <p className="auth-popup-subtitle">Sign in to continue to AgroGo</p>

                <div className="auth-social-btns">
                    <button 
                        className="auth-btn google" 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { onGoogleSignIn(e) }} 
                        disabled={isSigningIn}
                    >
                        <span className="icon">🌐</span> Continue with Google
                    </button>

                    <button 
                        className="auth-btn github" 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { onGithubSignIn(e) }} 
                        disabled={isSigningIn}
                    >
                        <span className="icon">😸</span> Continue with GitHub
                    </button>
                </div>

                <div className="auth-divider">
                    <span></span>or<span></span>
                </div>

                <div className="auth-links">
                    <button className="auth-link" onClick={() => setShowLogin(true)}>Sign in with Email</button>
                    <button className="auth-link" onClick={() => setShowSignup(true)}>Create Account</button>
                    <button className="auth-link" onClick={() => setShowReset(true)}>Forgot Password</button>
                </div>

                {errorMessage && <p className="auth-error">{errorMessage}</p>}
            </div>
        </div>

        {/* popup modal menus, don't show from the start */}
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
        <ResetPasswordMenu
            show={showReset}
            onClose={() => setShowReset(false)}
            onResetPassword={onPasswordResetFromModal}
        />
        </>
    )
}

export default AuthenticationPopup;