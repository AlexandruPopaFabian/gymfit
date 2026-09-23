import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddSportClass.css";

function AddSportClass() {
    const [name, setName] = useState("");
    const [duration, setDuration] = useState(60);
    const [level, setLevel] = useState("Beginner");
    const [trainingType, setTrainingType] = useState("");
    const [equipment, setEquipment] = useState("");
    const [trainerId, setTrainerId] = useState("");

    const [trainers, setTrainers] = useState([]);
    const [nameError, setNameError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5275/odata/Trainers")
            .then((res) => res.json())
            .then((data) => {
                const trainerList = data.value || data;
                setTrainers(trainerList);
                if (trainerList.length > 0) {
                    const firstId = trainerList[0].Id || trainerList[0].id;
                    setTrainerId(firstId);
                }
            })
            .catch((err) => console.error("Error fetching trainers:", err));
    }, []);

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (!/^[A-Za-z ]*$/.test(value)) {
            setNameError("The class name can contain only letters");
            return;
        }
        setNameError("");
        setName(value);
    };

    const addClass = () => {
        const token = localStorage.getItem("token");

        // Ne asigurăm că trainerId este transformat într-un număr întreg valid
        const parsedId = parseInt(trainerId);
        const trainersPayload = !isNaN(parsedId) && parsedId > 0 ? [{ Id: parsedId }] : [];

        fetch("http://localhost:5275/odata/SportClasses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                Name: name,
                Duration: parseInt(duration) || 60,
                Level: level || "Beginner",
                TrainingType: trainingType || "",
                Equipment: equipment || "",
                Trainers: trainersPayload
            })
        }).then(async (res) => {
            if (res.ok) {
                navigate("/sportclasses");
            } else {
                const errData = await res.json();
                console.error("400 Error details:", errData);
                alert("Error 400: Check browser console (F12) for exact field validation errors.");
            }
        });
    };

    return (
        <div className="add-class-container">
            <h2>Add Sport Class</h2>

            <div className="form-group">
                <label>Class Name:</label>
                <input
                    type="text"
                    placeholder="e.g. Pilates, CrossFit"
                    value={name}
                    onChange={handleNameChange}
                    className="form-input"
                />
                {nameError && <p className="field-error">⚠️ {nameError}</p>}
            </div>

            <div className="form-group">
                <label>Difficulty Level:</label>
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="form-input"
                >
                    <option value="Beginner">Beginner</option>
                    <option value="Medium">Medium</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>

            <div className="form-group">
                <label>Training Type:</label>
                <input
                    type="text"
                    placeholder="e.g. Cardio, Strength"
                    value={trainingType}
                    onChange={(e) => setTrainingType(e.target.value)}
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Required Equipment:</label>
                <input
                    type="text"
                    placeholder="e.g. Dumbbells, Yoga Mat, None"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Assign Trainer:</label>
                <select
                    value={trainerId}
                    onChange={(e) => setTrainerId(e.target.value)}
                    className="form-input"
                >
                    {trainers.length === 0 ? (
                        <option value="">No trainers available</option>
                    ) : (
                        trainers.map((t) => (
                            <option key={t.Id || t.id} value={t.Id || t.id}>
                                {t.Name || t.name}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <button onClick={addClass} className="submit-btn">
                Create Class
            </button>
        </div>
    );
}

export default AddSportClass;