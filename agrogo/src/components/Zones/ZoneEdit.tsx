import '../../stylesheets/ZoneEdit.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ZoneDeleteWarning from './ZoneDeleteWarning'
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

  // state variables for holding the water scedule response and the zone description data response
  const [waterSchedData, setWaterSchedData] = useState(null);
  const [zoneData, setZoneData] = useState(null);

  // sorted water schedule data by zone
  const [waterSchedZone1, setWaterSchedZone1] = useState();
  const [waterSchedZone2, setWaterSchedZone2] = useState();
  const [waterSchedZone3, setWaterSchedZone3] = useState();

  // sorted zone description data by zone
  const [zone1Description, setZone1Description] = useState();
  const [zone2Description, setZone2Description] = useState();
  const [zone3Description, setZone3Description] = useState();

  // signaling whether the user has updated or added a watering time to let the effect functions know to re-render
  const [sendingWaterSchedule, setSendingWaterSchedule] = useState(false);
  const [sendingZoneData, setSendingZoneData] = useState(false);

  // state variables for user input
  // for updating the descriptions for each zone - when true, user is editing a field, so they should all be defaulted to false until the user clicks the "update" buttons
  const [updatedDescription1, setUpdatedDescription1] = useState(false);
  const [updatedWaterInput, setUpdatedWaterInput] = useState(null);

  // this state will hold the user input for the new zone description, and be passed in the put request; it is updated in the change handler function below
  const [newZoneDescription1, setNewZoneDescription1] = useState(null);
  const [newZoneDescription2, setNewZoneDescription2] = useState(null);
  const [newZoneDescription3, setNewZoneDescription3] = useState(null);

  // this will keep track of which watering time is being edited
  const [entryBeingEdited, setEntryBeingEdited] = useState("0");

  // this will keep track of which zone error is being thrown for deleting a zone
  const [zone1DeleteError, setZone1DeleteError] = useState(false);
  const [acceptZone1Error, setAcceptZone1Error] = useState(false);

  // these variables keep track of whether new watering times are being entered in each zone
  const [addingWater1, setAddingWater1] = useState(false);

  // these variables keep track of whether a new zone is being added
  const [addingZone1, setAddingZone1] = useState(false);

  // here are our zone types for tracking button input
  const [zoneType1, setZoneType1] = useState("Zone type");
  const [zoneType2, setZoneType2] = useState("Zone type");
  const [zoneType3, setZoneType3] = useState("Zone type");



  // this function will retrive all of the available water schedule times from the database for this user
  useEffect(() => {
      const getWateringTimes = async () => {

      // using the React context to get the Firebase information about the user
      try {
        const auth = getAuth();
        const user = auth.currentUser;

      if (!user) {
          throw new Error('User not authenticated!');
        }

        const token = await user.getIdToken();
      
        // make the call to the database
        const response = await axios.get("https://backend.agrogodev.workers.dev/api/user/waterSchedule", {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });

          // set the state to hold the data retrieved from the database
          setWaterSchedData(response.data.data); // this sets the state - response is of type <AxiosResponse> and calling response.data gives us the actual array of arrays that make up the individual instances of our db table
          } catch(error){
            console.error('Error fetching water schedule data:', error);
          } finally {
            console.log("Data for water schedule: ", waterSchedData);
      }
    };

    // call the getWateringTimes function inside the useEffect function, and then set the setSendingWaterSchedule back to false
    getWateringTimes();
    setSendingWaterSchedule(false);

    },[sendingWaterSchedule]); // this useEffect function will run any time the sendingWaterSchedule state is updated, which will happen when a user enters or updates a water time

    // in the response, you will get everything in the database, UNSORTED, so here we will sort it
    // you need x number of arrays of times, one for each zone 
    const zone1Data = [];
    const zone2Data = [];
    const zone3Data = [];

    if(waterSchedData != null) {
      for(let i = 0; i < waterSchedData.length; i++ ) {
        if(waterSchedData[i].type === "1") {
          zone1Data.push(waterSchedData[i]);
        } else if(waterSchedData[i].type === "2") {
          zone2Data.push(waterSchedData[i]);
        } else if (waterSchedData[i].type ==="3") {
          zone3Data.push(waterSchedData[i]);
        }
      }
    }

    // set zone data into state so it can be accessed above
    useEffect(() => {
    const setZoneArrays = async() => {
      setWaterSchedZone1(zone1Data);
      setWaterSchedZone2(zone2Data);
      setWaterSchedZone3(zone3Data);
    }
      setZoneArrays();
    }, [sendingZoneData]);


    // get user zone data
    useEffect(() => {
      const getZoneData = async () => {

        // try to get the Firebase user info
        try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated!');
        }

        const token = await user.getIdToken();
      
        const response = await axios.get("https://backend.agrogodev.workers.dev/api/user/zone", {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });

          console.log("Setting zone data: ", response.data.data);
          setZoneData(response.data.data);
          } catch(error){
            console.error('Error fetching zone data:', error);
          } finally {
            console.log("Zone data acquired");
      }

      setSendingZoneData(false);

    };

    getZoneData();

    },[sendingZoneData]);

    // in the response, you will get all 3 zones in the database, UNSORTED, so here we will sort it
    // you need x number of arrays of times, one for each zone 
    const zone1Info = [];
    const zone2Info = [];
    const zone3Info = [];

    if(zoneData != null) {
      for(let i = 0; i < zoneData.length; i++ ) {
        if(zoneData[i].zoneNumber === "1") {
          zone1Info.push(zoneData[i]);
        } else if(zoneData[i].zoneNumber === "2") {
          zone2Info.push(zoneData[i]);
        } else if (zoneData[i].zoneNumber ==="3") {
          zone3Info.push(zoneData[i]);
        }
      }
    }

    // send the put request to update the zone description
    const updateZoneDescription = async (event) => {

      const zoneArrayID = event.target.id;

      let whichZoneData;
      let zoneTypeFinal;
      let newZoneDescription;

      // figure out which zone we are looking at and assign the correct variables
      if(zoneArrayID === "1") {
        whichZoneData = zone1Info;
        zoneTypeFinal = zoneType1;
        newZoneDescription = newZoneDescription1;
      } else if(zoneArrayID === "2") {
        whichZoneData = zone2Info;
        zoneTypeFinal = zoneType2;
        newZoneDescription = newZoneDescription2;
      } else if(zoneArrayID === "3") {
        whichZoneData = zone3Info;
        zoneTypeFinal = zoneType3;
        newZoneDescription = newZoneDescription3;
      }

      try {
        const auth = getAuth();
        const user = auth.currentUser;


      if (!user) {
        throw new Error('User not authenticated!');
      }

      const userIdFB = user.uid;
      const token = await user.getIdToken();

      const putData = {
        createdAt: moment().format("MM/DD/yyyy"),
        description: newZoneDescription,
        id: whichZoneData[0].id,
        userId: userIdFB,
        zoneName: zoneTypeFinal,
        zoneNumber: whichZoneData[0].zoneNumber,
      }

      const sentResponse = await axios.put("https://backend.agrogodev.workers.dev/api/data/zone", putData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          }
        });
        
        setSendingZoneData(true);
        console.log("Sending PUT request for updated zone's description ", sentResponse);
        } catch(error){
            console.error('Error sending data:', error);
        } finally {
            console.log("End of zone PUT request!");
      }

      cancelUpdate();
    } 

    // this function updates or adds a new water time to a zone, or deletes an existing entry based on the CLASSNAME
    const saveChanges = async(event) => {

      console.log("Water schedule event.target.className:  ", event.target.className);
      const eventTYPE = event.target.className;

      // bothIDs gives us the split array of zone# and index from the ids of our mapped water data
      // zoneArrayID gives us the zone number
      // zoneArrayIndex gives us which index in zone1Data, zone2Data, or zone3Data we need
      const bothIDs = event.target.id.split("_");
      const zoneArrayID = bothIDs[0];
      const zoneArrayIndex = Number(bothIDs[1]);

      // we'll copy whichever zoneXData array we need to findData
      let findData = [];

      // assign the correct zone array to findData:
      if(zoneArrayID === "1") {
        findData = waterSchedZone1;
      } else if(zoneArrayID === "2") {
        findData = waterSchedZone2;
      } else if(zoneArrayID === "3") {
        findData = waterSchedZone3;
      }

      // try to get the user token and make the post request
        try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated!');
        }

        const userIdFB = user.uid;
        const token = await user.getIdToken();
      
        // this is the if/else that determines whether you are posting/putting/deleting, based on the classname of the button clicked
        if (eventTYPE === "save-entry") {
          // package the data to be POSTED as a NEW entry
          const postData = {
            id: Math.round(Math.random()*100),
            type: zoneArrayID,
            userId: userIdFB,
            time: updatedWaterInput,
            duration: "30",
            zoneType: zoneArrayID
          }

          // POST request
          const sentResponse = await axios.post("https://backend.agrogodev.workers.dev/api/data/waterSchedule", postData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });
          
        // else statement for PUT requests
        } else if(eventTYPE === "update-entry") {
          // package the data for a PUT request - so go back into the findData array and grab the existing info (since we're only updating the time, and everything else should be the same)
          const putData = {
            id: findData[zoneArrayIndex] ? findData[zoneArrayIndex].id : null,
            type: findData[zoneArrayIndex].type,
            userId: findData[zoneArrayIndex].userId,
            time: updatedWaterInput,
            duration: findData[zoneArrayIndex].duration,
            zoneType: findData[zoneArrayIndex].zoneType,
          }
        
          // PUT request
          const sentResponse = await axios.put("https://backend.agrogodev.workers.dev/api/data/waterSchedule", putData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              }
          });
        
        // else statement for DELETE requests - no need to package data for the DELETE request, just need to send the ID in the data portion of the request 
        } else if(eventTYPE === "delete-entry") {

          // DELETE request
          const sentResponse = await axios.delete("https://backend.agrogodev.workers.dev/api/data/waterSchedule", {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
              data: {
                id: findData[zoneArrayIndex].id
              }
            });
          
          } 

          } catch(error){
            console.error('Error sending data:', error);
          } finally {
            // force the GET request above to re-render and grab the newly updated data for the water schedule
            setSendingWaterSchedule(true);
            console.log("We made it to the end of the saveChanges function!");
      }

      // reset all state
      cancelUpdate();

    }

  const saveNewZone = async(event) => {
  
        const bothIDs = event.target.id.split("_");
        const zoneArrayID = bothIDs[0];

        let zoneTypeFinal;

        if(zoneArrayID === "1") {
          zoneTypeFinal = zoneType1;
        } else if(zoneArrayID === "2") {
          zoneTypeFinal = zoneType2;
        } else if(zoneArrayID === "3") {
          zoneTypeFinal = zoneType3;
        }

        try {
          const auth = getAuth();
          const user = auth.currentUser;

          if (!user) {
            throw new Error('User not authenticated!');
          }

          const userIdFB = user.uid;
          const token = await user.getIdToken();
      
          const postData = {
            createdAt: moment().format("MM/DD/yyyy"),
            description: newZoneDescription,
            id: Math.round(Math.random()*100),
            userId: userIdFB,
            zoneName: zoneTypeFinal,
            zoneNumber: zoneArrayID,
          }

          const sentResponse = await axios.post("https://backend.agrogodev.workers.dev/api/data/zone", postData, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  }
              });
            
            console.log("Sending POST request for watering schedule new data - here's the response ", sentResponse);
            } catch(error){
            console.error('Error sending data:', error);
          } finally {
            // force the GET request above to re-render and grab the newly updated data for the water schedule
            setSendingZoneData(true);
            console.log("Made it to the end of the saveNewEntry function!");
      }

      cancelUpdate();

  }

  // function to delete new zones once all watering times have been removed
  const deleteZone = async(event) => {
  
        const bothIDs = event.target.id.split("_");
        const zoneArrayID = bothIDs[0];

        let zoneFinal = [];

        if(zoneArrayID === "1") {
          zoneFinal = zone1Info;
        } else if(zoneArrayID === "2") {
          zoneFinal = zone2Info;
        } else if(zoneArrayID === "3") {
          zoneFinal = zone3Info;
        }

        console.log("------------>--------------->------->------>----->", zoneFinal);

        try {
          const auth = getAuth();
          const user = auth.currentUser;

          if (!user) {
            throw new Error('User not authenticated!');
          }

          //const userIdFB = user.uid;
          const token = await user.getIdToken();

          let id = "0";
          id = (zoneFinal[0] != null) ? zoneFinal[0] : null;
      

          const sentResponse = await axios.delete("https://backend.agrogodev.workers.dev/api/data/zone", {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  },
              data: {
                id: id
              }
              });
            
            console.log("Sending POST request for watering schedule new data - here's the response ", sentResponse);
            } catch(error){
            console.error('Error sending data:', error);
          } finally {
            // force the GET request above to re-render and grab the newly updated data for the zones
            setSendingZoneData(true);
            console.log("Made it to the end of the deleteNewEntry function!");
      }

      cancelUpdate();

  }



  // here is the list of functions that are used mostly for user input, button events, and managing state outside of the database call functions
  function cancelUpdate() {
    setUpdatedDescription1(false);
    setNewZoneDescription1(null);
    setNewZoneDescription2(null);
    setNewZoneDescription3(null);
    setUpdatedWaterInput(null);
    setEntryBeingEdited("0");
    setAddingWater1(false);
    setAddingZone1(false);
    setZoneType1("Zone type");
    setZoneType2("Zone type");
    setZoneType3("Zone type");
    setZone1DeleteError(false);
    setAcceptZone1Error(false);
    setSendingZoneData(false);
  }
  
  // functions for updating state-based rendering only
  function updatingDescription1() {
    setUpdatedDescription1(true);
    setZoneType1(zone1Info[0].zoneName);
    setNewZoneDescription1(zone1Info[0].description);
  }

  function addNewWater1() {
    setAddingWater1(true);
  }

  function addZone1() {
    setAddingZone1(true);
  }

  function zone1ErrorOrDelete(event) {
    if(zone1Data.length === 0) {
      deleteZone(event);
    } else {
      setZone1DeleteError(true);
      setAcceptZone1Error(true);
    }
  }

  function zoneErrorPopUpAccept() {
    setZone1DeleteError(false);
    setAcceptZone1Error(false);
  }

  // function to update which entry is being edited
  function updateWateringTime(event) {
    console.log("Updating a watering time for zone ", event.target.id);
    setEntryBeingEdited(event.target.id);
  }

  // these are "handleChange" functions for displaying what the user is typing in the input fields
  function handleNewZoneDescriptionChange(event) {
    setNewZoneDescription1(event.target.value);
  }

  function handleChangeWaterTime(event) {
    setUpdatedWaterInput(event.target.value);
    console.log("Updating water time!");
  }

  // these are functions for handling zone type button inputs
    function chooseZoneType1(event) {
    setZoneType1(event.target.firstChild.data);
  }



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
          <div className="zone-info">
              <div className="zone-or-not">{zone1Info.length === 0 ? (addingZone1 === false ? <button onClick={addZone1} className="add-a-zone">Add zone 1</button> : 
                <div className="adding-zone-info">
                  <div className="add-new-description">
                      <label htmlFor="zone_description">Enter new zone description: </label>
                      <input type="text" name="update_zone_description" id={"1_+"} value={newZoneDescription1} onChange={handleNewZoneDescriptionChange}></input>                   
                  </div>
                  <div className="drop-down-zone-choice">
                      <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">{zoneType1}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item><button className="vegetable-button" id={"1_+"} onClick={chooseZoneType1}>Vegetables</button></Dropdown.Item>
                          <Dropdown.Item><button className="flower-button" id={"1_+"} onClick={chooseZoneType1}>Flowers</button></Dropdown.Item>
                          <Dropdown.Item><button className="general-button" id={"1_+"} onClick={chooseZoneType1}>Mixed/other</button></Dropdown.Item>
                      </Dropdown.Menu>
                      </Dropdown>
                  </div>
                  <div className="new-zone-buttons">
                    <button id={"1_-"} className="save-entry" onClick={saveNewZone}>Save zone</button>
                    <button id={"1_-"} className="cancel-changes" onClick={cancelUpdate}>Cancel</button>                    
                  </div>
                </div>) :
              <>
              <div className="zone-heading">{"Zone 1 - " + zone1Info[0].zoneName}</div>
              <div className="zone-description">
                {/** this is a nested ternary operation to display 1) either the custom description or the default, and 2) either the description or the user input  */}
                {/** the next line checks that we got the data fom the database and sorted it, and whether the user is updating the description - if they're NOT updating, render the display divs; if they ARE updating, skip to show the input field and cancel/save buttons */}
                {zone1Info != null && updatedDescription1 === false ? 
                  (zone1Info[0] ? <div className="show-description"><>{zone1Info[0].description}</><button onClick={updatingDescription1}>Update description</button></div> : <div className="show-description"><>Add a description</><button>Update description</button></div>) : 
                  <div className="editing-description">
                    <div className = "update-description-field">
                      <label htmlFor="zone_description">Enter new zone description: </label>
                      <input type="text" name="update_zone_description" id={"1_+"} value={newZoneDescription1} onChange={handleNewZoneDescriptionChange}></input>
                    </div>
                    <div className="drop-down-zone-choice">
                        <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">{zoneType1}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item><button className="vegetable-button" id={"1_+"} onClick={chooseZoneType1}>Vegetables</button></Dropdown.Item>
                            <Dropdown.Item><button className="flower-button" id={"1_+"} onClick={chooseZoneType1}>Flowers</button></Dropdown.Item>
                            <Dropdown.Item><button className="general-button" id={"1_+"} onClick={chooseZoneType1}>Mixed/other</button></Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="zone-editing-buttons">
                    <button onClick={cancelUpdate}>Cancel</button><button id="1" onClick={updateZoneDescription}>Save</button>
                    {acceptZone1Error === false ? <button onClick={zone1ErrorOrDelete}>Delete zone</button> : <button onClick={zoneErrorPopUpAccept}>Ok I'll delete them</button>}{zone1DeleteError === true ? <ZoneDeleteWarning/> : <></>}
                    </div>
                  </div>
                }
              </div>
              <div className="zone-watering-times">
                {/** this is mapping all of the data in our sorted zone array so that we can render each one on the page dynamically */}
                {/** what this says is: map each item in our zone array, listing each entry and assigning an index to each one */}
                {/** if the ID doesn't match entryBeingEdited, just display the data from the array, with the button to update it */}
                { /** if the ID DOES match entryBeingEdited, instead of displaying the data, display the input fields with buttons to delete, cancel changes, and save it */}
                {zone1Data.map((item, index: number) => (  
                  entryBeingEdited != "1_"+index ? 
                    <div className="display-water-data">
                      {item.time}<button id={"1_" + index} onClick={updateWateringTime}>Update watering time</button>
                    </div> : 
                    <div className="update-water-input">
                      <div className="water-schedule-input-field">
                        <label htmlFor="update_watering_time">Set watering time</label>
                        <input type="text" name="edit_change" id={"1_"+index} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
                      </div>
                      <div className="update-water-buttons">
                        <button id={"1_" + index} className="update-entry" onClick={saveChanges}>Update entry</button>
                        <button id={"1_" + index} className="delete-entry" onClick={saveChanges}>Delete entry</button>
                        <button id={"1_"+index} className="cancel-changes" onClick={cancelUpdate}>Cancel</button>
                      </div>
                    </div>
                    ))}
              </div>
              {/** this is for adding new watering times - if the user isn't currently adding a time, show the button; if they ARE, show the input field and cancel/save buttons, but no "add water" button */}
              <div className="add-water-time">
                  {addingWater1 === false ? <button id={"1_+"} className="add-new-water" onClick={addNewWater1}>Add water time</button> : 
                    <>
                    <div className="add-water-info">
                      <label htmlFor="zone_water_time">Set watering time</label>
                      <input type="text" name="zone_water_time" id={"1_+"} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
                    </div>
                    <div className="add-water-buttons">
                      <button id="1_+" className="save-entry" onClick={saveChanges}>Save entry</button>
                      <button id="1_+" className="cancel-changes" onClick={cancelUpdate}>Cancel</button>
                    </div>
                    </>
                  }
              </div></>} {/** end of zone 1 */}
            </div>
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