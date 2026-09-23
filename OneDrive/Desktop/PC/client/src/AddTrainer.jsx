import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTrainer.css";

function AddTrainer() {
    const [name, setName] = useState("");
    const [spec, setSpec] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClassIds, setSelectedClassIds] = useState([]);

    const [nameError, setNameError] = useState("");
    const [specError, setSpecError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5275/odata/SportClasses")
            .then(res => res.json())
            .then(data => setAvailableClasses(data.value || []))
            .catch(err => console.error("Error fetching classes:", err));
    }, []);

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (!/^[A-Za-z ]*$/.test(value)) {
            setNameError("Name can contain only letters");
            return;
        }
        setNameError("");
        setName(value);
    };

    const handleSpecChange = (e) => {
        const value = e.target.value;
        if (!/^[A-Za-z ]*$/.test(value)) {
            setSpecError("Specialisation can contain only letters");
            return;
        }
        setSpecError("");
        setSpec(value);
    };

    const handleClassCheckboxChange = (classId) => {
        if (selectedClassIds.includes(classId)) {
            setSelectedClassIds(selectedClassIds.filter(id => id !== classId));
        } else {
            setSelectedClassIds([...selectedClassIds, classId]);
        }
    };

    const addTrainer = () => {
        const token = localStorage.getItem("token");
        if (nameError || specError) {
            alert("Please fix the validation errors before submitting.");
            return;
        }

        if (!name || !email || !password || !spec) {
            alert("Complete all these fields: Name, Specialisation, Email, Password");
            return;
        }

        if (selectedClassIds.length === 0) {
            alert("Please select a class");
            return;
        }

        // Mapăm ID-urile selectate în obiecte { Id: id } pe care le așteaptă C#
        const classesPayload = selectedClassIds.map(id => ({ Id: id }));

        fetch("http://localhost:5275/odata/Trainers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                Name: name,
                Specialization: spec,
                Bio: bio,
                Email: email,
                PasswordHash: password,
                Classes: classesPayload // 🔥 'Classes' cu C mare
            })
        }).then((res) => {
            if (res.ok) {
                navigate("/trainers");
            } else {
                alert("Error at adding trainer.");
            }
        });
    };

    return (
        <div className="add-trainer-container">
            <h2>Add Trainer</h2>

            <div className="form-group">
                <label>Trainer Name:</label>
                <input
                    placeholder="e.g. Andrei Popescu"
                    value={name}
                    onChange={handleNameChange}
                    className="form-input"
                />
                {nameError && <p className="field-error">⚠️ {nameError}</p>}
            </div>

            <div className="form-group">
                <label>Specialization:</label>
                <input
                    placeholder="e.g. Fitness, Bodybuilding, Yoga"
                    value={spec}
                    onChange={handleSpecChange}
                    className="form-input"
                />
                {specError && <p className="field-error">⚠️ {specError}</p>}
            </div>

            <div className="form-group">
                <label>Biography:</label>
                <input
                    placeholder="Short description or experience..."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Email Address:</label>
                <input
                    placeholder="trainer@gymfit.com"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Account Password:</label>
                <input
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <div className="checkbox-panel">
                    <h4>Assign Classes:</h4>
                    {availableClasses.length === 0 ? (
                        <p className="empty-text">No classes found in database.</p>
                    ) : (
                        <div className="checkbox-scroll">
                            {availableClasses.map((c) => (
                                <label key={c.Id} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedClassIds.includes(c.Id)}
                                        onChange={() => handleClassCheckboxChange(c.Id)}
                                        className="checkbox-input"
                                    />
                                    <span>{c.Name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <button onClick={addTrainer} className="submit-btn">
                Add Trainer
            </button>
        </div>
    );
}

export default AddTrainer;