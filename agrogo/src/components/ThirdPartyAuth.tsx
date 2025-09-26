import {
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    type AuthProvider
} from "firebase/auth";
import { Button } from "react-bootstrap";
import { auth } from "../firebase/config";
import "../stylesheets/Auth.css";

interface LoginProps {
  onClose: () => void;
  setUserAuthed: (authed: boolean) => void;
  setErrorMessage: (msg: string) => void;
}

/**
 * A reusable authentication component that enables users to sign in
 * using third-party providers via Firebase Authentication.
 *
 * Props:
 * - onClose (function): Callback to close the parent modal on successful login.
 * - setUserAuthed (function): Updates parent state to indicate whether the user
 *   is authenticated (true if login succeeds, false otherwise).
 * - setErrorMessage (function): Sets an error message in the parent component
 *   if login fails.
 *
 * Features:
 * - Provides Google and GitHub login options using Firebase's `signInWithPopup`.
 * - Handles authentication success:
 *   - Logs the authenticated user to the console.
 *   - Updates the parent authentication state to `true`.
 *   - Closes the modal via `onClose`.
 * - Handles authentication errors:
 *   - Displays Firebase error messages or a generic fallback.
 *   - Updates the parent authentication state to `false`.
 * - Styled with React-Bootstrap buttons.
 *
 * 9.26 - Created by Drew
 */
function ThirdPartyAuth({ onClose, setUserAuthed, setErrorMessage }: LoginProps) {

  // External login instances - Drew
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  /**
   * Handles third-party authentication via popup.
   *
   * Attempts to sign in the user using the specified Firebase Auth provider
   * (e.g., Google or GitHub) through `signInWithPopup`.
   *
   * On success:
   * - Logs the authenticated user to the console.
   * - Sets the parent authentication state to true via `setUserAuthed`.
   * - Closes the parent modal with `onClose`.
   *
   * On failure:
   * - Captures and sets the error message (from Firebase or a generic fallback)
   *   using `setErrorMessage`.
   * - Sets the parent authentication state to false.
   *
   * @param provider - A Firebase `AuthProvider` instance (e.g., GoogleAuthProvider, GithubAuthProvider).
   *
   * 9.26 - Created by Drew
   */
  const handlePopupLogin = async (provider: AuthProvider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Logged in:", result.user);
      setUserAuthed(true);
      onClose();
    } catch(err: unknown) {
      if(err instanceof Error) setErrorMessage?.(err.message);
      else setErrorMessage?.("Unknown error");
      setUserAuthed(false);
    }
  };

  return (
    <>
      <hr />
      <p className="text-center">Or sign in with</p>
      <div className="d-flex flex-column gap-2">
        {/* Google and Github are currently supported 3rd party options */}
        <Button variant="outline-danger" onClick={() => handlePopupLogin(googleProvider)}>Continue with Google</Button>
        <Button variant="outline-dark" onClick={() => handlePopupLogin(githubProvider)}>Continue with GitHub</Button>
      </div>
    </>
  );
}

export default ThirdPartyAuth;