import '../../stylesheets/ZoneDeleteWarning.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ZoneDeleteWarning() {



    return (
        <div className="warning-container">
            Psst... all watering times must be deleted before you can remove a zone!
        </div>
    );
}

export default ZoneDeleteWarning;