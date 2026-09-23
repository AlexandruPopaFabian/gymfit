import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./ClassDetails.css";

function ClassDetails() {
    const { id } = useParams();
    const [sportClass, setSportClass] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5275/odata/SportClasses(${id})`)
            .then(res => res.json())
            .then(data => {
                setSportClass(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loading">Loading class details...</div>;
    if (!sportClass) return <div className="error-msg">Class not found!</div>;

    const trainingType = sportClass.TrainingType || "Cardio / Martial Arts";
    const level = sportClass.Level || "Intermediate - Advanced";
    const equipment = sportClass.Equipment || "Mat, Boxing bag, Gloves";
    const duration = sportClass.Duration || "55-60 minutes";

    return (
        <div className="details-wrapper">

            <div
                className="details-hero-banner"
                style={{
                    backgroundImage: sportClass.ImageUrl
                        ? `url(${sportClass.ImageUrl})`
                        : `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600')`
                }}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <Link to="/sportclasses" className="back-btn">← BACK TO CLASSES</Link>
                    <h1 className="hero-title">{sportClass.Name.toUpperCase()} CLASSES</h1>
                </div>
            </div>

            <div className="quick-info-grid">
                <div className="info-box">
                    <div className="box-header">
                        <h4>TRAINING TYPE</h4>
                        <span className="box-icon">👟</span>
                    </div>
                    <p>{trainingType}</p>
                </div>

                <div className="info-box">
                    <div className="box-header">
                        <h4>LEVEL</h4>
                        <span className="box-icon">🔥</span>
                    </div>
                    <p>{level}</p>
                </div>

                <div className="info-box">
                    <div className="box-header">
                        <h4>EQUIPMENT</h4>
                        <span className="box-icon">👜</span>
                    </div>
                    <p>{equipment}</p>
                </div>

                <div className="info-box">
                    <div className="box-header">
                        <h4>DURATION</h4>
                        <span className="box-icon">⏱️</span>
                    </div>
                    <p>{duration}</p>
                </div>
            </div>
        </div>
    );
}

export default ClassDetails;