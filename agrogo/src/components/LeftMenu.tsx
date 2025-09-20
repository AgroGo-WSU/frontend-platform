import "../stylesheets/LeftMenu.css";
import SmallTitle from "./SmallTitle";


function LeftMenu() {

    return (
        <div className="left-menu-container">
            <div className="links-container">
            <SmallTitle title="Menu"/>
            <div className="links">View inventory</div>
            <div className="links">Go to account</div>
            <div className="links">Another link</div>
            </div>
        </div>
    )
}

export default LeftMenu;