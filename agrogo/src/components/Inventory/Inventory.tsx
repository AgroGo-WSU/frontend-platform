import Table from 'react-bootstrap/Table';
import { useEffect, useState, useContext } from "react";
import "../../stylesheets/Inventory.css";
import axios from "axios";
import { AuthContext } from '../../hooks/UseAuth';
import { getAuth } from "firebase/auth";
import InventoryPlantItem from './InventoryPlantItem';
// import InventoryAddPlantItem from './InventoryAddPlantItem';

// type for new columns
class InputTypes {
  public fieldID: number;
  public plantName: string;
  public plantType: string;
  public plantQuantity: string;
  public plantDate: string;

  public constructor(plantInstance: { fieldID: number, plantName: string, plantType: string, plantQuantity: string, plantDate: string }) {
      this.fieldID = plantInstance.fieldID;
      this.plantName = "Plant name";
      this.plantType = "Plant type";
      this.plantQuantity = "Quantity";
      this.plantDate = "Date planted";
  }
}

// creating the class for the instances of the table we're expecting from our JSON response
class PlantInventoryDTO {
  public id: string;
  public userId: string;
  public plantName: string;
  public plantType: string;
  public quantity: string;
  public zoneId: string;
  public datePlanted: string;


  // this constructor MUST specify the individual members of the array/object from response.data or React will not accept it
  // this is a work around where you are basically "hard-coding" the object that you're expecting
  public constructor(dataInstance: {  id: string, userId: string, plantType: string, plantName: string, zoneId: string, quantity: string, datePlanted: string}) {

    if(dataInstance != null) {
      this.id = dataInstance.id;
      this.userId = dataInstance.userId;
      this.plantType = dataInstance.plantType;
      this.plantName = dataInstance.plantName;
      this.zoneId = dataInstance.zoneId;
      this.quantity = dataInstance.quantity;
      this.datePlanted = dataInstance.datePlanted;
    } else {
        this.id = "null";
        this.userId = "null";
        this.plantType = "plant type";
        this.plantName = "plant name";
        this.zoneId = "not set";
        this.quantity = "quantity";
        this.datePlanted = "date planted";
    }


  }

  // will go back later to add the other getters - I only want the name for the received time right now
  public getUserId(): string {
    return this.userId;
  }
}

function Inventory() {

  // this will be how we access the current user's info from Firebase
  const { currentUser } = useContext(AuthContext);

  
  // this is where state gets initialized and managed. Even in TS, you can let these hooks infer the type (and here, you should let useState infer the type of data) but I've set the type for the message state
  const [data, setData] = useState(null);
  const [error, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState(null);

  // this is to update what shows up on the page after a user adds or edits a new plant, and to tell the database to do POST or PATCH request
  const [sendingRequest, setPostRequest] = useState(false);

  // adding an editing function
  const [editing, setEditing] = useState(false); 

  // adding field id state to keep track of which field is being edited
  const [columnBeingEdited, setColumnBeingEdited] = useState(null);


    // you MUST use the useEffect and useState hooks for this- useEffect is crucial in how the DOM renders data on screen and when you can pull data from where, and useState is how the data gets saved once useEffect is called - ask Madeline if you would like clarification on why this happens
    useEffect(() => {
      const getConnection = async () => {

        try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated!');
        }

        const token = await user.getIdToken();
        // console.log(token);
      
        const response = await axios.get("https://backend.agrogodev.workers.dev/api/user/plantInventory", {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });

          console.log("SETTING INVENTORY DATA: ", response.data.data);
          setData(response.data.data); // this sets the state - response is of type <AxiosResponse> and calling response.data gives us the actual array of arrays that make up the individual instances of our db table
          } catch(error){
            console.error('Error fetching data:', error);
          } finally {
            console.log("Data for INVENTORY: ", data);
      }
    };

    getConnection();
    setPostRequest(false);

    },[sendingRequest]);

    console.log("INVENTORY RESPONSE", data);

    // so now we can create a new instance of our DeviceDTO object, and feed it whichever line we're looking for - in this case, we want the most recent connection, which looks like it will always be at index 0 of the JSON response. If that changes, you MUST define the length in the useEffect hook and save it in a new state variable, or you may run into issues
    const inv1 = new PlantInventoryDTO(data ? data[0] : {id: "00", userId: "00", plantType: "00", plantName: "00", zoneId: "00", quantity: "00", datePlanted: "00"});
    console.log("First entry for inventory final data: ", inv1);

    // useEffect(() => {

    // }, [])

    const [newEntry, setNewEntry] = useState(false);

    // this is for setting whether to add the new plant input field
    function updateState() {
      setNewEntry(true);
      console.log("*********************************newEntry: ", newEntry);
    }

    // clear column and state
    function clearState() {
      setNewEntry(false);
      setNameInput(null);
      setTypeInput(null);
      setQuantityInput(null);
      setDateInput(null);
      console.log("*********************************newEntry: ", newEntry);    
    }

    // also clears the previous state
    const saveChanges = async(event) => {
      console.log("EVENT TARGET FIRSTCHILD DATA ", event.target.firstChild.data);
      const eventTYPE = event.target.firstChild.data;
      const eventID = event.target.id;
      setNewEntry(false);
      setEditing(false);
      console.log("Setting state to false: ", newEntry);
      console.log("Here is the data: ", nameInput, " ", typeInput, " ", quantityInput, " ", dateInput);

      // try to get the user token and make the post request
        try {
        const auth = getAuth();
        const user = auth.currentUser;


        if (!user) {
          throw new Error('User not authenticated!');
        }

        const userIdFB = user.uid;
        const token = await user.getIdToken();
        console.log("UserId from FIREBASE: ", userIdFB);
      
        if (eventTYPE === "Save entry") {

        const postData = {
          userId: userIdFB,
          plantType: typeInput,
          plantName: nameInput,
          zoneId: "1",
          quantity: quantityInput,
          datePlanted: dateInput 
        }

        const sentResponse = await axios.post("https://backend.agrogodev.workers.dev/api/data/plantInventory", postData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });
          
          setPostRequest(true);
          console.log("Sending POST request for new data - here's the response ", sentResponse);
          } else if(eventTYPE === "Update entry") {

        const putData = {
          id: data[eventID].id,
          userId: userIdFB,
          plantType: typeInput,
          plantName: nameInput,
          zoneId: "1",
          quantity: quantityInput,
          datePlanted: dateInput
        }
        const sentResponse = await axios.put("https://backend.agrogodev.workers.dev/api/data/plantInventory", putData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });
          
          setPostRequest(true);
          console.log("Sending PUT request for new data - here's the response ", sentResponse);           
          } else if(eventTYPE === "Delete entry") {

            console.log("!!! MAKING DELETE REQUEST");
        const sentResponse = await axios.delete("https://backend.agrogodev.workers.dev/api/data/plantInventory", {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
              data: {
                id: data[eventID].id
              }
            });
          
          setPostRequest(true);
          console.log("Sending DELETE request for new data - here's the response ", sentResponse);           
          } 

          } catch(error){
            console.error('Error sending data:', error);
          } finally {
            console.log("Looks like the inventory POST request worked!");
      }
    
       
      setNameInput(null);
      setTypeInput(null);
      setQuantityInput(null);
      setDateInput(null);
      }
    
      

    // state for changing inputs
    const [nameInput, setNameInput] = useState(null);
    const [typeInput, setTypeInput] = useState(null);
    const [quantityInput, setQuantityInput] = useState(null);
    const [dateInput, setDateInput] = useState(null);

    // functions to save the varioys inputs to state
    function handleChangeName(event) {
      setNameInput(event.target.value);
      console.log("*********************************NAMEINPUT FUNCTION: ", nameInput);
    }

    function handleChangeType(event) {
      setTypeInput(event.target.value);
      console.log("*********************************TYPE FUNCTION: ", typeInput);
    }

    function handleChangeQuantity(event) {
      setQuantityInput(event.target.value);
      console.log("*********************************QUANTITY FUNCTION: ", quantityInput);
    }

    function handleChangeDate(event) {
      setDateInput(event.target.value);
      console.log("*********************************DATE FUNCTION: ", dateInput);
    }

    function deleteChanges(event) {
      console.log(event.target);
    }

    function updateEntry(event) {
      setEditing(true);
      const columnID = event.target.id;
      setColumnBeingEdited(columnID);
      setNameInput(data[columnID].plantName);
      setTypeInput(data[columnID].plantType);
      setQuantityInput(data[columnID].quantity);
      setDateInput(data[columnID].datePlanted);
    }


    // arrays which will be mapped to table values
    let nameData = [];
    let typeData = [];
    let quantityData = [];
    let dateData = [];
    let idData = [];

    // build out the arrays for mapping
    if(data != null) {
      for(let i = 0; i < data.length; i++) {
        const nameID = [data[i].plantName, i];
        nameData.push(nameID);

        const typeID = [data[i].plantType, i];
        typeData.push(typeID);

        const quantityID = [data[i].quantity, i];
        quantityData.push(quantityID);

        const dateID = [data[i].datePlanted, i];
        dateData.push(dateID);
      }
    }

    return(
        <>
        <div className="background-container">
        <div className="form-container"><form>
        {newEntry === false ? <button className="add-enabled" onClick={updateState}>Add a plant</button> : <button className="add-disabled">Save entry to add another plant</button>}
        <Table responsive="sm">
        <div className="inventory-head">
          <div className="table-row">
            <div className="table-heading">Plant name</div>
            {editing === false ? nameData.map(item => (
              <div className="table-data"><div id={item[1]}><InventoryPlantItem
              value={item[0]} /></div><button id={item[1]} className="edit-enabled" onClick={updateEntry}>Edit this entry</button></div>)) :
              
              nameData.map(item => ( item[1].toString() === columnBeingEdited ? 
              <div className ="table-data"><div id={item[1]}><input type="text" name="edit_change" value={nameInput} onChange={handleChangeName}></input></div><button className="edit-disabled" id={item[1]} onClick={saveChanges}>Update entry</button><button className="edit-delete" id={item[1]} onClick={saveChanges}>Delete entry</button></div> : 
              <div className="table-data"><div id={item[1]}><InventoryPlantItem value={item[0]} /></div><button id={item[1]} className="edit-enabled" onClick={updateEntry}>Edit this entry</button></div>
            ))}
            
            {newEntry === true ? (
              <div className="table-data">
                <label htmlFor="input_name">Plant name</label>{newEntry === true ? <button id="new_entry" onClick={saveChanges}>Save entry</button> : <></>}{newEntry === true ? <button onClick={clearState}>Clear</button> : <></>}<br />
                <input type="text" name="input_name" onChange={handleChangeName}></input>
              </div>
            ) : <></>}

          </div>
        </div>
        <div className="inventory-body">
          <div className="table-row">
            <div className="table-heading">Type</div>
            {editing === false ? typeData.map(item => (
              <div className="table-data"><div id={item[1]}><InventoryPlantItem
              value={item[0]} /></div></div>)) :
              
              typeData.map(item => ( item[1].toString() === columnBeingEdited ? 
              <div className="table-data"><div id={item[1]}><input type="text" name="edit_change" value={typeInput} onChange={handleChangeType}></input></div></div> : 
              <div className="table-data"><div id={item[1]}><InventoryPlantItem value={item[0]} /></div></div>
            ))}

            {newEntry === true ? (
              <div className="table-data">
                <label htmlFor="input_name">Plant type</label><br />
                <input type="text" name="input_name" onChange={handleChangeType}></input>
              </div>
            ) : <></>}
          </div>
          <div className="table-row">
            <div className="table-heading">Quantity</div>
            {editing === false ? quantityData.map(item => (
              <div className="table-data"><div id={item[1]}><InventoryPlantItem
              value={item[0]} /></div></div>)) :
              
              quantityData.map(item => ( item[1].toString() === columnBeingEdited ? 
              <div className="table-data"><div id={item[1]}><input type="number" min="0" max="999999" name="edit_change" value={quantityInput} onChange={handleChangeQuantity}></input></div></div> : 
              <div className="table-data"><div id={item[1]}><InventoryPlantItem value={item[0]} /></div></div>
            ))}

            {newEntry === true ? (
              <div className="table-data">
                <label htmlFor="input_name">Quantity</label><br />
                <input type="number" min="0" max="999999" name="input_name" onChange={handleChangeQuantity}></input>
              </div>
            ) : <></>}
          </div>
          <div className="table-row">
            <div className="table-heading">Date planted</div>
            {editing === false ? dateData.map(item => (
              <div className="table-data"><div id={item[1]}><InventoryPlantItem
              value={item[0]} /></div></div>)) :
              
              dateData.map(item => ( item[1].toString() === columnBeingEdited ? 
              <div className="table-data"><div id={item[1]}><input type="date" name="edit_change" value={dateInput} onChange={handleChangeDate}></input></div></div> : 
              <div className="table-data"><div id={item[1]}><InventoryPlantItem value={item[0]} /></div></div>
            ))}

            {newEntry === true ? (
              <div className="table-data">
                <label htmlFor="input_name">Date planted</label><br />
                <input type="date" name="input_name" onChange={handleChangeDate}></input>
              </div>
            ) : <></>}
          </div>
        </div>
      </Table>
      </form>
    </div>
    </div>
    </>
    )
}

export default Inventory;