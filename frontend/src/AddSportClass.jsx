import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddSportClass() {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    const [nameError, setNameError] = useState("");
    const [descError, setDescError] = useState("");

    const navigate = useNavigate();

    const handleNameChange = (e) => {
        const value = e.target.value;

        if (!/^[A-Za-zăîâșțĂÎÂȘȚ ]*$/.test(value)) {
            setNameError("Numele clasei poate conține doar litere");
            return;
        }

        setNameError("");
        setName(value);
    };

    const handleDescChange = (e) => {
        const value = e.target.value;

        if (!/^[A-Za-zăîâșțĂÎÂȘȚ ]*$/.test(value)) {
            setDescError("Descrierea poate conține doar litere");
            return;
        }

        setDescError("");
        setDesc(value);
    };

    const addClass = () => {
        if (nameError || descError) return;

        fetch("http://localhost:5275/odata/SportClasses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Name: name, Description: desc })
        }).then(() => {
            navigate("/sportclasses");
        });
    };

    return (
        <div>
            <h2>Add Sport Class</h2>

            {/* NAME */}
            <input
                placeholder="Class name"
                value={name}
                onChange={handleNameChange}
            />
            {nameError && <p style={{ color: "red" }}>{nameError}</p>}

            {/* DESCRIPTION */}
            <input
                placeholder="Description"
                value={desc}
                onChange={handleDescChange}
            />
            {descError && <p style={{ color: "red" }}>{descError}</p>}

            <button onClick={addClass}>Add</button>
        </div>
    );
}

export default AddSportClass;
