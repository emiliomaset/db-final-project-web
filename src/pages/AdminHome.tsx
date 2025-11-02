import {useLocation} from "react-router-dom";

function AdminHome() {
    const location = useLocation();
    const email:string = location.state.email

    return(
        <>
            <p>Admin</p>
            <p>{email}</p>
        </>
    ) // end of return
} //end of AdminHome

export default AdminHome;
