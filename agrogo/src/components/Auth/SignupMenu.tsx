import { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

interface SignupProps {
  show: boolean;
  onClose: () => void;
  onSignup: (creds: {
    email: string;
    password: string;
  }) => Promise<void>;
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
 * - onSignup (function): Async function called on form submit,
 * receives an object:
 *    {
 *      email: string;
 *      password: string;
 *      firstName: string;
 *      lastName: string;
 *    }
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
 *
 * 9.26 - Created by Drew
 * 10.3 - Ported over to new-user-auth branch by Drew
 */
function SignupMenu({ show, onClose, onSignup }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSignup = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!passwordRules.minLength(password) ||
        !passwordRules.lowercase(password) ||
        !passwordRules.uppercase(password) ||
        !passwordRules.number(password) ||
        !passwordRules.specialChar(password) ||
        !passwordRules.match(password, confirmPassword)) {
          setError('Password does not meet requirements');
          return;
        }

    try {
      await onSignup({ email, password });
      onClose(); // Close modal on success
    } catch(err: unknown) {
      if(err instanceof Error) setError(err.message);
      else setEmail('Login failed');
    }
  }



  return (
    <Modal show={show} onHide={onClose} centered className="auth-menu">
      {/* Header displaying the close button and title */}
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body className="signup">
        <Form onSubmit={handleSignup}>
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
      </Modal.Body>
    </Modal>
  );
}

export default SignupMenu;