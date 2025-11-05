import Select from "react-select";
import {use, useEffect, useState} from "react";
import {API_BASE_URL} from "../config.ts";

function WWW() {
    const [options, setOptions] = useState([]);
    const [rawContent, setRawContent] = useState([])
    const [idOfContentSelected, setIdOfContentSelected] = useState("")
    const [typeOfContentSelected, setTypeOfContentSelected] = useState("")
    const [viewCount, setViewCount] = useState(0)

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
                setTypeOfContentSelected(contentType);
            })
            .catch(error => console.error("Error fetching content type:", error));
    }, [idOfContentSelected]);

    useEffect(() => {
        if (!typeOfContentSelected) { // prevents from running on first render
            return;
        }

        fetch(`${API_BASE_URL}/getmovieorseries`, {
            method: 'POST',
            headers: {"Content-Type": "text/plain"},
            body: idOfContentSelected
        }).then(response => response.text())
            .then(contentType => {
                setTypeOfContentSelected(contentType);
            })
            .catch(error => console.error("Error fetching content type:", error));
    }, [idOfContentSelected]);

    useEffect(() => {

        if (!typeOfContentSelected) {
            return;
        }



        if (typeOfContentSelected === "movie") {
            fetch(`${API_BASE_URL}/getmovieviewcount`, {
                method: 'POST',
                headers: {"Content-Type": "text/plain"},
                body: idOfContentSelected
            }).then(response => response.text())
                .then(numViews => {
                    setViewCount(parseInt(numViews));
                })
                .catch(error => console.error("Error fetching content type:", error));
        }
    }, [typeOfContentSelected])


    return (
        <>
            <Select
                options={options}
                onChange={(data) => setIdOfContentSelected(data.value)}
            />

            {typeOfContentSelected === "movie" && (
                <>
                    {viewCount}
                </>
            )}

            {typeOfContentSelected === "series" && (
                <>
                    <Select

                    />

                    <Select

                    />
                </>


            )
            }


        </>
    );

} //end of WWW

export default WWW;
