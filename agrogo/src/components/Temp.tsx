import { useEffect, useState, useContext } from "react";
import "../stylesheets/Temp.css";
import axios from "axios";
import { AuthContext } from '../hooks/UseAuth';
import { getAuth } from "firebase/auth";

// creating the class for the instances of the table we're expecting from our JSON response
class TempDTO {
  public rowid: string;
  public userID: string;
  public type: string;
  public received_at: string;
  public value: string;

  // this constructor MUST specify the individual members of the array/object from response.data or React will not accept it
  // this is a work around where you are basically "hard-coding" the object that you're expecting
  public constructor(dataInstance: {  rowid: string, userID: string, type: string, received_at: string, value: string}) {

    this.rowid = dataInstance.rowid;
    this.userID = dataInstance.userID;
    this.type = dataInstance.type;
    this.received_at = dataInstance.received_at;
    this.value = dataInstance.value;
  }

  // will go back later to add the other getters - I only want the name for the received time right now
  public getValue(): string {
    return this.value;
  }
}

function Temp() {

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
      
        const response = await axios.get("https://backend.agrogodev.workers.dev/api/user/tempAndHumidity", {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                }
            });

          console.log("SETTING TEMP DATA: ", response.data.data);
          setData(response.data.data); // this sets the state - response is of type <AxiosResponse> and calling response.data gives us the actual array of arrays that make up the individual instances of our db table
          } catch(error){
            console.error('Error fetching data:', error);
          } finally {
            console.log("Data for TEMP: ", data);
      }
    };

    getConnection();

    },[]);

    console.log("TEMP RESPONSE", data);

    // so now we can create a new instance of our DeviceDTO object, and feed it whichever line we're looking for - in this case, we want the most recent connection, which looks like it will always be at index 0 of the JSON response. If that changes, you MUST define the length in the useEffect hook and save it in a new state variable, or you may run into issues
    const temp = new TempDTO(data ? data[0] : {rowid: "00", userID: "00", type: "00", received_at: "00", value: "00"});
    console.log("Temp final data: ", temp);

    // not sure if we'll need this
    // function getTimeChecked() {
    //   const time_milli = new Date();
    //   const time_raw = time_milli.toISOString();
    //   const full_time = time_raw.split("T")[1];
    //   const short_time = full_time.split(":");
    //   const hour = short_time[0];
    //   const minute = short_time[1];
    //   const final_time = hour + ":" + minute;

    //   return final_time;
    // }

    // const time_checked = getTimeChecked();
    const temp_reading = temp.value;
    console.log("temp_reading value: ", temp_reading);



  return (
    <div className="temp-container">
        <div className="temp-reading">{temp_reading != "00" ? <div className="t-read">Current temperature: {temp_reading}</div> : <div className="t-read">Current temperature: not found</div>}</div>
    </div>
  );
}

export default Temp;
