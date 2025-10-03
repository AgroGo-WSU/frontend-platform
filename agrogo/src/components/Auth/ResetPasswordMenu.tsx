import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface ResetPasswordProps {
  show: boolean;
  onClose: () => void;
  onResetPassword: (creds: {
    email: string;
  }) => Promise<void>;
}

/**
 * Reset Password Component
 * 
 * A modal-based password reset form that allows users to reset their
 * password using their email address. The component kicks off a 
 * built-in Firebase Authentication API call. The API call will send
 * an email with password reset options to the email passed (if it
 * exists in our user database)
 * 
 * Props:
 * - show (boolean): Controls whether the modal is visible.
 * - onClose (function): Callback to close the modal.
 * - onLogin (function): Async function called on form submit,
 * receives an object:
 *    {
 *      email: string;
 *    }
 * 
 * Features
 * - Firebase password reset. User enters their email, and Firebase
 * sends an email with reset password options.
 * 
 * 10.3 - Created by Drew
 */
function ResetPasswordMenu({ show, onClose, onResetPassword }: ResetPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onResetPassword({ email });
      onClose();
    } catch(err: unknown) {
      if(err instanceof Error) setError(err.message);
      else setError('Login failed');
    }
  }

    return (
    <Modal show={show} onHide={onClose} centered className="auth-menu">
      {/* Header displaying the close button and title */}
      <Modal.Header closeButton className="auth-header">
        <Modal.Title>Reset Password</Modal.Title>
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
          
          {error && <p className="error">{error}</p>}
          <Button type="submit" className="submit-button w-100">Reset</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ResetPasswordMenu;