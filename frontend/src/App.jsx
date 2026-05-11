import { NavLink, Routes, Route } from "react-router-dom";
import Home from "./Home";
import TrainersList from "./TrainersList";
import SportClassesList from "./SportClassesList";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm.jsx";
import AddTrainer from "./AddTrainer.jsx";
import DeleteTrainer from "./DeleteTrainer.jsx";
import AddSportClass from "./AddSportClass.jsx";
import DeleteSportClass from "./DeleteSportClass.jsx";

function App() {
    return (
        <>
            <ul className="navbar">
                <li className="elements">
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? "links active" : "links"}
                    >
                        Home
                    </NavLink>
                </li>

                <li className="elements">
                    <NavLink
                        to="/trainers"
                        className={({ isActive }) => isActive ? "links active" : "links"}
                    >
                        Trainers
                    </NavLink>
                </li>

                <li className="elements">
                    <NavLink
                        to="/sportclasses"
                        className={({ isActive }) => isActive ? "links active" : "links"}
                    >
                        Sport Classes
                    </NavLink>
                </li>

                <li className="element-right">
                    <NavLink
                        to="/login"
                        className={({ isActive }) => isActive ? "links active" : "links"}
                    >
                        Login
                    </NavLink>
                </li>
                <li className="element-right">
                    <NavLink
                        to="/signup"
                        className={({ isActive }) => isActive ? "links active" : "links"}
                    >
                        Sign Up
                    </NavLink>
                </li>
            </ul>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trainers" element={<TrainersList />} />
                <Route path="/sportclasses" element={<SportClassesList />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/trainers/add" element={<AddTrainer />} />
                <Route path="/trainers/delete" element={<DeleteTrainer />} />
                <Route path="/sportclasses/add" element={<AddSportClass />} />
                <Route path="/sportclasses/delete" element={<DeleteSportClass />} />
            </Routes>
        </>
    );
}

export default App;
