// import "../assets/plant.png"
import "../stylesheets/ZoneCard.css";


function ZoneCard() {

    return (
        <div className="zone-card-container">
            <img className="circle-img" src="../src/assets/plant.png"></img>
            <div className="caption">Carrots, zinnias, etc</div>
        </div>
    )
}

export default ZoneCard;