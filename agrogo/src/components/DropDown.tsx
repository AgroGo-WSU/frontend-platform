import Dropdown from 'react-bootstrap/Dropdown';

interface DropDownProps {
    buttonName: string, 
    choice1: string,
    choice2: string, 
    choice3: string, 
}

function DropDown(props) {


  return (
    <div className="drop-down-zone-choice">
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Choose plant type
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item><button className="vegetable-button" id={"1_" + index} onClick={chooseZoneType}>Vegetables</button></Dropdown.Item>
        <Dropdown.Item><button className="flower-button" id={"1_" + index} onClick={chooseZoneType}>Flowers</button></Dropdown.Item>
        <Dropdown.Item><button className="general-button" id={"1_" + index} onClick={chooseZoneType}>Mixed/other</button></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    </div>
  );
}

export default DropDown;