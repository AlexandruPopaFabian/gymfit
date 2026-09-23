import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home({user}) {
    const navigate = useNavigate();
    return (
        <div className="home-container">

            <header className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-content">
                        {user ? (
                            <h1>Welcome, <span className="highlight">{user.name}!</span></h1>
                        ) : (
                            <>
                            <h1>Welcome to <span className="highlight">GymFit</span></h1>
                            <p>Your ultimate fitness journey starts here. Track your favorite classes, book sessions, and train with professionals.</p>
                            </>
                        )}

                        {user ? (
                            <button className="cta-button" onClick={() => navigate("/calendar")}>
                                Go to Calendar
                            </button>
                        ) : (
                            <button className="cta-button" onClick={() => navigate("/signup")}>
                                Join Us Now
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <section className="features-section">
                <div className="feature-card">
                    <h3>Expert Trainers</h3>
                    <p>Access to certified fitness professionals ready to guide your every step.</p>
                </div>
                <div className="feature-card">
                    <h3>Diverse Classes</h3>
                    <p>From high-intensity cardio to relaxing yoga sessions tailored for everyone.</p>
                </div>
                <div className="feature-card">
                    <h3>Easy Booking</h3>
                    <p>Secure your spot in any class with just a few clicks via our dynamic calendar.</p>
                </div>
            </section>

            <section className="explore-section">
                <h2>Explore Our Gym</h2>
                <div className="explore-grid">
                    <div className="explore-item trainers-bg" onClick={() => navigate("/trainers")}>
                        <div className="explore-text">
                            <h3>Our Trainers</h3>
                            <p>Meet the team →</p>
                        </div>
                    </div>
                    <div className="explore-item classes-bg" onClick={() => navigate("/sportclasses")}>
                        <div className="explore-text">
                            <h3>Sport Classes</h3>
                            <p>View our classes →</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;