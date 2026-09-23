import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteSportClass.css"; // 💡 Importăm noul fișier CSS dedicat

function DeleteSportClass() {
    const [sportclasses, setSportClasses] = useState([]);
    const [deleteId, setDeleteId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5275/odata/SportClasses")
            .then(res => res.json())
            .then(data => setSportClasses(data.value || []))
            .catch(err => console.error("Error fetching sport classes:", err));
    }, []);

    const deleteClass = () => {
        if (!deleteId) return;

        // 🔥 1. Extrage token-ul salvat la login
        const token = localStorage.getItem("token");

        if (window.confirm("Are you sure you want to delete this sport class? It will be permanently removed from the catalog.")) {
            fetch(`http://localhost:5275/odata/SportClasses(${deleteId})`, {
                method: "DELETE",
                // 🔥 2. Adaugă headers cu token-ul de autorizare
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                if (res.ok) {
                    navigate("/sportclasses");
                } else {
                    alert("Failed to delete class. Make sure you are authorized.");
                }
            }).catch(err => console.error("Error deleting class:", err));
        }
    };

    return (
        <div className="delete-class-container">
            <h2>Delete Sport Class</h2>

            <div className="form-group">
                <label>Select Class to Remove:</label>
                <select
                    value={deleteId}
                    onChange={e => setDeleteId(e.target.value)}
                    className="form-select"
                >
                    <option value="">Select class...</option>
                    {sportclasses.map(sc => (
                        <option key={sc.Id || sc.id} value={sc.Id || sc.id}>
                            ID: {sc.Id || sc.id} — {sc.Name || sc.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={deleteClass}
                disabled={!deleteId}
                className="delete-btn"
            >
                Delete Class
            </button>
        </div>
    );
}

export default DeleteSportClass;