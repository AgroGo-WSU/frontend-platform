import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase/config"

interface SignupProps {
    onClose: () => void;
    setUserAuthed: (authed: boolean) => void
}

function Signup({ onClose, setUserAuthed }: SignupProps) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email!,
        password
      );
      console.log("Signed up as:", userCredential.user);
      setUserAuthed(true);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error")
      setUserAuthed(false);
    }
  }

  return (
    <div className="signupOverlay">
      <div className="signup">
        <form onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" onClick={handleSignup}>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;