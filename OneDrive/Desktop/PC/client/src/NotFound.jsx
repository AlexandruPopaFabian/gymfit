import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound({ user }) {
    // Detectăm rolul utilizatorului exact ca în navbar-ul tău
    const isAdmin = user && user.role === "Admin";
    const isTrainer = user && user.role === "Trainer";
    const isLoggedIn = !!user;

    return (
        <div className="not-found-container">
            <div className="error-code">404</div>
            <h2>Page Not Found</h2>
            <p className="subtitle">
                The URL you typed is incorrect or the page does not exist.
                Here are the links you have access to based on your account:
            </p>

            <div className="suggested-links">
                {/* 🏠 Rute Publice (Disponibile oricând) */}
                <Link to="/" className="suggested-btn">🏠 Home</Link>
                <Link to="/trainers" className="suggested-btn">👟 Trainers</Link>
                <Link to="/sportclasses" className="suggested-btn">🏋️ Sport Classes</Link>
                <Link to="/memberships" className="suggested-btn">💳 Memberships</Link>

                {/* 👤 Rute doar pentru utilizatorii Autentificați (Clienți / Toți) */}
                {isLoggedIn && (
                    <>
                        <Link to="/calendar" className="suggested-btn">📅 Class Booking</Link>
                        <Link to="/my-account" className="suggested-btn">👤 My Account</Link>
                    </>
                )}

                {/* 🏋️ Rute exclusive pentru TRAINER */}
                {isTrainer && (
                    <Link to="/addevents" className="suggested-btn admin-accent">📆 Add Events</Link>
                )}

                {/* 🛠️ Rute exclusive pentru ADMIN */}
                {isAdmin && (
                    <>
                        <Link to="/managetrainers" className="suggested-btn admin-accent">👥 Manage Trainers</Link>
                        <Link to="/managesportclasses" className="suggested-btn admin-accent">⚙️ Manage Classes</Link>
                    </>
                )}

                {/* 🔑 Rute doar pentru Vizitatori (Guest) */}
                {!isLoggedIn && (
                    <>
                        <Link to="/login" className="suggested-btn auth-accent">🔓 Login</Link>
                        <Link to="/signup" className="suggested-btn auth-accent">📝 Sign Up</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default NotFound;