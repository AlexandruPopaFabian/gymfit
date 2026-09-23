import { useEffect, useState } from "react";
import "./TrainersList.css";

function TrainersList() {
    const [trainers, setTrainers] = useState([]);

    const [expandedTrainerId, setExpandedTrainerId] = useState(null);

    useEffect(() => {

        fetch("http://localhost:5275/odata/Trainers?$expand=Classes")
            .then(res => res.json())
            .then(data => setTrainers(data.value || []))
            .catch(err => console.error("Error fetching trainers:", err));
    }, []);

    const toggleDetails = (id) => {
        if (expandedTrainerId === id) {
            setExpandedTrainerId(null);
        } else {
            setExpandedTrainerId(id);
        }
    };

    return (
        <div className="trainers-page">
            <h2 className="page-title">Our Certified Instructors</h2>

            <div className="trainers-grid">
                {trainers.map((t) => {
                    const isExpanded = expandedTrainerId === t.Id;

                    return (
                        <div key={t.Id} className="trainer-card">
                            <div className="card-header">
                                <h3>{t.Name}</h3>
                                <p className="specialization">Specialization: {t.Specialization}</p>
                            </div>

                            <div className="quick-info-row">
                                <div className="info-badge">
                                    <span className="badge-icon">🎖️</span>
                                    <span className="badge-value">PRO</span>
                                    <span className="badge-label">Status</span>
                                </div>
                                <div className="info-badge">
                                    <span className="badge-icon">🏋️</span>
                                    <span className="badge-value">{t.Classes?.length || 0}</span>
                                    <span className="badge-label">Classes</span>
                                </div>
                            </div>

                            <div className={`expanded-content ${isExpanded ? "open" : ""}`}>
                                <div className="bio-section">
                                    <h4>Biography</h4>
                                    <p>{t.Bio || "No biography provided yet."}</p>
                                </div>

                                <div className="classes-section">
                                    <h4>Assigned Classes</h4>
                                    {t.Classes && t.Classes.length > 0 ? (
                                        <ul className="trainer-classes-list">
                                            {t.Classes.map(c => (
                                                <li key={c.Id}>• {c.Name}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="no-classes">No classes scheduled.</p>
                                    )}
                                </div>
                            </div>

                            <button className="view-details-btn" onClick={() => toggleDetails(t.Id)}>
                                {isExpanded ? "Hide Details ↑" : "View Details →"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TrainersList;