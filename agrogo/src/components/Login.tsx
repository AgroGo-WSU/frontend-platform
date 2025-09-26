import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config.ts";

interface LoginProps {
  onClose: () => void;
}

function Login({ onClose }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in as:", userCredential.user);
        onClose();
      } catch (err: unknown) {
        if(err instanceof Error)
          setError(err.message);
        else
          setError("Unknown error");
      }
    };

    return (
        <div className="loginOverlay">
          <div className="login">
            <form onSubmit={handleLogin}>
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
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
    );
}

export default Login;