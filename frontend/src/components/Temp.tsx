import "./Temp.css"

const Temp = () => {
    return <>
        <div className="grid-container">
            <div className="bg-red-400" style={{ gridArea: "box-1" }}>
                one bar side bar
            </div>
            <div className="bg-green-400" style={{ gridArea: "box-2" }}>
                main content
            </div>
            <div className="bg-blue-400" style={{ gridArea: "box-3" }}>
                one bar below bar
            </div>
        </div>
    </>
}

export default Temp;
