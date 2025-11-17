import '../../stylesheets/ZoneEdit.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import axios from "axios";
import { AuthContext } from '../../hooks/UseAuth';
import { getAuth } from "firebase/auth";
import { useState, useEffect, useContext } from "react";
import moment from 'moment-timezone';

// get all zone data, then get all waterSchedule data
// create the arrays to get the waterSchedule data
// build in checks to make sure the zones are there
// biggest issue with previous code: finding which zone is "zone 1" when they come in with a random order

// what do we want the buttons to do:
// if there is zone data, display it; if not, display the "add zone" button
// ---> update description -> save, delete, cancel
// ---> save new zone, cancel
// for each zone, display an "add watering time" and each watering time
// ---> update time -> save, delete, cancel


function ZoneEdit(props) {

  return(
        <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Manage your zones
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

      
    <div className="zone-edit-container">
      <div className="zone-edits">
        <div className="zone-1-container">
          <div className="">

          </div>
        </div>
      </div>
    </div>
    </Modal.Body>
    <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ZoneEdit;