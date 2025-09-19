import "../stylesheets/LeftMenu.css"


function LeftMenu() {

    return (
        <div className="left-menu-container">
            <div>I'm the left menu! My component size is set to be a variable 12% of the available screen width, with a minimum of 100px. My space in the grid is being used as "fit-content(120px)" so I have an effective max width of 120, even though I'll never actually get that big.</div>
        </div>
    )
}

export default LeftMenu;