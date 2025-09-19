import "../stylesheets/MainTitle.css"

// in TS React, you have to define the type of your props as ({ variable-name }: { variable-name: type })
// this value is defined in whichever parent component calls this component
function MainTitle({ name }: { name: string }) {

    return (
        <div className="main-title-container">
            {/* now we can display the variable on the component */}
            <h1>Welcome, {name}</h1>
            <p>I need to be vertically centered in my div womp womp :(</p>
        </div>
    )
}

export default MainTitle;