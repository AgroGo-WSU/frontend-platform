import { useState } from "react";
import { 
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase/config.ts";
import { Modal, Button, Form } from "react-bootstrap";
import ThirdPartyAuth from "./ThirdPartyAuth.tsx";
import "../stylesheets/Auth.css";

interface LoginProps {
  show: boolean;
  onClose: () => void;
  setUserAuthed: (authed: boolean) => void;
}

function Login({ show, onClose, setUserAuthed }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in as:", userCredential.user);
        setUserAuthed(true);
        onClose();
      } catch (err: unknown) {
        if(err instanceof Error) setError(err.message);
        else setError("Unknown error");
        setUserAuthed(false);
      }
    };

    return (
        <Modal show={show} onHide={onClose} centered className="auth-menu">
          <Modal.Header closeButton className="auth-header">
            <Modal.Title>Log In</Modal.Title>
          </Modal.Header>
          <Modal.Body className="auth-body">
            <hr />
            <Form onSubmit={handleEmailLogin}>
              <Form.Group controlId="loginEmail">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-2"
                />
              </Form.Group>
              <Form.Group controlId="loginPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-2"
                />
              </Form.Group>
              
              {error && <p className="error">{error}</p>}
              <Button type="submit" className="submit-button w-100">Login</Button>
            </Form>
            <ThirdPartyAuth onClose={onClose} setUserAuthed={setUserAuthed} setErrorMessage={setError} />
          </Modal.Body>
        </Modal>
    );
}

export default Login;