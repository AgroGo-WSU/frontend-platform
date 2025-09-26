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

function Signup({ show, onClose, setUserAuthed }: SignupProps) {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // === Password Validation Logic === 
  const passwordRules = {
    minLength: (pw: string) => pw.length >= 6,
    lowercase: (pw: string) => /[a-z]/.test(pw),
    uppercase: (pw: string) => /[A-Z]/.test(pw),
    number: (pw: string) => /\d/.test(pw),
    specialChar: (pw: string) => /[!@#$%^&*()]/.test(pw),
    match: (pw: string, confirm: string) => pw === confirm
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check all rules
    const rulesPassed = 
      passwordRules.minLength(password) &&
      passwordRules.lowercase(password) &&
      passwordRules.uppercase(password) &&
      passwordRules.number(password) &&
      passwordRules.specialChar(password) &&
      passwordRules.match(password, confirmPassword);
    
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
          {!passwordRules.minLength(password) && <p className="rule">Password must be at least 6 characters</p>}
          {!passwordRules.lowercase(password) && <p className="rule">Password must have at least 1 lowercase letter</p>}
          {!passwordRules.uppercase(password) && <p className="rule">Password must have at least 1 uppercase letter</p>}
          {!passwordRules.number(password) && <p className="rule">Password must have at least 1 number</p>}
          {!passwordRules.specialChar(password) && <p className="rule">Password must have at least 1 special character (i.e. !, @, #, $)</p>}
          {!passwordRules.match(password, confirmPassword) && <p className="rule">Passwords must match</p>}
          {error && <p className="error">{error}</p>}
          <Button type="submit" className="submit-button w-100">Sign Up</Button>
        </Form>
        <ThirdPartyAuth onClose={onClose} setUserAuthed={setUserAuthed} setErrorMessage={setError} />
      </Modal.Body>
    </Modal>
  );
}

export default Signup;