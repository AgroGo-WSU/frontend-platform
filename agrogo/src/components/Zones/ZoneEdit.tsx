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

class WaterSchedule {
  public id: string;
  public type: string;
  public userId: string;
  public time: string;
  public duration: string;
  public zoneType: string;

  public constructor(WaterInstance: {id: string, type: string, userId: string, time: string, duration: string, zoneType: string}) {
    this.id = WaterInstance.id;
    this.type = WaterInstance.type;
    this.userId = WaterInstance.userId;
    this.time = WaterInstance.time;
    this.duration = WaterInstance.duration;
    this.zoneType = WaterInstance.zoneType;
  }
}

function ZoneEdit(props) {

  const [entryBeingEdited, setEntryBeingEdited] = useState("0");
  const [data, setData] = useState(null);
  const [sendingWaterSchedule, setSendingWaterSchedule] = useState(false);
  const [updatedWaterInput, setUpdatedWaterInput] = useState(null);
  const [newEntry1, setNewEntry1] = useState(false);
  const [newEntry2, setNewEntry2] = useState(false);
  const [newEntry3, setNewEntry3] = useState(false);
  const [zoneType1, setZoneType1] = useState("Zone type");
  const [zoneType2, setZoneType2] = useState("Zone type");
  const [zoneType3, setZoneType3] = useState("Zone type");
  const [waterSchedZone1, setWaterSchedZone1] = useState();
  const [waterSchedZone2, setWaterSchedZone2] = useState();
  const [waterSchedZone3, setWaterSchedZone3] = useState();
  const [numberOfZones, setNumberOfZones] = useState(0);
  const [zoneData, setZoneData] = useState([]);
  const [newZoneDescription, setNewZoneDescription] = useState(null);
  const [addWater1, setAddWater1] = useState(false);
  const [addWater2, setAddWater2] = useState(false);
  const [addWater3, setAddWater3] = useState(false);
  const [updateZoneDescription1, setUpdateZoneDescription1] = useState(false);
  const [updateZoneDescription2, setUpdateZoneDescription2] = useState(false);
  const [updateZoneDescription3, setUpdateZoneDescription3] = useState(false);

  // console.log("Example of the props thing - this is the id: ", props.data[0].id);

useEffect(() => {
      const getWateringTimes = async () => {

        try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated!');
        }

        const token = await user.getIdToken();
      
        const response = await axios.get("https://backend.agrogodev.workers.dev/api/user/waterSchedule", {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });

          console.log("Setting water schedule data: ", response.data.data);
          setData(response.data.data); // this sets the state - response is of type <AxiosResponse> and calling response.data gives us the actual array of arrays that make up the individual instances of our db table
          } catch(error){
            console.error('Error fetching water schedule data:', error);
          } finally {
            console.log("Data for water schedule: ", data);
      }
    };

    getWateringTimes();
    setSendingWaterSchedule(false);

    },[sendingWaterSchedule]);



    // also clears the previous state
    const saveChanges = async(event) => {

      console.log("Water schedule event target firstchild ", event.target.firstChild.data);
      const eventTYPE = event.target.firstChild.data;

        const bothIDs = event.target.id.split("_");
        const zoneArrayID = bothIDs[0];
        const zoneArrayIndex = Number(bothIDs[1]);

        let findData = [];

        // console.log("Water", waterSchedZone1);

        // find which array of data to take form:
        if(zoneArrayID === "1") {
          findData = waterSchedZone1;
        } else if(zoneArrayID === "2") {
          findData = waterSchedZone2;
        } else if(zoneArrayID === "3") {
          findData = waterSchedZone3;
        }

        console.log("******************************************************************", zoneArrayIndex, findData[zoneArrayIndex]);
        // const persistentItemID = findData[zoneArrayIndex].id;
      
        

      // try to get the user token and make the post request
        try {
        const auth = getAuth();
        const user = auth.currentUser;


        if (!user) {
          throw new Error('User not authenticated!');
        }

        const userIdFB = user.uid;
        const token = await user.getIdToken();
      
        if (eventTYPE === "Save entry") {

        console.log("----->>>>>>>---------------------------->>>>>>>>>> ", zoneArrayID);
        const postData = {
          id: Math.round(Math.random()*100),
          type: zoneArrayID,
          userId: userIdFB,
          time: updatedWaterInput,
          duration: "30",
          zoneType: zoneType1
        }

        // console.log("----------------->>>>>>>: ", postData.duration);

        const sentResponse = await axios.post("https://backend.agrogodev.workers.dev/api/data/waterSchedule", postData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });
          
          setSendingWaterSchedule(true);
          console.log("Sending POST request for watering schedule new data - here's the response ", sentResponse);

          } else if(eventTYPE === "Update entry") {

        const putData = {
          id: findData[zoneArrayIndex].id,
          type: findData[zoneArrayIndex].type,
          userId: findData[zoneArrayIndex].userId,
          time: updatedWaterInput,
          duration: findData[zoneArrayIndex].duration,
          zoneType: findData[zoneArrayIndex].zoneType,
        }
        
        const sentResponse = await axios.put("https://backend.agrogodev.workers.dev/api/data/waterSchedule", putData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });
          
          setSendingWaterSchedule(true);
          console.log("Sending PUT request for watering schedule new data - here's the response ", sentResponse);    

          } else if(eventTYPE === "Delete entry") {

            console.log("!!! MAKING DELETE REQUEST: ", findData[zoneArrayIndex].id);
        const sentResponse = await axios.delete("https://backend.agrogodev.workers.dev/api/data/waterSchedule", {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
              data: {
                id: findData[zoneArrayIndex].id
              }
            });
          
          setSendingWaterSchedule(true);
          console.log("Sending DELETE request for new data - here's the response ", sentResponse);           
          } 

          } catch(error){
            console.error('Error sending data:', error);
          } finally {
            console.log("Looks like the water schedule DELETE request worked!");
      }

      setUpdatedWaterInput(null);
      setAddWater1(false);
      setAddWater2(false);
      setAddWater3(false);
      setEntryBeingEdited("0");
      setNewEntry1(false);
      setNewEntry2(false);
      setNewEntry3(false);
    }

    // get user zone data
    useEffect(() => {
      const getZoneData = async () => {

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
            console.log("Final data for zone: ", zoneData);
      }
    };

    getZoneData();

    },[sendingWaterSchedule, updateZoneDescription1, updateZoneDescription2, updateZoneDescription3]);

    
  const saveNewEntry = async(event) => {
  
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
            zoneName: zoneArrayID,
            zoneNumber: zoneArrayID,
          }

          const sentResponse = await axios.post("https://backend.agrogodev.workers.dev/api/data/zone", postData, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  }
              });
            
            setSendingWaterSchedule(true);
            console.log("Sending POST request for watering schedule new data - here's the response ", sentResponse);
            } catch(error){
            console.error('Error sending data:', error);
          } finally {
            console.log("Looks like the water schedule save new zone request worked!");
      }

      setUpdatedWaterInput(null);
      setNewZoneDescription(null);
      saveChanges(event);
      setSendingWaterSchedule(false);
      setEntryBeingEdited("0");

  }

    const saveNewDescription = async(event) => {
  
        const bothIDs = event.target.id.split("_");
        const zoneArrayID = bothIDs[0];

        try {
          const auth = getAuth();
          const user = auth.currentUser;

          if (!user) {
            throw new Error('User not authenticated!');
          }

          const userIdFB = user.uid;
          const token = await user.getIdToken();

          console.log("-------->>>>>>>>---->>>>>>--->>>>>-->>>>-->>>->", zoneArrayID);
      
          const putData = {
            createdAt: zoneData[zoneArrayID-1].createdAt,
            description: newZoneDescription,
            id: zoneData[zoneArrayID-1].id,
            userId: userIdFB,
            zoneName: zoneData[zoneArrayID-1].zoneName,
            zoneData: [zoneArrayID-1].zoneData,
          }

          const sentResponse = await axios.put("https://backend.agrogodev.workers.dev/api/data/zone", putData, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                  }
              });
            
            setSendingWaterSchedule(true);
            console.log("Sending POST request for watering schedule new data - here's the response ", sentResponse);
            } catch(error){
            console.error('Error sending data:', error);
          } finally {
            console.log("Looks like the water schedule save new zone request worked!");
      }

      setUpdatedWaterInput(null);
      setNewZoneDescription(null);
      saveChanges(event);
      setSendingWaterSchedule(false);
      setEntryBeingEdited("0");
      setNewZoneDescription(null);
      setUpdateZoneDescription1(false);
      setUpdateZoneDescription2(false);
      setUpdateZoneDescription3(false);
  }



  function addZone1() {
    setNewEntry1(true);
    setNumberOfZones(numberOfZones+1);
    console.log(numberOfZones);
  }

  function addZone2() {
    setNewEntry2(true);
    setNumberOfZones(numberOfZones+1);
    console.log(numberOfZones);
  }

    function addZone3() {
    setNewEntry3(true);
    setNumberOfZones(numberOfZones+1);
    console.log(numberOfZones);
  }

  function addNewWater1(event) {
    setAddWater1(true);
  }

  function addNewWater2(event) {
    setAddWater2(true);
  }

  function addNewWater3(event) {
    setAddWater3(true);
  }

  function removeZone() {
    setNumberOfZones(numberOfZones-1);
    console.log(numberOfZones);
  }

  function updateWateringTime(event) {
    console.log("Updating a watering time for zone ", event.target.id);
    setEntryBeingEdited(event.target.id);
  }

  function handleChangeWaterTime(event) {
    setUpdatedWaterInput(event.target.value);
    console.log("Changing water time!");
  }

  function handleNewZoneDescriptionChange(event) {
    setNewZoneDescription(event.target.value);
  }

  function updateDescription1(event) {
    setUpdateZoneDescription1(true);
  }

  function updateDescription2(event) {
    setUpdateZoneDescription2(true);
  }

  function updateDescription3(event) {
    setUpdateZoneDescription3(true);
  }

  function cancelChanges() {
    setEntryBeingEdited("0");
    setAddWater1(false);
    setAddWater2(false);
    setAddWater2(false);
    setUpdatedWaterInput(null);
    setNewZoneDescription(null);
    setNewEntry1(false);
    setNewEntry2(false);
    setNewEntry3(false);
    setUpdateZoneDescription1(false);
    setUpdateZoneDescription2(false);
    setUpdateZoneDescription3(false);
    setZoneType1("Zone type");
    setZoneType2("Zone type");
    setZoneType3("Zone type");
  }

  function chooseZoneType1(event) {
    setZoneType1(event.target.firstChild.data);
  }

  function chooseZoneType2(event) {
    setZoneType2(event.target.firstChild.data);
  }

  function chooseZoneType3(event) {
    setZoneType3(event.target.firstChild.data);
  }


    // in the response, you will get everything in the database - you need x number of arrays of times, one fore each zone 
    const zone1Data = [];
    const zone2Data = [];
    const zone3Data = [];
    var whichZones = [];

    if(data != null) {
      for(let i = 0; i < data.length; i++ ) {
        if(data[i].type === "1") {
          zone1Data.push(data[i]);
          whichZones = [1];
        } else if(data[i].type === "2") {
          zone2Data.push(data[i]);
          whichZones = [1, 2];
        } else if (data[i].type ==="3") {
          zone3Data.push(data[i]);
          whichZones = [1, 2, 3];
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
    }, [entryBeingEdited])


  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Manage your zones
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/** Have the user set times and make the post request run every time they click send
         * This means, make the get request from the water schedule, set the waterSchedule data, if it's there, map it
         */}
        <div className="all-zone-one">
        <div className="add-zone-button">{zone1Data.length === 0 && newEntry1 === false ? <button onClick={addZone1} className="add-a-zone">Add zone 1</button> : <></>}</div>
        <div className="add-new-zone">{newEntry1 === true ? 
          <div className="new-zone-entry">
            <label htmlFor="zone_description">Enter new zone description</label>
            <input type="text" name="new_entry" id={"1_+"} value={newZoneDescription} onChange={handleNewZoneDescriptionChange}></input>
            <label htmlFor="zone_first_watering">Set first watering time</label>
            <input type="text" name="zone_first_watering" id={"new"} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
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
            <button id="1_+" className="save-changes" onClick={saveNewEntry}>Save entry</button>
            <button id="1_+" className="save-changes" onClick={cancelChanges}>Cancel</button>
          </div> :
          <></>}
        </div>
        <div>{zone1Data.length > 0 ?
            <div className="zones">
                <div className="zone-title" id="1">Zone 1</div>
                { zoneData != null && updateZoneDescription1 === true ? 
                  <div className="updating-new-description" ><label htmlFor="zone_description">Zone description</label>
                  <input type="text" name="new_entry" id={"1_+"} value={newZoneDescription} onChange={handleNewZoneDescriptionChange}></input>
                    <button id={"1_+"} className="save-changes" onClick={saveNewDescription}>Update description</button>
                    <button id={"1_+"} className="save-changes" onClick={cancelChanges}>Cancel</button>           
                  </div> :            
                  <div className="display-new-description">{zoneData != null ? <div className="update-description">{zoneData[0] != null ? zoneData[0].description : " "}<button onClick={updateDescription1}>Update description</button></div> : 
                  <></>}</div>
                }
                <div id="1">
                  <div className="watering-data">
                    {zone1Data.map((item, index: number) => (  
                      entryBeingEdited != "1_"+index ? 
                      <div className="display-water-data">
                        {item.time}<button id={"1_" + index} onClick={updateWateringTime}>Update watering time</button>
                      </div>
                       : 
                      <div className="current-water-schedule">
                        <div id={"1_" + index}>
                          <label htmlFor="update_watering_time">Set watering time</label>
                          <input type="text" name="edit_change" id={"1_"+index} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
                            <div className="drop-down-zone-choice">
                              <Dropdown>
                              <Dropdown.Toggle variant="success" id="dropdown-basic">{zoneType1}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                  <Dropdown.Item><button className="vegetable-button" id={"1_"+index} onClick={chooseZoneType1}>Vegetables</button></Dropdown.Item>
                                  <Dropdown.Item><button className="flower-button" id={"1_"+index} onClick={chooseZoneType1}>Flowers</button></Dropdown.Item>
                                  <Dropdown.Item><button className="general-button" id={"1_"+index} onClick={chooseZoneType1}>Mixed/other</button></Dropdown.Item>
                              </Dropdown.Menu>
                              </Dropdown>
                          </div>
                          <button id={"1_" + index} className="save-changes" onClick={saveChanges}>Update entry</button>
                          <button id={"1_" + index} className="delete-changes" onClick={saveChanges}>Delete entry</button>
                          <button id={"1_"+index} className="save-changes" onClick={cancelChanges}>Cancel</button>
                        </div>
                      </div>
                    ))}
                  </div> 
                </div>
                {addWater1 === false ? <button id={"1_+"} className="add-new-water" onClick={addNewWater1}>Add water time</button> : 
                <>
                  <label htmlFor="zone_first_watering">Set watering time</label>
                  <input type="text" name="zone_first_watering" id={"1_+"} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
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
                  <button id="1_+" className="save-changes" onClick={saveNewEntry}>Save entry</button>
                  <button id="1_+" className="save-changes" onClick={cancelChanges}>Cancel</button>
                </>}
            </div> : <></>}
        </div>
        </div>

        <div className="all-zone-two">
        <div className="add-zone-button">{zone2Data.length === 0 && newEntry2 === false ? <button onClick={addZone2} className="add-a-zone">Add zone 2</button> : <></>}</div>
        <div className="add-new-zone">{newEntry2 === true ? 
          <div className="new-zone-entry">
            <label htmlFor="zone_description">Enter new zone description</label>
            <input type="text" name="new_entry" id={"2_+"} value={newZoneDescription} onChange={handleNewZoneDescriptionChange}></input>
            <label htmlFor="zone_first_watering">Set first watering time</label>
            <input type="text" name="zone_first_watering" id={"new"} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
            <div className="drop-down-zone-choice">
                <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">{zoneType2}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item><button className="vegetable-button" id={"2_+"} onClick={chooseZoneType2}>Vegetables</button></Dropdown.Item>
                    <Dropdown.Item><button className="flower-button" id={"2_+"} onClick={chooseZoneType2}>Flowers</button></Dropdown.Item>
                    <Dropdown.Item><button className="general-button" id={"2_+"} onClick={chooseZoneType2}>Mixed/other</button></Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </div>
            <button id="2_+" className="save-changes" onClick={saveNewEntry}>Save entry</button>
            <button id="2_+" className="save-changes" onClick={cancelChanges}>Cancel</button>
          </div> :
          <></>}
        </div>
        <div>{zone2Data.length > 0 ?
            <div className="zones">
                <div className="zone-title" id="2">Zone 2</div>
                { zoneData != null && updateZoneDescription2 === true ? 
                  <div className="updating-new-description" ><label htmlFor="zone_description">Zone description</label>
                  <input type="text" name="new_entry" id={"2_+"} value={newZoneDescription} onChange={handleNewZoneDescriptionChange}></input>
                    <button id={"2_+"} className="save-changes" onClick={saveNewDescription}>Update description</button>
                    <button id={"2_+"} className="save-changes" onClick={cancelChanges}>Cancel</button>           
                  </div> :            
                  <div className="display-new-description">{zoneData != null ? <div className="update-description">{zoneData[1] != null ? zoneData[1].description  :  " "}<button onClick={updateDescription2}>Update description</button></div> : 
                  <></>}</div>
                }
                <div id="2">
                  <div className="watering-data">
                    {zone2Data.map((item, index: number) => (  
                      entryBeingEdited != "2_"+index ? 
                      <div className="display-water-data">
                        {item.time}<button id={"2_" + index} onClick={updateWateringTime}>Update watering time</button>
                      </div>
                       : 
                      <div className="current-water-schedule">
                        <div id={"2_" + index}>
                          <label htmlFor="update_watering_time">Set watering time</label>
                          <input type="text" name="edit_change" id={"2_"+index} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
                            <div className="drop-down-zone-choice">
                              <Dropdown>
                              <Dropdown.Toggle variant="success" id="dropdown-basic">{zoneType2}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                  <Dropdown.Item><button className="vegetable-button" id={"2_"+index} onClick={chooseZoneType2}>Vegetables</button></Dropdown.Item>
                                  <Dropdown.Item><button className="flower-button" id={"2_"+index} onClick={chooseZoneType2}>Flowers</button></Dropdown.Item>
                                  <Dropdown.Item><button className="general-button" id={"2_"+index} onClick={chooseZoneType2}>Mixed/other</button></Dropdown.Item>
                              </Dropdown.Menu>
                              </Dropdown>
                          </div>
                          <button id={"2_" + index} className="save-changes" onClick={saveChanges}>Update entry</button>
                          <button id={"2_" + index} className="delete-changes" onClick={saveChanges}>Delete entry</button>
                          <button id={"2_"+index} className="save-changes" onClick={cancelChanges}>Cancel</button>
                        </div>
                      </div>
                    ))}
                  </div> 
                </div>
                {addWater2 === false ? <button id={"2_+"} className="add-new-water" onClick={addNewWater2}>Add water time</button> : 
                <>
                  <label htmlFor="zone_first_watering">Set watering time</label>
                  <input type="text" name="zone_first_watering" id={"2_+"} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
                    <div className="drop-down-zone-choice">
                      <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">{zoneType2}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item><button className="vegetable-button" id={"2_+"} onClick={chooseZoneType2}>Vegetables</button></Dropdown.Item>
                          <Dropdown.Item><button className="flower-button" id={"2_+"} onClick={chooseZoneType2}>Flowers</button></Dropdown.Item>
                          <Dropdown.Item><button className="general-button" id={"2_+"} onClick={chooseZoneType2}>Mixed/other</button></Dropdown.Item>
                      </Dropdown.Menu>
                      </Dropdown>
                  </div>
                  <button id="2_+" className="save-changes" onClick={saveNewEntry}>Save entry</button>
                  <button id="2_+" className="save-changes" onClick={cancelChanges}>Cancel</button>
                </>}
            </div> : <></>}
        </div>
        </div>

        <div className="all-zone-three">
        <div className="add-zone-button">{zone3Data.length === 0 && newEntry3 === false ? <button onClick={addZone3} className="add-a-zone">Add zone 3</button> : <></>}</div>
        <div className="add-new-zone">{newEntry3 === true ? 
          <div className="new-zone-entry">
            <label htmlFor="zone_description">Enter new zone description</label>
            <input type="text" name="new_entry" id={"3_+"} value={newZoneDescription} onChange={handleNewZoneDescriptionChange}></input>
            <label htmlFor="zone_first_watering">Set first watering time</label>
            <input type="text" name="zone_first_watering" id={"new"} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
            <div className="drop-down-zone-choice">
                <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">{zoneType3}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item><button className="vegetable-button" id={"3_+"} onClick={chooseZoneType3}>Vegetables</button></Dropdown.Item>
                    <Dropdown.Item><button className="flower-button" id={"3_+"} onClick={chooseZoneType3}>Flowers</button></Dropdown.Item>
                    <Dropdown.Item><button className="general-button" id={"3_+"} onClick={chooseZoneType3}>Mixed/other</button></Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </div>
            <button id="3_+" className="save-changes" onClick={saveNewEntry}>Save entry</button>
            <button id="3_+" className="save-changes" onClick={cancelChanges}>Cancel</button>
          </div> :
          <></>}
        </div>
        <div>{zone3Data.length > 0 ?
            <div className="zones">
                <div className="zone-title" id="3">Zone 3</div>
                { zoneData != null && updateZoneDescription3 === true ? 
                  <div className="updating-new-description" ><label htmlFor="zone_description">Zone description</label>
                  <input type="text" name="new_entry" id={"3_+"} value={newZoneDescription} onChange={handleNewZoneDescriptionChange}></input>
                    <button id={"3_+"} className="save-changes" onClick={saveNewDescription}>Update description</button>
                    <button id={"3_+"} className="save-changes" onClick={cancelChanges}>Cancel</button>           
                  </div> :            
                  <div className="display-new-description">{zoneData != null ? <div className="update-description">{zoneData[2] != null ? zoneData[2].description  :  " "}<button onClick={updateDescription3}>Update description</button></div> : 
                  <></>}</div>
                }
                <div id="3">
                  <div className="watering-data">
                    {zone3Data.map((item, index: number) => (  
                      entryBeingEdited != "3_"+index ? 
                      <div className="display-water-data">
                        {item.time}<button id={"3_" + index} onClick={updateWateringTime}>Update watering time</button>
                      </div>
                       : 
                      <div className="current-water-schedule">
                        <div id={"3_" + index}>
                          <label htmlFor="update_watering_time">Set watering time</label>
                          <input type="text" name="edit_change" id={"3_"+index} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
                            <div className="drop-down-zone-choice">
                              <Dropdown>
                              <Dropdown.Toggle variant="success" id="dropdown-basic">{zoneType3}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                  <Dropdown.Item><button className="vegetable-button" id={"3_"+index} onClick={chooseZoneType3}>Vegetables</button></Dropdown.Item>
                                  <Dropdown.Item><button className="flower-button" id={"3_"+index} onClick={chooseZoneType3}>Flowers</button></Dropdown.Item>
                                  <Dropdown.Item><button className="general-button" id={"3_"+index} onClick={chooseZoneType3}>Mixed/other</button></Dropdown.Item>
                              </Dropdown.Menu>
                              </Dropdown>
                          </div>
                          <button id={"3_" + index} className="save-changes" onClick={saveChanges}>Update entry</button>
                          <button id={"3_" + index} className="delete-changes" onClick={saveChanges}>Delete entry</button>
                          <button id={"3_"+index} className="save-changes" onClick={cancelChanges}>Cancel</button>
                        </div>
                      </div>
                    ))}
                  </div> 
                </div>
                {addWater3 === false ? <button id={"3_+"} className="add-new-water" onClick={addNewWater3}>Add water time</button> : 
                <>
                  <label htmlFor="zone_first_watering">Set watering time</label>
                  <input type="text" name="zone_first_watering" id={"3_+"} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
                    <div className="drop-down-zone-choice">
                      <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">{zoneType3}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item><button className="vegetable-button" id={"3_+"} onClick={chooseZoneType3}>Vegetables</button></Dropdown.Item>
                          <Dropdown.Item><button className="flower-button" id={"3_+"} onClick={chooseZoneType3}>Flowers</button></Dropdown.Item>
                          <Dropdown.Item><button className="general-button" id={"3_+"} onClick={chooseZoneType3}>Mixed/other</button></Dropdown.Item>
                      </Dropdown.Menu>
                      </Dropdown>
                  </div>
                  <button id="3_+" className="save-changes" onClick={saveNewEntry}>Save entry</button>
                  <button id="3_+" className="save-changes" onClick={cancelChanges}>Cancel</button>
                </>}
            </div> : <></>}
        </div>
        </div>

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ZoneEdit;