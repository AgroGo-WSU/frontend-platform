import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function ZoneEdit(props) {

    console.log("Example of the props thing - this is the id: ", props.data[0].id);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Manage your zones
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4></h4>
        
        <div>{props.data.length ? props.data.map(item => (
            <div className="zones">
                <div 
                    id={item.id}>{"Zone " + item.zoneNumber}
                </div>
                <div id={item.id}>

                </div>
            </div>)) : <></>
        }</div>


          {/* <div className="zone">
            {editing === false ? typeData.map(item => (
              <div className="table-data"><div id={item[1]}>
              value={item[0]}</div></div>)) :
              
              typeData.map(item => ( item[1].toString() === columnBeingEdited ? 
              <div className="table-data"><div id={item[1]}><input type="text" name="edit_change" value={typeInput} onChange={handleChangeType}></input></div></div> : 
              <div className="table-data"><div id={item[1]}><InventoryPlantItem value={item[0]} /></div></div>
            ))}

            {newEntry === true ? (
              <div className="table-data">
                <label htmlFor="input_name">Plant type</label><br />
                <input type="text" name="input_name" onChange={handleChangeType}></input>
              </div>
            ) : <></>}
          </div> */}

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ZoneEdit;