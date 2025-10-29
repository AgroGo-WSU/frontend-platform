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
  public plantName: string;
  public plantType: string;
  public plantQuantity: string;
  public plantDate: string;

  public constructor(plantInstance: {plantName: string, plantType: string, plantQuantity: string, plantDate: string}) {
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

    const [numberOfNewColumns, setNumberOfNewColumns] = useState(0);

    // this is for setting state for how many new plants the user wants to add
    function updateState() {
        setNumberOfNewColumns(numberOfNewColumns + 1);
        console.log("*********************************numberOfNewColumns: ", numberOfNewColumns);
    }

    // clear unused columns
    function resetState() {
        setNumberOfNewColumns(0);
        console.log("*********************************numberOfNewColumns: ", numberOfNewColumns);    
    }

    // function for saving the input to the 
    function saveState() {
        console.log("*********************************numberOfNewColumns: ", numberOfNewColumns);    
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

    const newInputLabels: InputTypes[] = [];

    if(numberOfNewColumns > 0) {
      for(let i = 0; i < numberOfNewColumns; i++) {
        const newPlantLabels = new InputTypes({plantName: "Plant name", plantType: "Plant type", plantQuantity: "Quantity", plantDate: "Date planted"});
        newInputLabels.push(newPlantLabels);
      }
    }

    return(
        <>
        <div>
        <button onClick={updateState}>Add plants</button>
        {numberOfNewColumns > 0 ? <button onClick={resetState}>Clear</button> : <></>}
        {numberOfNewColumns > 0 ? <button onClick={saveState}>Save</button> : <></>}
        <Table responsive="sm">
        <thead>
          <tr>
            <th>Plant</th>
            {nameData.map(item => (
              <td><InventoryPlantItem
              value={item} /></td>))}
            
            {numberOfNewColumns > 0 ? newInputLabels.map(item => (
              <td>
                <label htmlFor="add_value">{ item.plantName }</label><br />
                <input type="text" id="add_value" name="add_value"></input>
              </td>)) : <></>}

          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Type</th>
            {typeData.map(item => (
              <td><input type="text" id="add_value" name="add_value">{ item }</input></td>))}

            {numberOfNewColumns > 0 ? newInputLabels.map(item => (
              <td>
                <label htmlFor="add_value">{ item.plantType }</label><br />
                <input type="text" id="add_value" name="add_value"></input>
              </td>)) : <></>}
          </tr>
          <tr>
            <th>Quantity</th>
            {quantityData.map(item => (
              <td><input type="text" id="add_value" name="add_value">{ item }</input></td>))}

            {numberOfNewColumns > 0 ? newInputLabels.map(item => (
              <td>
                <label htmlFor="add_value">{ item.plantQuantity }</label><br />
                <input type="text" id="add_value" name="add_value"></input>
              </td>)) : <></>}
          </tr>
          <tr>
            <th>Date planted</th>
            {dateData.map(item => (
              <td><input type="text" id="add_value" name="add_value">{ item }</input></td>))}

            {numberOfNewColumns > 0 ? newInputLabels.map(item => (
              <td>
                <label htmlFor="add_value">{ item.plantDate }</label><br />
                <input type="text" id="add_value" name="add_value"></input>
              </td>)) : <></>}
          </tr>
        </tbody>
      </Table>
    </div>
        </>
    )
}

export default Inventory;