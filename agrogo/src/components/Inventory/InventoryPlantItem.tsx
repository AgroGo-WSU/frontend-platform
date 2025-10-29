

interface InventoryValue {
    value: string;
}

// you will need to accept the value of whatever is being sent here
// make the first few say "empty" if passed nothing, but say the value if passed the value
function InventoryPlantItem ({ value }: InventoryValue) {


    return(
        <div>
            <td>{value}</td>
        </div>
    )
}

export default InventoryPlantItem;