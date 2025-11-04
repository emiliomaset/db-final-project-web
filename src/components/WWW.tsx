import Select from "react-select";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../config.ts";

function WWW() {
    const [options, setOptions] = useState([]);
    const [rawContent, setRawContent] = useState([])
    const [idOfContentSelected, setIdOfContentSelected] = useState("")
    const [typeOfContentSelected, setTypeOfContentSelected] = useState("")
    
    useEffect(() => { // load content options
        fetch(`${API_BASE_URL}/getallcontent`)
            .then(response => response.json())
            .then(data => {
                setRawContent(data)
                const formattedOptions = data.map((content: { contentId: string; title: string; }) => (
                    {value: content.contentId, label: content.title}
                ));
                setOptions(formattedOptions);
            })
    }, []);

    useEffect(() => {
        if (!idOfContentSelected) { // prevents from running on first render
            return;
        }

        fetch(`${API_BASE_URL}/getmovieorseries`, {
            method: 'POST',
            headers: {"Content-Type": "text/plain"},
            body: idOfContentSelected
        }).then(response => response.text())
            .then(contentType => {
                // 2. Log the new value here, right after you receive it.
                console.log("Fetched content type:", contentType);
                setTypeOfContentSelected(contentType);
            })
            .catch(error => console.error("Error fetching content type:", error));
    }, [idOfContentSelected]);




    return (
        <>
            <Select
                options={options}
                onChange={(data:string) => setIdOfContentSelected(data.value)}
            />
        </>
    );

} //end of WWW

export default WWW;
