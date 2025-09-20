import "../stylesheets/SmallTitle.css"

function SmallTitle({ title }: { title: string }) {

    return (
        <div className="small-title-container">{ title }</div>
    );
}

export default SmallTitle;