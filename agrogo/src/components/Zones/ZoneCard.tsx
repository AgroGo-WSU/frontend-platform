import "../../stylesheets/ZoneCard.css";

interface ZoneCardProps {
  /* These are the props that must be passed when this card is rendered on the parent component - go to App.tsx to see how these props are being passed to this component */
  /* Later, these will be passed programmatically via mapping or other function, but for now, they are hard-coded in the parent component */
  /* The description of which plants are in this zone, the the image file */
  /* The string for image file must be in this form: "../src/assets/zone-images/type.png" where "type" can be replaced by "flower", "plant", or "vegetable" */
  plants: string;
  image: string;
}


function ZoneCard({ plants, image }: ZoneCardProps) {

    return (
        <div className="zone-card-container">
            <img className="circle-img" src={ image }></img>
            <div className="caption">{ plants }</div>
        </div>
    )
}

export default ZoneCard;