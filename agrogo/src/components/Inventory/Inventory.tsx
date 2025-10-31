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
  public getPlantName(): string {
    return this.plantName;
  }
}

function Inventory() {

  // this will be how we access the current user's info from Firebase
  const { currentUser } = useContext(AuthContext);

  
  // this is where state gets initialized and managed. Even in TS, you can let these hooks infer the type (and here, you should let useState infer the type of data) but I've set the type for the message state
  const [data, setData] = useState(null);
  const [error, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState(null);


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

    },[]);

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

    // function for saving the input - right now it's just printing to console but it will eventually be a useEffect POST request
    // also clears the previous state
    function saveState() {
      setNewEntry(false);
      console.log("Setting state to false: ", newEntry);
      console.log("Here is the data: ", nameInput, " ", typeInput, " ", quantityInput, " ", dateInput);
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

    console.log("INVENTORY RESPONSE", data);

    // so now we can create a new instance of our DeviceDTO object, and feed it whichever line we're looking for - in this case, we want the most recent connection, which looks like it will always be at index 0 of the JSON response. If that changes, you MUST define the length in the useEffect hook and save it in a new state variable, or you may run into issues
    const inv1 = new PlantInventoryDTO(data ? data[0] : {id: "00", userId: "00", plantType: "00", plantName: "00", zoneId: "00", quantity: "00", datePlanted: "00"});
    console.log("Inventory final data: ", inv1);

    // arrays which will be mapped to table values
    let nameData = [];
    let typeData = [];
    let quantityData = [];
    let dateData = [];

    // build out the arrays for mapping
    if(data != null) {
      for(let i = 0; i < data.length; i++) {
        nameData.push(data[i].plantName);
        typeData.push(data[i].plantType);
        quantityData.push(data[i].quantity);
        dateData.push(data[i].datePlanted);
      }
    }

    // to do: 
    // add flex styling so the row of plants wraps
    // make the first row sticky so you can always see category names
    // add the "add/remove/edit" feature


    return(
        <>
        <div><form>
        {newEntry === false ? <button className="add-enabled" onClick={updateState}>Add a plant</button> : <button className="add-disabled">Save entry to add another plant</button>}
        <Table responsive="sm">
        <thead>
          <tr>
            <th>Plant</th>
            {nameData.map(item => (
              <td><InventoryPlantItem
              value={item} /></td>))}
            
            {newEntry === true ? (
              <td>
                <label htmlFor="input_name">Plant name</label>{newEntry === true ? <button onClick={saveState}>Save entry</button> : <></>}{newEntry === true ? <button onClick={clearState}>Clear</button> : <></>}<br />
                <input type="text" name="input_name" onChange={handleChangeName}></input>
              </td>
            ) : <></>}

          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Type</th>
            {typeData.map(item => (
              <td><InventoryPlantItem
              value={item} /></td>))}

            {newEntry === true ? (
              <td>
                <label htmlFor="input_name">Plant type</label><br />
                <input type="text" name="input_name" onChange={handleChangeType}></input>
              </td>
            ) : <></>}
          </tr>
          <tr>
            <th>Quantity</th>
            {quantityData.map(item => (
              <td><InventoryPlantItem
              value={item} /></td>))}

            {newEntry === true ? (
              <td>
                <label htmlFor="input_name">Quantity</label><br />
                <input type="text" name="input_name" onChange={handleChangeQuantity}></input>
              </td>
            ) : <></>}
          </tr>
          <tr>
            <th>Date planted</th>
            {dateData.map(item => (
              <td><InventoryPlantItem
              value={item} /></td>))}

            {newEntry === true ? (
              <td>
                <label htmlFor="input_name">Date planted</label><br />
                <input type="text" name="input_name" onChange={handleChangeDate}></input>
              </td>
            ) : <></>}
          </tr>
        </tbody>
      </Table>
      </form>
    </div>
        </>
    )
}

export default Inventory;