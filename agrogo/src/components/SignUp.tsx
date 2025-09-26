import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase/config";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons"
import ThirdPartyAuth from "./ThirdPartyAuth";
import "../stylesheets/Auth.css";

interface SignupProps {
  show: boolean
  onClose: () => void;
  setUserAuthed: (authed: boolean) => void
}

/**
 * Signup Component
 *
 * A modal-based registration form that allows new users to sign up with
 * an email and password using Firebase Authentication. Includes built-in
 * password validation, error handling, and third-party authentication.
 *
 * Props:
 * - show (boolean): Controls whether the modal is visible.
 * - onClose (function): Callback to close the modal.
 * - setUserAuthed (function): Updates parent state to indicate whether
 *   the user is authenticated (true if signup succeeds, false otherwise).
 *
 * Features:
 * - Firebase email/password signup via `createUserWithEmailAndPassword`.
 * - Enforces password rules:
 *   - At least 6 characters
 *   - Contains lowercase and uppercase letters
 *   - Contains at least one number
 *   - Contains at least one special character (!, @, #, $, etc.)
 *   - Must match the confirm password field
 * - Displays real-time validation messages for unmet password requirements.
 * - Password visibility toggles with eye icons for both password fields.
 * - Displays validation and Firebase error messages to the user.
 * - Integrates the `ThirdPartyAuth` component for social login providers.
 * - Styled with React-Bootstrap and custom CSS overrides.
 *
 * 9.26 - Created by Drew
 */
function Signup({ show, onClose, setUserAuthed }: SignupProps) {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password verification logic
  const passwordRules = {
    minLength: (pw: string) => pw.length >= 6,
    lowercase: (pw: string) => /[a-z]/.test(pw),
    uppercase: (pw: string) => /[A-Z]/.test(pw),
    number: (pw: string) => /\d/.test(pw),
    specialChar: (pw: string) => /[!@#$%^&*()]/.test(pw),
    match: (pw: string, confirm: string) => pw === confirm
  };

  /**
   * Handles the signup form submission for email/password registration.
   *
   * Prevents the default form submission behavior, then validates the entered
   * password against the defined password rules.
   *
   * On validation failure:
   * - Displays an error message prompting the user to fix password requirements.
   * - Aborts signup without calling Firebase.
   *
   * On success:
   * - Attempts to create a new user in Firebase Authentication using
   *   `createUserWithEmailAndPassword`.
   * - Logs the signed-up user to the console.
   * - Sets the parent authentication state to true via `setUserAuthed`.
   * - Closes the signup modal.
   *
   * On failure:
   * - Captures and sets the error message (either from Firebase or a generic message).
   * - Sets the parent authentication state to false.
   *
   * @param e - The form submission event from the signup form.
   *
   * 9.26 - Created by Drew
   */
  const handleEmailSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check all rules
    const rulesPassed = 
      passwordRules.minLength(password) &&
      passwordRules.lowercase(password) &&
      passwordRules.uppercase(password) &&
      passwordRules.number(password) &&
      passwordRules.specialChar(password) &&
      passwordRules.match(password, confirmPassword);
    
    // If ANY rule was broken, don't allow the user to login
    if(!rulesPassed) {
      setError("Please fix the password requirements before signing up");
      return;
    }

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
  };

  return (
    <Modal show={show} onHide={onClose} centered className="auth-menu">
      {/* Header displaying the close button and title */}
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body className="signup">
        <Form onSubmit={handleEmailSignup}>
          {/* Email input field */}
          <Form.Group controlId="signupEmail">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-2"
            />
          </Form.Group>

          {/* Password input field */}
          <Form.Group controlId="signupPassword">
            <InputGroup className="mb-2">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputGroup.Text onClick={() => setShowPassword((prev) => !prev)} style={{cursor: "pointer", background: "white"}}>
                {showPassword ? <EyeSlashFill /> : <EyeFill />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          {/* Confirm password input field */}
          <Form.Group controlId="signupConfirmPassword">
            <InputGroup className="mb-2">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <InputGroup.Text onClick={() => setShowConfirmPassword((prev) => !prev)} style={{cursor: "pointer", background: "white"}}>
                {showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          {/* Password rules display */}
          {!passwordRules.minLength(password) && <p className="rule">Password must be at least 6 characters</p>}
          {!passwordRules.lowercase(password) && <p className="rule">Password must have at least 1 lowercase letter</p>}
          {!passwordRules.uppercase(password) && <p className="rule">Password must have at least 1 uppercase letter</p>}
          {!passwordRules.number(password) && <p className="rule">Password must have at least 1 number</p>}
          {!passwordRules.specialChar(password) && <p className="rule">Password must have at least 1 special character (i.e. !, @, #, $)</p>}
          {!passwordRules.match(password, confirmPassword) && <p className="rule">Passwords must match</p>}

          {error && <p className="error">{error}</p>}
          <Button type="submit" className="submit-button w-100">Sign Up</Button>
        </Form>

        {/* Display any third party authentication methods to the user */}
        <ThirdPartyAuth onClose={onClose} setUserAuthed={setUserAuthed} setErrorMessage={setError} />
      </Modal.Body>
    </Modal>
  );
}

export default Signup;