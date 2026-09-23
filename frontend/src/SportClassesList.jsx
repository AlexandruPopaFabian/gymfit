import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SportClassesList.css";

function SportClassesList() {
    const [sportclasses, setSportClasses] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5275/odata/SportClasses")
            .then(res => res.json())
            .then(data => setSportClasses(data.value));
    }, []);

    return (
        <div className="classes-page">
            <h2>Sport Classes</h2>

            <div className="actions">
                <Link to="/sportclasses/add" className="btn small">Add</Link>
                <Link to="/sportclasses/delete" className="btn small danger">Delete</Link>
            </div>

            <ul className="class-list">
                {sportclasses.map(sc => (
                    <li key={sc.Id}>
                        {sc.Id}. {sc.Name} — {sc.Description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SportClassesList;

