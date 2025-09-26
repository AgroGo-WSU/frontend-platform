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

function ThirdPartyAuth({ onClose, setUserAuthed, setErrorMessage }: LoginProps) {

  // External login instances - Drew
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

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
        <Button variant="outline-danger" onClick={() => handlePopupLogin(googleProvider)}>Continue with Google</Button>
        <Button variant="outline-dark" onClick={() => handlePopupLogin(githubProvider)}>Continue with GitHub</Button>
      </div>
    </>
  );
}

export default ThirdPartyAuth;