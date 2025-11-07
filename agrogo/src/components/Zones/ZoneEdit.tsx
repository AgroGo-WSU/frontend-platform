import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { AuthContext } from '../../hooks/UseAuth';
import { getAuth } from "firebase/auth";
import { useState, useEffect, useContext } from "react";

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

  const [entryBeingEdited, setEntryBeingEdited] = useState(null);
  const [data, setData] = useState(null);
  const [sendingWaterSchedule, setSendingWaterSchedule] = useState(false);
  const [updatedWaterInput, setUpdatedWaterInput] = useState(null);
  const [waterSchedZone1, setWaterSchedZone1] = useState();
  const [waterSchedZone2, setWaterSchedZone2] = useState();
  const [waterSchedZone3, setWaterSchedZone3] = useState();

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

  function updateWateringTime(event) {
    console.log("Updating a watering time for zone ", event.target.id);
    setEntryBeingEdited(event.target.id);
  }

  function handleChangeWaterTime(event) {
    setUpdatedWaterInput(event.target.value);
    console.log("Changing water time!");
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

  console.log(zone1Data[1]);

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

        <div>{zone1Data.length > 0 ?
            <div className="zones">
                <div id="1">Zone 1</div>
                <div id="1">
                  {entryBeingEdited != "1" ? 
                  <div className="watering-data">
                    {zone1Data.map((item, index: number) => (
                      <div className="display-water-data">
                        {item.time}<button id={"1_" + index} onClick={updateWateringTime}>Update watering time</button>
                      </div>
                    ))}
                  </div> : 
                    zone1Data.map((item, index: number) => (
                      <div className="current-water-schedule"><div id={"1_" + index}><input type="text" name="edit_change" id={"1_" + index} value={updatedWaterInput} onChange={handleChangeWaterTime}></input></div></div>
                      ))}
                </div>
            </div> : <></>
        }</div>

        <div>{zone2Data.length > 0 ?
            <div className="zones">
                <div id="2">Zone 2</div>
                <div id="2">
                  {entryBeingEdited != "2" ? 
                  <div className="watering-data">
                    {zone2Data.map(item => (
                      <div className="display-water-data">
                        {item.time}<button id="2" onClick={updateWateringTime}>Update watering time</button>
                      </div>
                    ))}
                  </div> : 
                    zone2Data.map(item => (
                      <div className="current-water-schedule"><div id="2"><input type="text" name="edit_change" value={updatedWaterInput} onChange={handleChangeWaterTime}></input></div></div>
                      ))}
                </div>
            </div> : <></>
        }</div>

        


          {/* <div className="zone">
            {editing === false ? typeData.map(item => (
              <div className="current-water-schedule"><div id={item[1]}>
              value={item[0]}</div></div>)) :
              
              typeData.map(item => ( item[1].toString() === columnBeingEdited ? 
              <div className="current-water-schedule"><div id={item[1]}><input type="text" name="edit_change" value={waterStartTime} onChange={handleChangeType}></input></input></div></div> : 
              <div className="current-water-schedule"><div id={item[1]}><InventoryPlantItem value={item[0]} /></div></div>
            ))}

            {newEntry === true ? (
              <div className="table-data">
                <label htmlFor="input_name">Plant type</label><br />
                <input type="text" name="input_name" onChange={handleChangeType}></input>
              </div>
            ) : <></>}
          </div> */}

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ZoneEdit;