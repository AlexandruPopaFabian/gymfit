import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTrainer() {
    const [name, setName] = useState("");
    const [spec, setSpec] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");

    const [nameError, setNameError] = useState("");
    const [specError, setSpecError] = useState("");

    const navigate = useNavigate();

    const handleNameChange = (e) => {
        const value = e.target.value;

        if (!/^[A-Za-zăîâșțĂÎÂȘȚ ]*$/.test(value)) {
            setNameError("Numele poate conține doar litere");
            return;
        }

        setNameError("");
        setName(value);
    };

    const handleSpecChange = (e) => {
        const value = e.target.value;

        if (!/^[A-Za-zăîâșțĂÎÂȘȚ ]*$/.test(value)) {
            setSpecError("Specializarea poate conține doar litere");
            return;
        }

        setSpecError("");
        setSpec(value);
    };

    const addTrainer = () => {
        if (nameError || specError) return;

        fetch("http://localhost:5275/odata/Trainers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Name: name,
                Specialization: spec,
                Bio: bio,
                Email: email
            })
        }).then(() => {
            navigate("/trainers");
        });
    };

    return (
        <div>
            <h2>Add Trainer</h2>

            {/* NAME */}
            <input
                placeholder="Name"
                value={name}
                onChange={handleNameChange}
            />
            {nameError && <p style={{ color: "red" }}>{nameError}</p>}

            {/* SPECIALIZATION */}
            <input
                placeholder="Specialization"
                value={spec}
                onChange={handleSpecChange}
            />
            {specError && <p style={{ color: "red" }}>{specError}</p>}

            {/* BIO */}
            <input
                placeholder="Bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
            />

            {/* EMAIL */}
            <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <button onClick={addTrainer}>Add</button>
        </div>
    );
}

export default AddTrainer;
