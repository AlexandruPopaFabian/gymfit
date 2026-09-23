import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SportClassesList.css";

function SportClasses() {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5275/odata/SportClasses")
            .then(res => res.json())
            .then(data => setClasses(data.value || data));
    }, []);

    return (
        <div className="classes-main-container">
            <h1 className="main-title">Our Sports Classes</h1>
            <div className="sports-grid">
                {classes.map((sport) => (
                    <div key={sport.Id} className="sport-card">
                        <div className="card-overlay"></div>
                        <div className="card-content">
                            <h2 className="sport-title">{sport.Name.toUpperCase()}</h2>

                            <Link to={`/classes/${sport.Id}`} className="details-btn">
                                FIND DETAILS
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SportClasses;