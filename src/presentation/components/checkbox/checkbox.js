import '../../pages/events/events_page.css'
const { default: React } = require("react");
const { useState } = require("react");

function CheckBox(props) {
    const [isEnabled, setIsEnabled] = useState(props.isEnabled);

    return (
        <div className="checkbox"
        >
            <input
                style={{cursor:"pointer"}}
                type="checkbox"
                checked={isEnabled}
                onChange={() => {
                    setIsEnabled(!isEnabled);
                    props.onChange();
                }}
            />
        </div>
    );
}

export default CheckBox;