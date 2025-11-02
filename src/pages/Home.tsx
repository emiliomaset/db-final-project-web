import {useLocation} from "react-router-dom";

function Home(){
    const location = useLocation();
    const email:string = location.state.email

    return(
        <>
            <p>{email}</p>
        </>

    ) // end of return

} // end of Home

export default Home