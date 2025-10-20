import "./LandingPage.css"

function LandingPage(){
    return(
        <>
                <form className="login-container">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Enter email..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Enter password..."
                            required
                        />
                    </div>

                    <button className="login-btn">Login</button>
                </form>

        </>

    ) // end of return

} // end of LandingPage

export default LandingPage