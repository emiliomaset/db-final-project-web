import {useLocation} from "react-router-dom";
import {useState} from "react";
import "./AdminHome.css"
import WWW from "../components/WWW.tsx";

function AdminHome() {
    const location = useLocation();
    const email:string = location.state.email

    const [hasClickedWhosWatchedWhat, setHasClickedWhosWatchedWhat] = useState(false)

    return(
        <>
        <div className="admin-toolbar">
            <button onClick={(e) => setHasClickedWhosWatchedWhat(true)}> Who's Watched What?</button>

        </div>


            {hasClickedWhosWatchedWhat && <WWW/>}

        </>
    ) // end of return
} //end of AdminHome

export default AdminHome;
