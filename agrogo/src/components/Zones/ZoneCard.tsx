import "../../stylesheets/ZoneCard.css";

interface ZoneCardProps {
  /* These are the props that must be passed when this card is rendered on the parent component - go to App.tsx to see how these props are being passed to this component */
  /* Later, these will be passed programmatically via mapping or other function, but for now, they are hard-coded in the parent component */
  /* The description of which plants are in this zone, the the image file */
  /* The string for image file must be in this form: "../src/assets/zone-images/type.png" where "type" can be replaced by "flower", "plant", or "vegetable" */
  plants: string;
  image: string;
}

// use state to decide whether this is a flower, vegetable or plant image
// write if/else statement to decide which image they get

function ZoneCard({ plants, image }: ZoneCardProps) {

    let imageURL = " ";

    if(image === "Vegetable") {
        imageURL = "../src/assets/zone-images/vegetable.png";
    } else if(image === "Flowers") {
        imageURL = "../src/assets/zone-images/flower.png";
    } else {
        imageURL = "../src/assets/zone-images/plant.png"
    }

    console.log("555555555555555555555555555555", image);

    return (
        <div className="zone-card-container">
            <img className="circle-img" src={ imageURL }></img>
            <div className="caption">{ plants }</div>
        </div>
    )
}

export default ZoneCard;