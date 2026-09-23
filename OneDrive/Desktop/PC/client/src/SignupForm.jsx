import { useState } from "react";
import "./SignupForm.css";
import { useNavigate, Link } from "react-router-dom"; // Am adăugat Link

function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:5275/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigate("/login"); // Te trimite la pagina de login să își bage credențialele proaspete
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("Could not connect to the server.");
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <form onSubmit={handleSubmit} className="signup-form">
            <div className="container">
                <h1>Sign Up</h1>
                <p>Please fill in this form to create an account.</p>
                <hr />

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

                <label><b>Repeat Password</b></label>
                <input
                    type="password"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                />

                <div className="clearfix">
                    <button type="button" className="cancelbtn" onClick={handleCancel}>Cancel</button>
                    <button type="submit" className="signupbtn">Sign Up</button>
                </div>
                <p>
                    {/* Schimbat în Link pentru o navigare instanta */}
                    <Link to="/login">Already have an account?</Link>
                </p>
            </div>
        </form>
    );
}

export default SignupForm;