import "../../../src/stylesheets/InventoryPopUp.css"
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Inventory from "./Inventory";
import TopNav from "../TopNav";


function InventoryPopUp() {
    // state for whether the popup is shown or not, and make it fullscreen
    const [show, setShow] = useState(false);
    const [fullscreen, setFullscreen] = useState(true);

    function handleShow() {
        setFullscreen(true);
        setShow(true);
  }

    return(
        <>
        
        <div onClick={() => handleShow()}>
          Inventory
        </div>
        <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
            <Modal.Header closeButton className="secret-sauce">
            <TopNav />
            <Modal.Title>Plant inventory</Modal.Title>
            </Modal.Header>
            <Modal.Body><Inventory /></Modal.Body>
        </Modal>
        </>
    )
}

export default InventoryPopUp;