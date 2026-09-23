import { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Home";
import TrainersList from "./TrainersList";
import SportClassesList from "./SportClassesList";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm.jsx";
import AddTrainer from "./AddTrainer.jsx";
import DeleteTrainer from "./DeleteTrainer.jsx";
import AddSportClass from "./AddSportClass.jsx";
import DeleteSportClass from "./DeleteSportClass.jsx";
import Calendar from "./Calendar.jsx";
import ManageTrainers from "./ManageTrainers.jsx";
import ManageSportClasses from "./ManageSportClasses.jsx";
import Memberships from "./Memberships.jsx";
import MyAccount from "./MyAccount.jsx";
import ClassDetails from "./ClassDetails.jsx";
import AddEvents from "./AddEvents.jsx";
import NotFound from "./NotFound.jsx";

import "./App.css";

function App() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false); // 🍔 Stare pentru meniul mobil

    const [user, setUser] = useState(() => {
        const loggedInUser = localStorage.getItem("user");
        return loggedInUser ? JSON.parse(loggedInUser) : null;
    });

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        alert("Logged out successfully!");
        navigate("/");
    };

    // Închide overlay-ul când dai click pe un link mobil
    const closeMobileMenu = () => setIsBurgerOpen(false);

    return (
        <>
            <nav className="navbar">
                {/* 🍔 Butonul Burger - Vizibil doar pe ecrane mici */}
                <button
                    className={`burger-btn ${isBurgerOpen ? "open" : ""}`}
                    onClick={() => setIsBurgerOpen(!isBurgerOpen)}
                    aria-label="Toggle navigation"
                >
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                </button>

                {/* 🧭 Link-urile Principale (Devin Overlay pe Mobil) */}
                <ul className={`nav-menu ${isBurgerOpen ? "mobile-open" : ""}`}>
                    <li className="elements">
                        <NavLink to="/" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "links active" : "links"}>
                            Home
                        </NavLink>
                    </li>

                    <li className="elements">
                        <NavLink to="/trainers" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "links active" : "links"}>
                            Trainers
                        </NavLink>
                    </li>

                    <li className="elements">
                        <NavLink to="/sportclasses" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "links active" : "links"}>
                            Sport Classes
                        </NavLink>
                    </li>

                    <li className="elements">
                        <NavLink to="/memberships" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "links active" : "links"}>
                            Memberships
                        </NavLink>
                    </li>

                    {user && user.role === "Admin" && (
                        <>
                            <li className="elements">
                                <NavLink to="/managetrainers" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "links active" : "links"}>
                                    Manage Trainers
                                </NavLink>
                            </li>
                            <li className="elements">
                                <NavLink to="/managesportclasses" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "links active" : "links"}>
                                    Manage Classes
                                </NavLink>
                            </li>
                        </>
                    )}

                    {user && user.role === "Trainer" && (
                        <li className="elements">
                            <NavLink to="/addevents" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "links active" : "links"}>
                                Add Events
                            </NavLink>
                        </li>
                    )}

                    {user && (
                        <li className="elements">
                            <NavLink to="/calendar" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "links active" : "links"}>
                                Class Booking
                            </NavLink>
                        </li>
                    )}
                </ul>

                {/* 🔐 Zona din Dreapta - Rămâne mereu fixă în bara de sus */}
                <div className="nav-right-zone">
                    {user ? (
                        <div className="element-right dropdown-container">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="links menu-trigger-btn"
                            >
                                Menu
                            </button>
                            {menuOpen && (
                                <ul className="dropdown-menu">
                                    <li className="dropdown-item user-welcome">
                                        Hello, {user?.name || user?.email || "User"}!
                                    </li>
                                    <hr className="dropdown-divider" />
                                    <li>
                                        <NavLink to="/my-account" className="dropdown-link" onClick={() => setMenuOpen(false)}>
                                            My Account
                                        </NavLink>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => { handleLogout(); setMenuOpen(false); }}
                                            className="dropdown-link logout-btn"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <div className="nav-auth-buttons">
                            <NavLink to="/login" className={({ isActive }) => isActive ? "links active" : "links"}>
                                Login
                            </NavLink>
                            <NavLink to="/signup" className={({ isActive }) => isActive ? "links active" : "links"}>
                                Sign Up
                            </NavLink>
                        </div>
                    )}
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/trainers" element={<TrainersList />} />
                <Route path="/sportclasses" element={<SportClassesList />} />
                <Route path="/managesportclasses" element={<ManageSportClasses />} />
                <Route path="/managetrainers" element={<ManageTrainers />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/memberships" element={<Memberships />} />
                <Route path="/login" element={<LoginForm onLoginSuccess={(userData) => setUser(userData)} />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/managetrainers/add" element={<AddTrainer />} />
                <Route path="/managetrainers/delete" element={<DeleteTrainer />} />
                <Route path="/managesportclasses/delete" element={<DeleteSportClass />} />
                <Route path="/managesportclasses/add" element={<AddSportClass />} />
                <Route path="/addevents" element={<AddEvents />} />
                <Route path="/classes/:id" element={<ClassDetails />} />
                <Route path="*" element={<NotFound user={user} />} />
            </Routes>
        </>
    );
}

export default App;