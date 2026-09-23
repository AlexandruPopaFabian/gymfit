import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteTrainer.css"; // 💡 Importăm noul stil dedicat

function DeleteTrainer() {
    const [trainers, setTrainers] = useState([]);
    const [deleteId, setDeleteId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5275/odata/Trainers")
            .then(res => res.json())
            .then(data => setTrainers(data.value || []))
            .catch(err => console.error("Error fetching trainers:", err));
    }, []);

    const deleteTrainer = () => {
        if (!deleteId) return;

        const token = localStorage.getItem("token");
        if (window.confirm("Are you sure you want to delete this trainer? This action cannot be undone.")) {
            fetch(`http://localhost:5275/odata/Trainers(${deleteId})`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(() => {
                navigate("/trainers");   // 🔥 Redirect instant în listă
            }).catch(err => console.error("Error deleting trainer:", err));
        }
    };

    return (
        <div className="delete-trainer-container">
            <h2>Delete Trainer</h2>

            <div className="form-group">
                <label>Select Trainer to Remove:</label>
                <select
                    value={deleteId}
                    onChange={e => setDeleteId(e.target.value)}
                    className="form-select"
                >
                    <option value="">Select trainer...</option>
                    {trainers.map(t => (
                        <option key={t.Id || t.id} value={t.Id || t.id}>
                            ID: {t.Id || t.id} — {t.Name || t.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={deleteTrainer}
                disabled={!deleteId}
                className="delete-btn"
            >
                Delete Trainer
            </button>
        </div>
    );
}

export default DeleteTrainer;