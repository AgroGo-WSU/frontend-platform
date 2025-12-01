import Table from 'react-bootstrap/Table';
import { useEffect, useState, useContext } from "react";
import "../../stylesheets/Inventory.css";
import axios from "axios";
import { AuthContext } from '../../hooks/UseAuth';
import { getAuth } from "firebase/auth";
import InventoryPlantItem from './InventoryPlantItem';

// calendar picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// type for new columns
class InputTypes {
  public fieldID: number;
  public plantName: string;
  public plantType: string;
  public plantQuantity: string;
  public plantDate: string;

  public constructor(plantInstance: { fieldID: number, plantName: string, plantType: string, plantQuantity: string, plantDate: string }) {
    this.fieldID = plantInstance.fieldID;
    this.plantName = "Plant name";
    this.plantType = "Plant type";
    this.plantQuantity = "Quantity";
    this.plantDate = "Date planted";
  }
}

// creating the class for the instances of the table we're expecting from our JSON response
class PlantInventoryDTO {
  public id: string;
  public userId: string;
  public plantName: string;
  public plantType: string;
  public quantity: string;
  public zoneId: string;
  public datePlanted: string;

  // this constructor MUST specify the individual members of the array/object from response.data or React will not accept it
  // this is a work around where you are basically "hard-coding" the object that you're expecting
  public constructor(dataInstance: { id: string, userId: string, plantType: string, plantName: string, zoneId: string, quantity: string, datePlanted: string }) {

    if (dataInstance != null) {
      this.id = dataInstance.id;
      this.userId = dataInstance.userId;
      this.plantType = dataInstance.plantType;
      this.plantName = dataInstance.plantName;
      this.zoneId = dataInstance.zoneId;
      this.quantity = dataInstance.quantity;
      this.datePlanted = dataInstance.datePlanted;
    } else {
      this.id = "null";
      this.userId = "null";
      this.plantType = "plant type";
      this.plantName = "plant name";
      this.zoneId = "not set";
      this.quantity = "quantity";
      this.datePlanted = "date planted";
    }
  }

  public getUserId(): string {
    return this.userId;
  }
}

function Inventory() {

  // this will be how we access the current user's info from Firebase
  const { currentUser } = useContext(AuthContext);

  // this is where state gets initialized and managed.
  const [data, setData] = useState<any[] | null>(null);
  const [error, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // this is to update what shows up on the page after a user adds or edits a new plant, and to tell the database to do POST or PATCH request
  const [sendingRequest, setPostRequest] = useState(false);

  // adding an editing function
  const [editing, setEditing] = useState(false);

  // adding field id state to keep track of which field is being edited
  const [columnBeingEdited, setColumnBeingEdited] = useState<string | null>(null);

  useEffect(() => {
    const getConnection = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not authenticated!');
        }

        const token = await user.getIdToken();
        setToken(token);

        const response = await axios.get("https://backend.agrogodev.workers.dev/api/user/plantInventory", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        console.log("SETTING INVENTORY DATA: ", response.data.data);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        console.log("Data for INVENTORY: ", data);
      }
    };

    getConnection();
    setPostRequest(false);

  }, [sendingRequest]);

  console.log("INVENTORY RESPONSE", data);

  const inv1 = new PlantInventoryDTO(data ? data[0] : { id: "00", userId: "00", plantType: "00", plantName: "00", zoneId: "00", quantity: "00", datePlanted: "00" });
  console.log("First entry for inventory final data: ", inv1);

  const [newEntry, setNewEntry] = useState(false);

  // state for changing inputs
  const [nameInput, setNameInput] = useState<string | null>(null);
  const [typeInput, setTypeInput] = useState<string | null>(null);
  const [quantityInput, setQuantityInput] = useState<string | null>(null);
  const [dateInput, setDateInput] = useState<string | null>(null); // string we send to backend

  // actual Date object used by the calendar picker
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // this is for setting whether to add the new plant input field
  function updateState() {
    setNewEntry(true);
    setEditing(false);
    setNameInput(null);
    setTypeInput(null);
    setQuantityInput(null);
    setDateInput(null);
    setSelectedDate(null);
    console.log("*********************************newEntry: ", newEntry);
  }

  // clear column and state
  function clearState() {
    setNewEntry(false);
    setNameInput(null);
    setTypeInput(null);
    setQuantityInput(null);
    setDateInput(null);
    setSelectedDate(null);
    console.log("*********************************newEntry: ", newEntry);
  }

  // also clears the previous state
  const saveChanges = async (event: any) => {
    console.log("EVENT TARGET FIRSTCHILD DATA ", event.target.firstChild.data);
    const eventTYPE = event.target.firstChild.data;
    const eventID = event.target.id;
    setNewEntry(false);
    setEditing(false);
    console.log("Setting state to false: ", newEntry);
    console.log("Here is the data: ", nameInput, " ", typeInput, " ", quantityInput, " ", dateInput);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User not authenticated!');
      }

      const userIdFB = user.uid;
      const token = await user.getIdToken();
      console.log("UserId from FIREBASE: ", userIdFB);

      if (eventTYPE === "Save entry") {

        const postData = {
          userId: userIdFB,
          plantType: typeInput,
          plantName: nameInput,
          zoneId: "1",
          quantity: quantityInput,
          datePlanted: dateInput
        };

        const sentResponse = await axios.post("https://backend.agrogodev.workers.dev/api/data/plantInventory", postData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        setPostRequest(true);
        console.log("Sending POST request for new data - here's the response ", sentResponse);
      } else if (eventTYPE === "Update entry") {

        const putData = {
          id: data![eventID].id,
          userId: userIdFB,
          plantType: typeInput,
          plantName: nameInput,
          zoneId: "1",
          quantity: quantityInput,
          datePlanted: dateInput
        };
        const sentResponse = await axios.put("https://backend.agrogodev.workers.dev/api/data/plantInventory", putData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        setPostRequest(true);
        console.log("Sending PUT request for new data - here's the response ", sentResponse);
      } else if (eventTYPE === "Delete entry") {

        console.log("!!! MAKING DELETE REQUEST");
        const sentResponse = await axios.delete("https://backend.agrogodev.workers.dev/api/data/plantInventory", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: {
            id: data![eventID].id
          }
        });

        setPostRequest(true);
        console.log("Sending DELETE request for new data - here's the response ", sentResponse);
      }

    } catch (error) {
      console.error('Error sending data:', error);
    } finally {
      console.log("Looks like the inventory POST request worked!");
    }

    setNameInput(null);
    setTypeInput(null);
    setQuantityInput(null);
    setDateInput(null);
    setSelectedDate(null);
  };

  // functions to save the various inputs to state
  function handleChangeName(event: any) {
    setNameInput(event.target.value);
    console.log("*********************************NAMEINPUT FUNCTION: ", nameInput);
  }

  function handleChangeType(event: any) {
    setTypeInput(event.target.value);
    console.log("*********************************TYPE FUNCTION: ", typeInput);
  }

  function handleChangeQuantity(event: any) {
    setQuantityInput(event.target.value);
    console.log("*********************************QUANTITY FUNCTION: ", quantityInput);
  }

  // date change from DatePicker 
  function handleChangeDate(date: Date | null) {
    setSelectedDate(date);

    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`; // adjust format if backend expects different
      setDateInput(formatted);
      console.log("*********************************DATE FUNCTION: ", formatted);
    } else {
      setDateInput(null);
    }
  }

  function deleteChanges(event: any) {
    console.log(event.target);
  }

  function updateEntry(event: any) {
    setEditing(true);
    const columnID = event.target.id;
    setColumnBeingEdited(columnID);
    setNameInput(data![columnID].plantName);
    setTypeInput(data![columnID].plantType);
    setQuantityInput(data![columnID].quantity);
    setDateInput(data![columnID].datePlanted);
    setSelectedDate(
      data![columnID].datePlanted
        ? new Date(data![columnID].datePlanted)
        : null
    );
  }

  // arrays which will be mapped to table values
  let nameData: any[] = [];
  let typeData: any[] = [];
  let quantityData: any[] = [];
  let dateData: any[] = [];

  // build out the arrays for mapping
  if (data != null) {
    for (let i = 0; i < data.length; i++) {
      const nameID = [data[i].plantName, i];
      nameData.push(nameID);

      const typeID = [data[i].plantType, i];
      typeData.push(typeID);

      const quantityID = [data[i].quantity, i];
      quantityData.push(quantityID);

      const dateID = [data[i].datePlanted, i];
      dateData.push(dateID);
    }
  }

  return (
    <>
      <div className="background-container">
        <div className="form-container">
          <form>
            {newEntry === false ? (
              <button className="add-enabled" onClick={updateState}>
                Add a plant
              </button>
            ) : (
              <button className="add-disabled">
                Save entry to add another plant
              </button>
            )}
            <div className="table-container">
              <div className="table-row">
                <div className="table-heading">Plant name</div>
                {editing === false
                  ? nameData.map(item => (
                    <div className="table-data" key={`name-${item[1]}`}>
                      <div id={item[1]}>
                        <InventoryPlantItem value={item[0]} />
                      </div>
                      <button
                        id={item[1]}
                        className="edit-enabled"
                        onClick={updateEntry}
                      >
                        Edit this entry
                      </button>
                    </div>
                  ))
                  : nameData.map(item =>
                    item[1].toString() === columnBeingEdited ? (
                      <div
                        className="table-data"
                        key={`name-edit-${item[1]}`}
                      >
                        <div id={item[1]}>
                          <input
                            type="text"
                            name="edit_change"
                            value={nameInput ?? ""}
                            onChange={handleChangeName}
                          />
                        </div>
                        <button
                          className="edit-enabled"
                          id={item[1]}
                          onClick={saveChanges}
                        >
                          Update entry
                        </button>
                        <button
                          className="edit-delete"
                          id={item[1]}
                          onClick={saveChanges}
                        >
                          Delete entry
                        </button>
                      </div>
                    ) : (
                      <div className="table-data" key={`name-${item[1]}`}>
                        <div id={item[1]}>
                          <InventoryPlantItem value={item[0]} />
                        </div>
                        <button
                          id={item[1]}
                          className="edit-enabled"
                          onClick={updateEntry}
                        >
                          Edit this entry
                        </button>
                      </div>
                    )
                  )}

                {newEntry === true ? (
                  <div className="table-data">
                    <label htmlFor="input_name">Plant name</label>
                    {newEntry === true ? (
                      <button
                        id="new_entry"
                        className="small-button"
                        onClick={saveChanges}
                      >
                        Save entry
                      </button>
                    ) : (
                      <></>
                    )}
                    {newEntry === true ? (
                      <button className="small-button" onClick={clearState}>
                        Cancel
                      </button>
                    ) : (
                      <></>
                    )}
                    <br />
                    <input
                      type="text"
                      name="input_name"
                      value={nameInput ?? ""}
                      onChange={handleChangeName}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div className="table-row">
                <div className="table-heading">Type</div>
                {editing === false
                  ? typeData.map(item => (
                    <div className="table-data" key={`type-${item[1]}`}>
                      <div id={item[1]}>
                        <InventoryPlantItem value={item[0]} />
                      </div>
                    </div>
                  ))
                  : typeData.map(item =>
                    item[1].toString() === columnBeingEdited ? (
                      <div
                        className="table-data"
                        key={`type-edit-${item[1]}`}
                      >
                        <div id={item[1]}>
                          <input
                            type="text"
                            name="edit_change"
                            value={typeInput ?? ""}
                            onChange={handleChangeType}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="table-data" key={`type-${item[1]}`}>
                        <div id={item[1]}>
                          <InventoryPlantItem value={item[0]} />
                        </div>
                      </div>
                    )
                  )}

                {newEntry === true ? (
                  <div className="table-data">
                    <label htmlFor="input_name">Plant type</label>
                    <br />
                    <input
                      type="text"
                      name="input_name"
                      value={typeInput ?? ""}
                      onChange={handleChangeType}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div className="table-row">
                <div className="table-heading">Quantity</div>
                {editing === false
                  ? quantityData.map(item => (
                    <div className="table-data" key={`qty-${item[1]}`}>
                      <div id={item[1]}>
                        <InventoryPlantItem value={item[0]} />
                      </div>
                    </div>
                  ))
                  : quantityData.map(item =>
                    item[1].toString() === columnBeingEdited ? (
                      <div
                        className="table-data"
                        key={`qty-edit-${item[1]}`}
                      >
                        <div id={item[1]}>
                          <input
                            type="number"
                            min="0"
                            max="999999"
                            name="edit_change"
                            value={quantityInput ?? ""}
                            onChange={handleChangeQuantity}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="table-data" key={`qty-${item[1]}`}>
                        <div id={item[1]}>
                          <InventoryPlantItem value={item[0]} />
                        </div>
                      </div>
                    )
                  )}

                {newEntry === true ? (
                  <div className="table-data">
                    <label htmlFor="input_name">Quantity</label>
                    <br />
                    <input
                      type="number"
                      min="0"
                      max="999999"
                      name="input_name"
                      value={quantityInput ?? ""}
                      onChange={handleChangeQuantity}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div className="table-row">
                <div className="table-heading">Date planted</div>
                {editing === false
                  ? dateData.map(item => (
                    <div className="table-data" key={`date-${item[1]}`}>
                      <div id={item[1]}>
                        <InventoryPlantItem value={item[0]} />
                      </div>
                    </div>
                  ))
                  : dateData.map(item =>
                    item[1].toString() === columnBeingEdited ? (
                      <div
                        className="table-data"
                        key={`date-edit-${item[1]}`}
                      >
                        <div id={item[1]}>
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleChangeDate}
                            className="date-input"
                            placeholderText="Select date"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="table-data" key={`date-${item[1]}`}>
                        <div id={item[1]}>
                          <InventoryPlantItem value={item[0]} />
                        </div>
                      </div>
                    )
                  )}

                {newEntry === true ? (
                  <div className="table-data">
                    <label htmlFor="input_name">Date planted</label>
                    <br />
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleChangeDate}
                      placeholderText="Select date"
                      className="date-input"
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Inventory;
