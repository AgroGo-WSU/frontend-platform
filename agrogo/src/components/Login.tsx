import { useState } from "react";
import { 
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase/config.ts";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import ThirdPartyAuth from "./ThirdPartyAuth.tsx";
import "../stylesheets/Auth.css";

interface LoginProps {
  show: boolean;
  onClose: () => void;
  setUserAuthed: (authed: boolean) => void;
}

/**
 * Login Component
 *
 * A modal-based login form that allows users to sign in with email and password
 * using Firebase Authentication. The component provides password visibility 
 * toggling, error handling, and integrates third-party authentication options.
 *
 * Props:
 * - show (boolean): Controls whether the modal is visible.
 * - onClose (function): Callback to close the modal.
 * - setUserAuthed (function): Updates parent state to indicate whether the user
 *   is authenticated (true if login succeeds, false otherwise).
 *
 * Features:
 * - Firebase email/password authentication via `signInWithEmailAndPassword`.
 * - Password visibility toggle with an eye icon.
 * - Displays validation or Firebase error messages.
 * - Includes a `ThirdPartyAuth` component for social login providers.
 * - Styled with React-Bootstrap and custom CSS overrides.
 * 
 * 9.26 - Created by Drew
 */
function Login({ show, onClose, setUserAuthed }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handles the login form submission for email/password authentication.
   *
   * Prevents the default form submission behavior, then attempts to log in the
   * user using Firebase's `signInWithEmailAndPassword` method.
   *
   * On success:
   * - Logs the authenticated user to the console.
   * - Sets the parent authentication state to true via `setUserAuthed`.
   * - Closes the login modal.
   *
   * On failure:
   * - Captures and sets the error message (either from Firebase or a generic message).
   * - Sets the parent authentication state to false.
   *
   * @param e - The form submission event from the login form.
   * 
   * 9.26 - Created by Drew
   */
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in as:", userCredential.user);
      setUserAuthed(true);
      onClose();
    } catch (err: unknown) {
      // Some errors may not be actual `Error` instances (e.g. thrown strings)
      // This check ensures we only access `.message` safely
      if(err instanceof Error) setError(err.message);
      else setError("Unknown error");
      setUserAuthed(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="auth-menu">
      {/* Header displaying the close button and title */}
      <Modal.Header closeButton className="auth-header">
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body className="auth-body">
        <hr />
        <Form onSubmit={handleEmailLogin}>
          {/* Email input field */}
          <Form.Group controlId="loginEmail" className="mb-2">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {/* Password input field */}
          <Form.Group controlId="loginPassword">
            <InputGroup className="mb-2">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputGroup.Text onClick={() => setShowPassword((prev) => !prev)} style={{cursor: "pointer", background: "white"}}>
                {/* Eye icon toggles password visibility between plain text and masked */}
                {showPassword ? <EyeSlashFill /> : <EyeFill />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          
          {error && <p className="error">{error}</p>}
          <Button type="submit" className="submit-button w-100">Login</Button>
        </Form>

        {/* Display any third party authentication methods to the user */}
        <ThirdPartyAuth onClose={onClose} setUserAuthed={setUserAuthed} setErrorMessage={setError} />
      </Modal.Body>
    </Modal>
  );
}

export default Login;