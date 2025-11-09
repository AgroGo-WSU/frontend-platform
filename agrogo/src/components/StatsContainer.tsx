import '../../stylesheets/StatsContainer.css';
import Humidity from './Humidity';
import Temp from './Temp';
import axios from "axios";
import { AuthContext } from '../../hooks/UseAuth';
import { getAuth } from "firebase/auth";
import { useState, useEffect, useContext } from "react";

// dynamically render zone images using state to hold the image name suffix
// use the map function to render the zone images on screen along with the descriptions


function StatsContainer() {


    return (
        <div className="stats-container-top">
            <Temp /><Humidity />
  
        </div>
    )
}

export default StatsContainer;