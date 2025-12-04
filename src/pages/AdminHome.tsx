import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";
import "./AdminHome.css"
import WWW from "../components/WWW.tsx";
import AdminAnalytics from "./AdminAnalytics.tsx";
import EditMembers from "../components/EditMembers.tsx";
import EditContent from "../components/EditContent.tsx";

function AdminHome() {
    const navigate = useNavigate();
    const location = useLocation();
    const email:string = location.state.email

    const [hasClickedAnOption, setHasClickedAnOption] = useState(false)
    const [hasClickedWhosWatchedWhat, setHasClickedWhosWatchedWhat] = useState(false)
    const [hasClickedAnalytics, setHasClickedAnalytics] = useState(false)
    const [hasClickedEditMembers, setHasClickedEditMembers] = useState(false)
    const [hasClickedEditContent, setHasClickedEditContent] = useState(false)

    return(
        <>
            <div className="admin-toolbar">
                <button className="btn blue-btn" onClick={() => {
                    setHasClickedAnOption(true)
                    setHasClickedWhosWatchedWhat(true)
                    setHasClickedAnalytics(false)
                    setHasClickedEditMembers(false)
                    setHasClickedEditContent(false)}
                }> Who's Watched What?</button>

                <button className="btn blue-btn" onClick={() => {
                    setHasClickedAnOption(true)
                    setHasClickedAnalytics(true)
                    setHasClickedWhosWatchedWhat(false)
                    setHasClickedEditMembers(false)
                    setHasClickedEditContent(false)}
                }>Analytics</button>

                <button className="btn blue-btn" onClick={() => {
                    setHasClickedAnOption(true)
                    setHasClickedEditMembers(true)
                    setHasClickedAnalytics(false)
                    setHasClickedWhosWatchedWhat(false)
                    setHasClickedEditContent(false)}
                }>Edit Members</button>

                <button className="btn blue-btn" onClick={() => {
                    setHasClickedAnOption(true)
                    setHasClickedEditContent(true)
                    setHasClickedEditMembers(false)
                    setHasClickedAnalytics(false)
                    setHasClickedWhosWatchedWhat(false)}
                }>Edit Content</button>

                <button className="btn blue-btn" onClick={() => navigate("/")}>
                    Logout
                </button>

            </div>

            <div className="admin-home-container">

                {!hasClickedAnOption && (
                    <div className="admin-home-content">
                        <h1>Welcome, {email}, to the admin interface!</h1>
                        <h2>Please select an option above!</h2>

                    </div>
                )}

                {hasClickedWhosWatchedWhat && <WWW/>}

                {hasClickedAnalytics && <AdminAnalytics/>}

                {hasClickedEditMembers && <EditMembers/>}

                {hasClickedEditContent && <EditContent/>}

            </div>

        </>
    )
}

export default AdminHome;
