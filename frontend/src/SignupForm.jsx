import { useState } from "react";
import "./SignupForm.css";
import {useNavigate} from "react-router-dom";

function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Remember:", remember);

        // aici trimiți datele către backend-ul tău .NET
        // fetch("http://localhost:5275/api/signup", { ... })
        navigate("/");
    };
    const handleCancel = () => {
        navigate("/");
    }
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

                <label>
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={() => setRemember(!remember)}
                        style={{ marginBottom: "15px" }}
                    />
                    Remember me
                </label>

                <p>
                    By creating an account you agree to our
                    <a href="#" style={{ color: "dodgerblue" }}> Terms & Privacy</a>.
                </p>

                <div className="clearfix">
                    <button type="button" className="cancelbtn">Cancel</button>
                    <button type="submit" className="signupbtn">Sign Up</button>
                </div>
            </div>
        </form>
    );
}

export default SignupForm;