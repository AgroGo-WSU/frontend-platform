import "../../stylesheets/Inventory.css";


interface InventoryValue {
    value: string;
}

// you will need to accept the value of whatever is being sent here
// make the first few say "empty" if passed nothing, but say the value if passed the value
function InventoryPlantItem ({ value }: InventoryValue) {


    return(
        <div>
            <td className="plant-data-displays">{value}</td>
        </div>
    )
}

export default InventoryPlantItem;