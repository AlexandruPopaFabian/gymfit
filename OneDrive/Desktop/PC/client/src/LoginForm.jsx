import { useState } from "react";
import "./LoginForm.css";
import { useNavigate, Link } from "react-router-dom";

function LoginForm({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5275/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);

                // Păstrezi linia ta existentă
                localStorage.setItem("user", JSON.stringify(data));

                // 🔥 ADAUGĂ ACEASTĂ LINIE:
                // Salvează doar string-ul criptat cu puncte din interiorul obiectului primit
                localStorage.setItem("token", data.token);

                onLoginSuccess(data);
                navigate("/");
            } else {
                alert(data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Could not connect to the server.");
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="container">
                <h1>Login</h1>

                <hr/>

                <label><b>Email</b></label>
                <input
                    type="text"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
            </div>

            <div className="clearfix" style={{ backgroundColor: "#f1f1f1" }}>
                <button type="submit" className="loginbtn">Login</button>
                <button type="button" className="cancelbtn" onClick={handleCancel}>Cancel</button>
            </div>
            <p>
                <Link to="/signup">Create an account</Link>
            </p>
        </form>
    );
}

export default LoginForm;