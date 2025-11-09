// src/components/ConnectivityStatus.tsx
import { useEffect, useState, useContext } from "react";
import "../stylesheets/ConnectivityStatus.css";
import axios from "axios";
import { AuthContext } from '../hooks/UseAuth';
import { getAuth } from "firebase/auth";
import moment from 'moment-timezone';


// creating the class for the instances of the table we're expecting from our JSON response
class DeviceDTO {
  public id: string;
  public createdAt: string;
  public location: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public raspiMac: string;


  // this constructor MUST specify the individual members of the array/object from response.data or React will not accept it
  // this is a work around where you are basically "hard-coding" the object that you're expecting
  public constructor(dataInstance: {  id: string, createdAt: string, location: string, email: string, firstName: string, lastName: string, raspiMac: string}) {

    if(dataInstance != null) {
      this.id = dataInstance.id;
      this.createdAt = dataInstance.createdAt;
      this.location = dataInstance.location;
      this.email = dataInstance.email;
      this.firstName = dataInstance.firstName;
      this.lastName = dataInstance.lastName;
      this.raspiMac = dataInstance.raspiMac;
    } else {
        this.id = "null";
        this.createdAt = "null";
        this.location = "null";
        this.email = "null";
        this.firstName = "null";
        this.lastName = "null";
        this.raspiMac = "null"; 
    }


  }

  // will go back later to add the other getters - I only want the name for the received time right now
  public getName(): string {
    return this.firstName;
  }
}

function ConnectivityStatus() {

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
      
        const response = await axios.get("https://backend.agrogodev.workers.dev/api/user/user", {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });

          console.log("SETTING DATA: ", response.data.data);
          setData(response.data.data); // this sets the state - response is of type <AxiosResponse> and calling response.data gives us the actual array of arrays that make up the individual instances of our db table
          } catch(error){
            console.error('Error fetching data:', error);
          } finally {
            console.log("DATA at FINALLY: ", data);
      }
    };

    getConnection();

    },[]);

    console.log("RESPONSE", data);

    // so now we can create a new instance of our DeviceDTO object, and feed it whichever line we're looking for - in this case, we want the most recent connection, which looks like it will always be at index 0 of the JSON response. If that changes, you MUST define the length in the useEffect hook and save it in a new state variable, or you may run into issues
    const last_connection = new DeviceDTO(data ? data[0] : {id: "00", createdAt: "00", location: "00", email: "00", firstName: "00", lastName: "00", raspiMac: "00"});
    console.log("Final data: ", last_connection);

    // get the time with moment.js formatting
    const timezone = new Date();
    const string_date = timezone.toISOString();
    const time_checked_moment = moment(string_date);
    const time_checked = time_checked_moment.tz('America/New_York').format('h:mm A');

    let status = "offline ";
    if((last_connection.id != "00") && (last_connection.id != null)) {
      status = "online ";
    }


  return (
    <div className="connect-container">
    <div className="device-line"><div className="your-device">Your device is</div> <div>{status === "online " ? <div className="status-online">{status}<img src={"../../src/assets/connected.svg"} width="10px"></img></div> : <div className="status-onffline">{status}<img src={"../../src/assets/disconnected.svg"} width="10px"></img></div>}</div></div>
    <div className="checked-line"><div> last checked at {time_checked}</div></div>
    </div>
  );
}

export default ConnectivityStatus;
