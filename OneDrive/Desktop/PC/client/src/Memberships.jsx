import { useState, useEffect } from "react";
import "./Memberships.css";

function Memberships() {
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);

    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetch("http://localhost:5275/api/memberships")
            .then(res => res.json())
            .then(data => {
                setMemberships(data);
                setLoading(false);
            })
            .catch(err => console.error("Error fetching memberships:", err));
    }, []);

    const handleSubscribe = async (membershipId) => {
        if (!loggedInUser || !loggedInUser.token) {
            alert("You must be logged in to choose a membership!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5275/api/memberships/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loggedInUser.token}`
                },
                body: JSON.stringify({
                    membershipId: membershipId
                })
            });

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("Error subscribing:", error);
            alert("An error occurred while processing your membership.");
        }
    };

    if (loading) return <p className="loading">Loading memberships...</p>;

    return (
        <div className="pricing-container">
            <h2 className="pricing-title">Choose the Right Plan</h2>
            <p className="pricing-subtitle">No hidden fees. Cancel anytime.</p>

            <div className="pricing-grid">
                {memberships.map((m) => (
                    <div key={m.id} className={`pricing-card ${m.id === 2 ? "featured" : ""}`}>
                        {m.id === 2 && <span className="badge">Most Popular</span>}
                        <h3>{m.name || (m.id === 1 ? "Morning Membership" : "Full Access Membership")}</h3>
                        <div className="price">
                            <span className="amount">{m.price}</span>
                            <span className="currency"> RON</span>
                            <span className="duration">/ {m.durationDays} days</span>
                        </div>

                        <ul className="benefits-list">
                            {m.id === 1 ? (
                                <>
                                    <li>✓ Gym access (06:00 AM - 03:00 PM)</li>
                                    <li>✓ All morning classes included</li>
                                    <li>✓ Locker room & showers access</li>
                                    <li className="disabled">✗ Evening classes access</li>
                                </>
                            ) : (
                                <>
                                    <li>✓ Unlimited access (06:00 AM - 10:00 PM)</li>
                                    <li>✓ All schedule classes included</li>
                                    <li>✓ Locker room & showers access</li>
                                    <li>✓ 1 Free Personal Training session</li>
                                </>
                            )}
                        </ul>

                        <button className="select-btn" onClick={() => handleSubscribe(m.id)}>
                            Choose Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Memberships;