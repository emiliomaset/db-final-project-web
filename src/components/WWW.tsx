import Select from "react-select/base";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../config.ts";

function WWW() {

    const [rawContent, setRawContent] = useState([])
    const [contentArray, setContentArray] = useState([])
    const [firstRender, setFirstRender] = useState(true)

    useEffect( () => {
       fetch(`${API_BASE_URL}/getallcontent`).then(response => response.json()).
       then(data => {
           setFirstRender(false)
           setRawContent(data)
           rawContent.forEach( (content, index) => setContentArray(...contentArray, {value: content.title, label: content.contentId}));
       })
        }, [firstRender]);

    console.log("raw", rawContent)
    console.log("?", contentArray)



    return(
        <>


                <Select options={contentArray}/>


        </>
    ) // end of return

} //end of WWW

export default WWW;
