import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";
import "./AdminHome.css"
import WWW from "../components/WWW.tsx";
import AdminAnalytics from "../components/AdminAnalytics.tsx";

function AdminHome() {
    const navigate = useNavigate();
    const location = useLocation();
    const email:string = location.state.email

    const [hasClickedAnOption, setHasClickedAnOption] = useState(false)
    const [hasClickedWhosWatchedWhat, setHasClickedWhosWatchedWhat] = useState(false)
    const [hasClickedAnalytics, setHasClickedAnalytics] = useState(false)

    return(
        <>
        <div className="admin-toolbar">
            <button className="btn blue-btn" onClick={() => {
                setHasClickedAnOption(true)
                setHasClickedWhosWatchedWhat(true)
                setHasClickedAnalytics(false)

            }
            }> Who's Watched What?</button>

            <button className="btn blue-btn" onClick={() => {
                setHasClickedAnOption(true)
                setHasClickedAnalytics(true)
                setHasClickedWhosWatchedWhat(false)
            }
            }>Analytics</button>

            <button className="btn blue-btn" onClick={() => navigate("/")}>
                Logout
            </button>

        </div>

            {!hasClickedAnOption && (
                <div className="admin-home-content">
                    <h1>Welcome, {email}, to the admin interface!</h1>
                    <h2>Please select an option above!</h2>

                </div>
            )}

            {hasClickedWhosWatchedWhat && <WWW/>}

            {hasClickedAnalytics && <AdminAnalytics/>}

        </>
    ) // end of return
} //end of AdminHome

export default AdminHome;
