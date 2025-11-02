import {useState} from "react";
import {API_BASE_URL} from "../config.ts";
import {useNavigate} from 'react-router-dom'

function Login() {
    const [loginData, setLoginData] = useState({email : "", password: ""})

    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({...loginData, [e.target.name] : e.target.value})
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault() // prevents page refresh
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(loginData)
            });


            console.log("response", response)

            const result = await response.text()

            if (result.includes("Invalid")) {
                alert(result)
            }

            else if (result.includes("Successful")) {
                navigate('/home', {state : {email : loginData.email}})
            }

            else if (!response.ok) {
                throw new Error("Error: ")
            }

        } catch (error) {
            console.log("Error:", error)
        }


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