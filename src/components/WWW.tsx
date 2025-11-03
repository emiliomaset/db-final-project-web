import Select from "react-select";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../config.ts";



function WWW() {
    const [options, setOptions] = useState([]);
    
    useEffect(() => {
        fetch(`${API_BASE_URL}/getallcontent`)
            .then(response => response.json())
            .then(data => {
                const formattedOptions = data.map(content => (
                    {value: content.contentId, label: content.title}
                ));
                setOptions(formattedOptions);
            })
    }, []); 

    return (
        <>
            <Select options={options}/>
        </>
    );

} //end of WWW

export default WWW;
