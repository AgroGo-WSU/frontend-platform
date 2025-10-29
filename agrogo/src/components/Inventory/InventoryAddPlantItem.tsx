

interface InventoryAddValue {
    add_value_type: string;
}


// you will need to accept the value of whatever is being sent here
// these need to be forms that you add the values to
function InventoryAddPlantItem ({ add_value_type }: InventoryAddValue) {


    return(
        <div>
            <td>
                <label htmlFor="add_value">{ add_value_type }</label><br />
                <input type="text" id="add_value" name="add_value"></input>
            </td>
        </div>
    )
}

export default InventoryAddPlantItem;