import "../../stylesheets/ZoneDetails.css"
import axios from "axios";
import { AuthContext } from '../../hooks/UseAuth';
import { getAuth } from "firebase/auth";
import { useState, useEffect, useContext } from "react";

function ZoneFan() {

    // state to signal that a watering time is being added
    const [addFan, setAddFan] = useState(false);

    // state to hold the fan schedule data
    const [fanSchedData, setFanSchedData] = useState();

    // state to signal that a request is being made to the database
    const [sendingFanSchedule, setSendingFanSchedule] = useState(false);

    // state to hold the updated fan time
    const [newFanInput, setNewFanInput] = useState(null);

    // signal to set the entry being editied
    const [entryBeingEdited, setEntryBeingEdited] = useState("0000");

    // function to get fan times
    // this function will retrive all of the available fan schedule times from the database for this user
    useEffect(() => {
        const getFanTimes = async () => {

        // using the React context to get the Firebase information about the user
        try {
            const auth = getAuth();
            const user = auth.currentUser;

        if (!user) {
            throw new Error('User not authenticated!');
            }

            const token = await user.getIdToken();
        
            // make the call to the database
            const response = await axios.get("https://backend.agrogodev.workers.dev/api/user/fanSchedule", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    }
                });

            // set the state to hold the data retrieved from the database
            setFanSchedData(response.data.data); // this sets the state - response is of type <AxiosResponse> and calling response.data gives us the actual array of arrays that make up the individual instances of our db table
            } catch(error){
                console.error('Error fetching fan schedule data:', error);
            } finally {
                console.log("Data for fan schedule: ", fanSchedData);
        }

        setSendingFanSchedule(false);
        };

        // call the getFanTimes function inside the useEffect function, and then set the setSendingFanSchedule back to false
        getFanTimes();

        },[sendingFanSchedule]);

    // function to save the fan entry
    const saveChanges = async(event) => {

        const bothIDs = event.target.id.split("_");
        const index = bothIDs[1];

        const eventType = event.target.firstChild.data;
        console.log("===============================", eventType);

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
        if (eventType === "Save entry") {
          // package the data to be POSTED as a NEW entry
          const postData = {
            id: Math.round(Math.random()*100),
            type: "null",
            userId: userIdFB,
            timeOn: newFanInput,
            timeOff: "na",
            duration: "30",
            zoneType: "null",
          }

          // POST request
          const sentResponse = await axios.post("https://backend.agrogodev.workers.dev/api/data/fanSchedule", postData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });
            // force the GET request above to re-render and grab the newly updated data for the water schedule
            setSendingFanSchedule(true);
          
        // else statement for PUT requests
        } else if(eventType === "Update entry") {
          // package the data for a PUT request - so go back into the findData array and grab the existing info (since we're only updating the time, and everything else should be the same)

          const putData = {
            id: fanSchedData[index].id,
            type: "null",
            userId: userIdFB,
            timeOn: newFanInput,
            timeOff: "na",
            duration: "30",
            zoneType: "null",
          }
        
          // PUT request
          const sentResponse = await axios.put("https://backend.agrogodev.workers.dev/api/data/fanSchedule", putData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              }
          });
            
          // force the GET request above to re-render and grab the newly updated data for the water schedule
           setSendingFanSchedule(true);
        
        // else statement for DELETE requests - no need to package data for the DELETE request, just need to send the ID in the data portion of the request 
        } else if(eventType === "Delete entry") {

            const deleteID = fanSchedData[index].id

          // DELETE request
          const sentResponse = await axios.delete("https://backend.agrogodev.workers.dev/api/data/fanSchedule", {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
              data: {
                id: deleteID
              }
            });
            // force the GET request above to re-render and grab the newly updated data for the fan schedule
            setSendingFanSchedule(true);
          } 

          } catch(error){
            console.error('Error sending data:', error);
          } finally {

            console.log("We made it to the end of the saveChanges function!");
      }

      // reset all state
      setAddFan(false);
      setEntryBeingEdited("0000");
    }

    // in the response, you will get all 3 zones in the database, UNSORTED, so here we will sort it
    // you need x number of arrays of times, one for each zone 
    const fanDataArray = [];

    if(fanSchedData != null) {
      for(let i = 0; i < fanSchedData.length; i++ ) {
          fanDataArray.push(fanSchedData[i]);
      }
    }

    // functions to manage state buttons and input fields
    function cancelButton() {
        setAddFan(false);
        setEntryBeingEdited("0000");
        setNewFanInput(null);
        
    }

    function addFanButton(event) {
        setAddFan(true);
    }

    function handleUpdateFanTime(event) {
        setNewFanInput(event.target.value);
    }

    function saveMyChanges(event) {
        setSendingFanSchedule(true);
        saveChanges(event)
    }

  // function to update which entry is being edited
  function updateFanTime(event) {
    console.log("Updating a fan time for ", event.target.id);
    setEntryBeingEdited(event.target.id);
  }

    return(
    <div className="zone-fan-container">
        <div className="fan-heading">Fan schedule</div>
        <div>
            {addFan === false ? <button className="add-fan-button-enabled" onClick={addFanButton}>Add fan time</button> : <button className="fan-button-disabled>">Add fan schedule</button>}
            {addFan === true ? <><input type="time" className="new-fan-input fan-data" onChange={handleUpdateFanTime}></input><button className="save-fan-time" id="save" onClick={saveChanges}>Save entry</button><button className="cancel-fan-changes" onClick={cancelButton}>Cancel</button></> : <></>}
        </div>
        <div className="fan-data-display">
        {fanSchedData != null ? fanSchedData.map((item, index: number) => (  
                  entryBeingEdited != "1_" + index ? 
                    <div className="display-water-data fan-data">
                      {item.timeOn}<button className="update-fan-button" id={"1_" + index} onClick={updateFanTime}>Update time</button>
                    </div> : 
                    <div className="update-water-input">
                      <div className="water-schedule-input-field">
                        <label htmlFor="update_watering_time">Set fan time</label>
                        <input type="time" name="edit_change" id={"1_"+index} value={newFanInput} onChange={handleUpdateFanTime}></input>                      </div>
                      <div className="update-water-buttons">
                    <button id={"1_" + index} className="update-entry" onClick={saveMyChanges}>Update entry</button>
                    <button id={"1_" + index} className="delete-entry" onClick={saveChanges}>Delete entry</button>
                    <button id={"1_"+index} className="cancel-changes" onClick={cancelButton}>Cancel</button>
                  </div>
                </div>
        )) : (<></>)}
    </div>
    </div>
    )
}

export default ZoneFan;