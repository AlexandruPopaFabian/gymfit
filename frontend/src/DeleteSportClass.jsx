import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function DeleteSportClass() {
    const [sportclasses, setSportClasses] = useState([]);
    const [deleteId, setDeleteId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5275/odata/SportClasses")
            .then(res => res.json())
            .then(data => setSportClasses(data.value));
    }, []);

    const deleteClass = () => {
        fetch(`http://localhost:5275/odata/SportClasses(${deleteId})`, {
            method: "DELETE"
        }).then(() => {
            navigate("/sportclasses");
        });
    };

    return (
        <div>
            <h2>Delete Sport Class</h2>

            <select value={deleteId} onChange={e => setDeleteId(e.target.value)}>
                <option value="">Select class</option>
                {sportclasses.map(sc => (
                    <option key={sc.Id} value={sc.Id}>
                        {sc.Id} — {sc.Name}
                    </option>
                ))}
            </select>

            <button onClick={deleteClass}>Delete</button>
        </div>
    );
}

export default DeleteSportClass;
