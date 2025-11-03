import {useLocation} from "react-router-dom";

function MemberHome(){
    const location = useLocation();
    const email:string = location.state.email



    return(
        <>
            <p>Member {email}</p>

        </>

    ) // end of return

} // end of Home

export default MemberHome