import { useState, useEffect } from "react";
import "./MyAccount.css";

function MyAccount() {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loggedInUser = localStorage.getItem("user");
    const token = loggedInUser ? JSON.parse(loggedInUser).token : null;

    useEffect(() => {
        if (!loggedInUser) {
            setError("You must be logged in to view this page.");
            setLoading(false);
            return;
        }

        fetch("http://localhost:5275/api/auth/my-account", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Session expired or error loading account data.");
                }
                return res.json();
            })
            .then((data) => {
                setAccountData(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [loggedInUser, token]);

    const handleCancelClass = async (bookingId, className) => {
        const confirmCancel = window.confirm(`Are you sure you want to cancel your booking for ${className}?`);
        if (!confirmCancel) return;

        try {
            const response = await fetch(`http://localhost:5275/odata/ClassBookings(${bookingId})`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok || response.status === 204) {
                alert("Booking canceled successfully!");

                setAccountData(prev => ({
                    ...prev,
                    classes: prev.classes.filter(c => c.bookingId !== bookingId)
                }));
            } else {
                alert("Failed to cancel the booking. Please try again.");
            }
        } catch (err) {
            console.error("Error deleting booking:", err);
            alert("Could not connect to the server.");
        }
    };

    if (loading) return <div className="loading">Loading GymFit profile...</div>;
    if (error) return <div className="error-msg">{error}</div>;

    const hasMembership = accountData?.membership?.expiresAt != null;

    return (
        <div className="account-container">
            <div className="account-header">
                <h1>My Account</h1>
                <p>View your membership status and the schedule of your booked classes.</p>
            </div>

            <div className="account-grid">
                {/* User Profile Info */}
                <div className="account-card profile-card">
                    <h3>User Information</h3>
                    <p><strong>Client Name:</strong> {accountData?.name}</p>
                    <p><strong>Email Address:</strong> {accountData?.email}</p>
                </div>

                {/* Membership */}
                <div className="account-card membership-card">
                    <h3>Current Membership</h3>
                    <div className={`membership-info ${hasMembership ? 'active-sub' : 'no-sub'}`}>
                        <span className={`membership-badge ${hasMembership ? 'status-on' : 'status-off'}`}>
                            {hasMembership ? "ACTIVE" : "INACTIVE"}
                        </span>
                        <h4>{accountData?.membership?.name}</h4>
                        <p className="price">{accountData?.membership?.price} RON</p>
                        {hasMembership && (
                            <p className="expiration-date">
                                Valid until: <strong>{new Date(accountData.membership.expiresAt).toLocaleDateString("en-US")}</strong>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Class Bookings */}
            <div className="account-card classes-card">
                <h3>My Booked Classes</h3>
                {accountData?.classes?.length === 0 ? (
                    <p className="no-data">You haven't booked any classes yet. Go to the calendar to make a reservation!</p>
                ) : (
                    <ul className="booked-classes-list">
                        {accountData?.classes.map((c, index) => {
                            // 💡 Verificăm dacă clasa este în trecut comparând-o cu momentul actual
                            const isPastClass = new Date(c.startTime) < new Date();

                            return (
                                <li
                                    key={index}
                                    className="class-item"
                                    style={{
                                        // 💡 Dacă e din trecut, îi punem fundal gri deschis, altfel rămâne cel implicit
                                        backgroundColor: isPastClass ? "#f1f2f6" : "#ffffff",
                                        opacity: isPastClass ? 0.8 : 1,
                                        borderLeft: isPastClass ? "5px solid #a4b0be" : "5px solid #2ed573",
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    <div className="class-details">
                                        <strong className="class-name" style={{ color: isPastClass ? "#747d8c" : "#2f3542" }}>
                                            {c.className} {isPastClass && <span style={{ fontSize: "12px", fontStyle: "italic", color: "#a4b0be" }}>(Past Class)</span>}
                                        </strong>
                                        <span className="class-desc">{c.description}</span>
                                        <span className="class-date">
                                            📅 {new Date(c.startTime).toLocaleDateString("en-US")} | 🕒 {new Date(c.startTime).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })} - {new Date(c.endTime).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="class-actions" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                        <span className="status-confirmed">Booking Confirmed</span>

                                        {/* 💡 AFIȘARE CONDIȚIONATĂ: Butonul apare DOAR dacă clasa NU este în trecut */}
                                        {!isPastClass && (
                                            <button
                                                className="cancel-class-btn"
                                                onClick={() => handleCancelClass(c.bookingId, c.className)}
                                                style={{
                                                    backgroundColor: "#ff4757",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "6px 12px",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                Cancel Class
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MyAccount;