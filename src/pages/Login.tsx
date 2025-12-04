import { useState } from "react";
import { API_BASE_URL } from "../config.ts";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [loginData, setLoginData] = useState({ email: "", password: "" });

    const navigate = useNavigate();

    const handleChange = (e: { target: { name: string; value: string } }) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        try {
            e.preventDefault();

            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            console.log("response", response);

            const result = await response.text();

            if (response.status === 401) {
                alert("Incorrect credentials!");
            }

            switch (result) {
                case "Member":
                    localStorage.setItem("email", loginData.email);
                    navigate('/member/home');
                    break;

                case "Admin":
                    navigate('/admin/home', { state: { email: loginData.email } });
                    break;
            }

            if (!response.ok) {
                throw new Error("Error");
            }

        } catch (error) {
            console.log("Error:", error);
        }
    };

    return (
        <>
            <form className="login-container">

                <div className="form-group">
                    <input
                        style={{width: "30vw"}}
                        type="text"
                        name="email"
                        value={loginData.email}
                        placeholder="Enter email..."
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        style={{width: "30vw"}}
                        type="password"
                        name="password"
                        value={loginData.password}
                        placeholder="Enter password..."
                        onChange={handleChange}
                        required
                    />
                </div>

                <button className="btn blue-btn" onClick={handleSubmit}>Login</button>
            </form>
        </>
    );
}

export default Login;
