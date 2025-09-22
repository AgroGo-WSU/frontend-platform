import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './stylesheets/App.css'
import MainTitle from './components/MainTitle'
import LeftMenu from './components/LeftMenu'
import TopNav from './components/TopNav'
import ZoneCard from './components/ZoneCard';
import WeatherCard from './components/WeatherCard';
import SmallTitle from './components/SmallTitle';

// useEffect and useState are React hooks - useState manages state, and useEffect allows us to sync to the external database
import React, { useEffect, useState } from "react";
import axios from "axios";

// creating the class for the instances of the table we're expecting from our JSON response
class DeviceDTO {
  private id: string;
  private device_id: string;
  private received_at: string;

  // this constructor MUST specify the individual members of the array/object from response.data or React will not accept it
  // this is a work around where you are basically "hard-coding" the object that you're expecting
  public constructor(dataInstance: {id: string, device_id: string, received_at: string}) {

    this.id = dataInstance.id;
    this.device_id = dataInstance.device_id;
    this.received_at = dataInstance.received_at;

  }

  // will go back later to add the other getters - I only want the timestamp for the received time right now
  public getReceivedAt(): string {
    return this.received_at;
  }
}


function App() {

    // this is where state gets initialized and managed. Even in TS, you can let these hooks infer the type (and here, you should let useState infer the type of data) but I've set the type for the message state
    const [data, setData] = useState(null);
    const [error, setMessage] = useState<string | null>(null);

    // you MUST use the useEffect and useState hooks for this- useEffect is crucial in how the DOM renders data on screen and when you can pull data from where, and useState is how the data gets saved once useEffect is called - ask Madeline if you would like clarification on why this happens
    useEffect(() => {
        // this is the axios GET response - POST requests work similarly, where you must specify the exact endpoint and use a try/catch
        axios
            .get("https://backend.agrogodev.workers.dev/api/data/Raspi001")
            .then((response) => {
              setData(response.data); // this sets the state - response is of type <AxiosResponse> and calling response.data gives us the actual array of arrays that make up the individual instances of our db table
              console.log(response.data);
              setMessage("Success!");
            })
            .catch(() => {
              setMessage("Failure :(");
            });
    },[]);

    // so now we can create a new instance of our DeviceDTO object, and feed it whichever line we're looking for - in this case, we want the most recent connection, which looks like it will always be at index 0 of the JSON response. If that changes, you MUST define the length in the useEffect hook and save it in a new state variable, or you may run into issues
    const last_connection = new DeviceDTO(data ? data[0] : {id: "00", device_id: "00", received_at: "Loading..."});
    console.log("Last connection: ", last_connection.getReceivedAt());

    
  return (
    <div className="dashboard">
      <div className="bottom-blank"></div>
      <div className="left-menu"><LeftMenu /></div>
      <div className="right-blank"></div>
      <div className="top-nav"><TopNav /></div>
      <div className="welcome-title"><MainTitle name="AgroGo"/></div>
      <div className="zones"><div className="small-title-fixer"><SmallTitle title="Zones"/></div>
        <div className="zone-flex-container">
          <ZoneCard plants="Carrots and cucumbers"        image="../src/assets/zone-images/vegetable.png"/>
          <ZoneCard plants="Cosmos and petunias"          image="../src/assets/zone-images/flower.png"/>
          <ZoneCard plants="Peppers, lavender, kale"      image="../src/assets/zone-images/plant.png"/>
          <div className="last-connect">Last: { last_connection.getReceivedAt() }</div> {/* Now we can display our db data on the homepage */}
          </div>
        </div>
      <div className="weather"><div className="small-title-fixer"><SmallTitle title="Weather"/></div>
        <div className="weather-flex-container">
          <WeatherCard day="Today"      date="Sept. 22"   weather="Sunny with a high of 78"             image="../src/assets/weather-images/sun.png"/>
          <WeatherCard day="Tomorrow"   date="Sept. 23"   weather="Partially cloudy with a high of 71"  image="../src/assets/weather-images/partial-clouds.png"/>
          <WeatherCard day="Wednesday"  date="Sept. 24"   weather="Rainy with a high of 67"             image="../src/assets/weather-images/rain.png"/>
          <WeatherCard day="Thursday"   date="Sept. 25"   weather="Rainy with a high of 71"             image="../src/assets/weather-images/rain.png"/>
          <WeatherCard day="Friday"     date="Sept. 26"   weather="Sunny with a high of 75"             image="../src/assets/weather-images/sun.png"/>
          <WeatherCard day="Saturday"   date="Sept. 27"   weather="Sunny with a high of 77"             image="../src/assets/weather-images/sun.png"/>
          <WeatherCard day="Sunday"     date="Sept. 28"   weather="Partially cloudy with a high of 72"  image="../src/assets/weather-images/partial-clouds.png"/>
        </div>
      </div>
      <div className="footer">copyright AgroGo 2025</div>
    </div>
  )
}

export default App
