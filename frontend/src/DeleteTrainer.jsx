import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DeleteTrainer() {
    const [trainers, setTrainers] = useState([]);
    const [deleteId, setDeleteId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5275/odata/Trainers")
            .then(res => res.json())
            .then(data => setTrainers(data.value));
    }, []);

    const deleteTrainer = () => {
        fetch(`http://localhost:5275/odata/Trainers(${deleteId})`, {
            method: "DELETE"
        }).then(() => {
            navigate("/trainers");   // 🔥 redirect instant
        });
    };

    return (
        <div>
            <h2>Delete Trainer</h2>

            <select value={deleteId} onChange={e => setDeleteId(e.target.value)}>
                <option value="">Select trainer</option>
                {trainers.map(t => (
                    <option key={t.Id} value={t.Id}>
                        {t.Id} — {t.Name}
                    </option>
                ))}
            </select>

            <button onClick={deleteTrainer}>Delete</button>
        </div>
    );
}

export default DeleteTrainer;
