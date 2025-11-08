import '../../stylesheets/ZoneEdit.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { AuthContext } from '../../hooks/UseAuth';
import { getAuth } from "firebase/auth";
import { useState, useEffect, useContext } from "react";
import moment from 'moment-timezone';

class WaterSchedule {
  public id: string;
  public type: string;
  public userId: string;
  public scheduledTime: string;
  public duration: string;

  public constructor(WaterInstance: {id: string, type: string, userId: string, scheduledTime: string, duration: string}) {
    this.id = WaterInstance.id;
    this.type = WaterInstance.type;
    this.userId = WaterInstance.userId;
    this.scheduledTime = WaterInstance.scheduledTime;
    this.duration = WaterInstance.duration;
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
  const [waterSchedZone1, setWaterSchedZone1] = useState();
  const [waterSchedZone2, setWaterSchedZone2] = useState();
  const [waterSchedZone3, setWaterSchedZone3] = useState();
  const [numberOfZones, setNumberOfZones] = useState(0);
  const [zoneData, setZoneData] = useState([]);
  const [newZoneDescription, setNewZoneDescription] = useState(null);
  const [firstWater, setFirstWater] = useState(false);

  console.log("Example of the props thing - this is the id: ", props.data[0].id);

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

        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", waterSchedZone1);

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

        const postData = {
          id: Math.round(Math.random()*100),
          type: zoneArrayID,
          userId: userIdFB,
          scheduledTime: updatedWaterInput,
          duration: "1",
        }

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
          scheduledTime: findData[zoneArrayIndex].scheduledTime,
          duration: findData[zoneArrayIndex].duration,
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

      setSendingWaterSchedule(false);
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

    },[sendingWaterSchedule]);

    
  const saveNewEntry = async(event) => {
  
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

  function cancelChanges() {
    setNewEntry1(false);
    setNewEntry2(false);
    setNewEntry3(false);
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
        <div className="add-zone-button">{zone1Data.length === 0 ? <button onClick={addZone1} className="add-a-zone">Add zone 1</button> : <></>}</div>
        <div className="add-new-zone">{newEntry1 === true ? 
          <div className="new-zone-entry">
            {/** Ask for zone number and description and make a POST request to the zone table*/}
            <label htmlFor="zone_description">Zone description</label>
            <input type="text" name="new_entry" id={"new"} value={newZoneDescription} onChange={handleNewZoneDescriptionChange}></input>
            <label htmlFor="zone_first_watering">Set first watering time</label>
            <input type="text" name="zone_first_watering" id={"new"} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
            <button id="1_+" className="save-changes" onClick={saveNewEntry}>Save entry</button>
            <button id="1_+" className="save-changes" onClick={cancelChanges}>Cancel</button>
          </div> :
          <></>}
        </div>
        <div>{zone1Data.length > 0 ?
            <div className="zones">
                <div id="1">Zone 1</div>
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
                          <input type="text" name="edit_change" id={"1_" + index} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
                          <button id={"1_" + index} className="save-changes" onClick={saveChanges}>Update entry</button>
                          <button id={"1_" + index} className="delete-changes" onClick={saveChanges}>Delete entry</button>
                        </div>
                      </div>
                    ))}
                  </div> 
                </div>
            </div> : <></>}
        </div>
        </div>

        <div className="all-zone-two">
        <div className="add-zone-button">{zone2Data.length === 0 ? <button onClick={addZone2} className="add-a-zone">Add zone 2</button> : <></>}</div>
        <div className="add-new-zone">{newEntry2 === true ? 
          <div className="new-zone-entry">
            {/** Ask for zone number and description and make a POST request to the zone table*/}
            <label htmlFor="zone_description">Zone description</label>
            <input type="text" name="new_entry" id={"new"} value={newZoneDescription} onChange={handleNewZoneDescriptionChange}></input>
            <label htmlFor="first_zone_time">Set your first watering time for this zone</label>
            <input type="text" name="new_entry" id={"new"} value={updatedWaterInput === null ? " " : updatedWaterInput} onChange={handleChangeWaterTime}></input>
            <button id="2_+" className="save-changes" onClick={saveChanges}>Save entry</button>
            <button id="2_+" className="save-changes" onClick={cancelChanges}>Cancel</button>
          </div> :
          <></>}
        </div>
        <div>{zone2Data.length > 0 ?
            <div className="zones">
                <div id="2">Zone 2</div>
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
                          <input type="text" name="edit_change" id={"1_" + index} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
                          <button id={"2_" + index} className="save-changes" onClick={saveChanges}>Update entry</button>
                          <button id={"2_" + index} className="delete-changes" onClick={saveChanges}>Delete entry</button>
                        </div>
                      </div>
                    ))}
                  </div> 
                </div>
            </div> : <></>}
        </div>
        </div>

        <div className="all-zone-three">
        <div className="add-zone-button">{zone3Data.length === 0 ? <button onClick={addZone3} className="add-a-zone">Add zone 3</button> : <></>}</div>
        <div className="add-new-zone">{newEntry3 === true ? 
          <div className="new-zone-entry">
            {/** Ask for zone number and description and make a POST request to the zone table*/}
            <label htmlFor="zone_description">Zone description</label>
            <input type="text" name="new_entry" id={"new"} value={newZoneDescription} onChange={handleNewZoneDescriptionChange}></input>
            <label htmlFor="first_zone_time">Set your first watering time for this zone</label>
            <input type="text" name="new_entry" id={"new"} value={updatedWaterInput === null ? " " : updatedWaterInput} onChange={handleChangeWaterTime}></input>
            <button id="3_+" className="save-changes" onClick={saveChanges}>Save entry</button>
            <button id="3_+" className="save-changes" onClick={cancelChanges}>Cancel</button>
          </div> :
          <></>}
        </div>
        <div>{zone3Data.length > 0 ?
            <div className="zones">
                <div id="3">Zone 3</div>
                <div id="3">
                  <div className="watering-data">
                    {zone1Data.map((item, index: number) => (  
                      entryBeingEdited != "3_"+index ? 
                      <div className="display-water-data">
                        {item.time}<button id={"3_" + index} onClick={updateWateringTime}>Update watering time</button>
                      </div>
                       : 
                      <div className="current-water-schedule">
                        <div id={"3_" + index}>
                          <input type="text" name="edit_change" id={"3_" + index} value={updatedWaterInput} onChange={handleChangeWaterTime}></input>
                          <button id={"3_" + index} className="save-changes" onClick={saveChanges}>Update entry</button>
                          <button id={"3_" + index} className="delete-changes" onClick={saveChanges}>Delete entry</button>
                        </div>
                      </div>
                    ))}
                  </div> 
                </div>
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