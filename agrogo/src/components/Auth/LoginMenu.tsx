import { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

interface LoginProps {
  show: boolean;
  onClose: () => void;
  //setUserAuthed: (authed: boolean) => void;
  onLogin: (creds: {
    email: string;
    password: string;
  }) => Promise<void>;
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
 * - onLogin (function): Async function called on form submit, receives an object:
 *    {
 *      email: string;
 *      password: string;
 *      firstName: string;
 *      lastName: string;
 *    }
 *
 * Features:
 * - Firebase email/password authentication via onLogin `function`.
 * - Password visibility toggle with an eye icon.
 * - Displays validation or Firebase error messages.
 * 
 * 9.26 - Created by Drew in firebase-auth branch
 * 10.3 - Ported over to new-user-auth branch by Drew
 */
function LoginMenu({ show, onClose, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onLogin({ email, password });
      onClose(); // Close modal on success
    } catch(err: any) {
      setError(err?.message ?? 'Login failed');
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered className="auth-menu">
      {/* Header displaying the close button and title */}
      <Modal.Header closeButton className="auth-header">
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body className="auth-body">
        <Form onSubmit={handleSubmit}>
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
      </Modal.Body>
    </Modal>
  );
}

export default LoginMenu;