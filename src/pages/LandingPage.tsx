import Login from "./Login.tsx"
import "./LandingPage.css"

function LandingPage(){
    return(
        <div className="landing-container">
        <h2>Movie Streaming!</h2>
        <Login/>
        </div>
    )

}

export default LandingPage