import {useState} from "react";

function Login() {

    const [loginData, setLoginData] = useState({email : "", password: ""})

    const handleChange = (e) => {
        setLoginData({...loginData, [e.target.name] : e.target.value})
    }

    const handleSubmit = (e) => {

    }

    return (
        <>
        <form className="login-container">
            <div className="form-group">
                <input
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
                    type="text"
                    name="password"
                    value={loginData.password}
                    placeholder="Enter password..."
                    onChange={handleChange}
                    required
                />
            </div>

            <button className="login-btn" onClick={handleSubmit}>Login</button>
        </form>
</>
    ) // end of return

} // end of Login

export default Login;