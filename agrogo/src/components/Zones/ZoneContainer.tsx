import '../../stylesheets/ZoneContainer.css';
import ZoneCard from './ZoneCard';

function ZoneContainer() {

    return (
        <div>
        <div className="zone-flex-container d-flex flex-column flex-md-row justify-content-between">
          <ZoneCard plants="Carrots and cucumbers"        image="../src/assets/zone-images/vegetable.png"/>
          <ZoneCard plants="Cosmos and petunias"          image="../src/assets/zone-images/flower.png"/>
          <ZoneCard plants="Peppers, lavender, kale"      image="../src/assets/zone-images/plant.png"/>
        </div>
        </div>
    )
}

export default ZoneContainer;