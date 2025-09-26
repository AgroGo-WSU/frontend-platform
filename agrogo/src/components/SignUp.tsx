import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase/config";
import { Modal, Button, Form } from "react-bootstrap";
import ThirdPartyAuth from "./ThirdPartyAuth";
import "../stylesheets/Auth.css";

interface SignupProps {
  show: boolean
  onClose: () => void;
  setUserAuthed: (authed: boolean) => void
}

function Signup({ show, onClose, setUserAuthed }: SignupProps) {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(password !== confirmPassword) {
      setError("Passwords do not match");
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
  }

  return (
    <Modal show={show} onHide={onClose} centered className="auth-menu">
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body className="signup">
        <Form onSubmit={handleSignup}>
          <Form.Group controlId="signupEmail">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-2"
            />
          </Form.Group>
          <Form.Group controlId="signupPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-2"
            />
          </Form.Group>
          <Form.Group controlId="signupConfirmPassword">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-2"
            />
          </Form.Group>
            {error && <p className="error">{error}</p>}
            <Button type="submit" className="submit-button w-100">Sign Up</Button>
        </Form>
        <ThirdPartyAuth onClose={onClose} setUserAuthed={setUserAuthed} setErrorMessage={setError} />
      </Modal.Body>
    </Modal>
  );
}

export default Signup;