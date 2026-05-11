import { useState } from "react";
import "./LoginForm.css";

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Username:", username);
        console.log("Password:", password);

        // aici trimiți datele către backend-ul tău .NET
        // fetch("http://localhost:5275/api/login", { ... })
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="container">
                <label><b>Username</b></label>
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label><b>Password</b></label>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>

                <label>
                    <input type="checkbox" defaultChecked /> Remember me
                </label>
            </div>

            <div className="container" style={{ backgroundColor: "#f1f1f1" }}>
                <button type="button" className="cancelbtn">Cancel</button>
                <span className="psw">Forgot <a href="#">password?</a></span>
            </div>
        </form>
    );
}

export default LoginForm;
