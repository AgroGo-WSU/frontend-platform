import '../stylesheets/StatsContainer.css'
import Humidity from './Humidity';
import Temp from './Temp';

// dynamically render zone images using state to hold the image name suffix
// use the map function to render the zone images on screen along with the descriptions


function StatsContainer() {


    return (
        <div className="stats-container-top">
            <div className="hum"><Humidity /></div>
            <div className="temp"><Temp /></div>
        </div>
    )
}

export default StatsContainer;