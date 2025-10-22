import Table from 'react-bootstrap/Table';
import { useEffect, useState, useContext } from "react";
import "../../stylesheets/Inventory.css";
import axios from "axios";
import { AuthContext } from '../../hooks/UseAuth';
import { getAuth } from "firebase/auth";


// creating the class for the instances of the table we're expecting from our JSON response
class PlantInventoryDTO {
  public id: string;
  public userId: string;
  public plantName: string;
  public plantType: string;
  public quantity: string;
  public zoneId: string;


  // this constructor MUST specify the individual members of the array/object from response.data or React will not accept it
  // this is a work around where you are basically "hard-coding" the object that you're expecting
  public constructor(dataInstance: {  id: string, userId: string, plantType: string, plantName: string, zoneId: string, quantity: string}) {

    this.id = dataInstance.id;
    this.userId = dataInstance.userId;
    this.plantType = dataInstance.plantType;
    this.plantName = dataInstance.plantName;
    this.zoneId = dataInstance.zoneId;
    this.quantity = dataInstance.quantity;
  }

  // will go back later to add the other getters - I only want the name for the received time right now
  public getPlantName(): string {
    return this.plantName;
  }
}

function Inventory() {

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
        console.log(token);
      
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

    console.log("INVENTORY RESPONSE", data);

    // so now we can create a new instance of our DeviceDTO object, and feed it whichever line we're looking for - in this case, we want the most recent connection, which looks like it will always be at index 0 of the JSON response. If that changes, you MUST define the length in the useEffect hook and save it in a new state variable, or you may run into issues
    const inv1 = new PlantInventoryDTO(data ? data[0] : {id: "00", userId: "00", plantType: "00", plantName: "00", zoneId: "00", quantity: "00"});
    console.log("Inventory final data: ", inv1);

    const inv2 = new PlantInventoryDTO(data ? data[1] : {id: "00", userId: "00", plantType: "00", plantName: "00", zoneId: "00", quantity: "00"});
    console.log("Inventory final data: ", inv2);

    const inv3 = new PlantInventoryDTO(data ? data[2] : {id: "00", userId: "00", plantType: "00", plantName: "00", zoneId: "00", quantity: "00"});
    console.log("Inventory final data: ", inv3);

    const inv4 = new PlantInventoryDTO(data ? data[3] : {id: "00", userId: "00", plantType: "00", plantName: "00", zoneId: "00", quantity: "00"});
    console.log("Inventory final data: ", inv4);

    const inv5 = new PlantInventoryDTO(data ? data[3] : {id: "00", userId: "00", plantType: "00", plantName: "00", zoneId: "00", quantity: "00"});
    console.log("Inventory final data: ", inv5);


    return(
        <>
        <div>
        <Table responsive="sm">
        <thead>
          <tr>
            <th></th>
            <th>{inv1.plantName}</th>
            <th>{inv2.plantName}</th>
            <th>{inv3.plantName}</th>
            <th>{inv4.plantName}</th>
            <th>{inv5.plantName}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Type</th>
            <td>{inv1.plantType}</td>
            <td>{inv2.plantType}</td>
            <td>{inv3.plantType}</td>
            <td>{inv4.plantType}</td>
            <td>{inv5.plantType}</td>
          </tr>
          <tr>
            <th>Quantity</th>
            <td>{inv1.quantity}</td>
            <td>{inv2.quantity}</td>
            <td>{inv3.quantity}</td>
            <td>{inv4.quantity}</td>
            <td>{inv5.quantity}</td>
          </tr>
          <tr>
            <th>Date planted</th>
            <td>Oct. 10 2025</td>
            <td>Oct. 12 2025</td>
            <td>Oct. 12 2025</td>
            <td>Oct. 12 2025</td>
            <td>Oct. 14 2025</td>
          </tr>
        </tbody>
      </Table>
    </div>
        </>
    )
}

export default Inventory;