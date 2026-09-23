import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TrainersList.css";

function TrainersList() {
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5275/odata/Trainers")
            .then(res => res.json())
            .then(data => setTrainers(data.value));
    }, []);

    return (
        <div className="trainers-page">
            <h2>Trainers</h2>

            <div className="actions">
                <Link to="/trainers/add" className="btn small">Add</Link>
                <Link to="/trainers/delete" className="btn small danger">Delete</Link>
            </div>

            <ul className="trainer-list">
                {trainers.map(t => (
                    <li key={t.Id}>
                        {t.Id}. {t.Name} — {t.Specialization}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TrainersList;
