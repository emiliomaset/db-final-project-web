import Select from "react-select";
import {use, useEffect, useState} from "react";
import {API_BASE_URL} from "../config.ts";

function WWW() {
    const [contentOptions, setContentOptions] = useState([]);
    const [rawContent, setRawContent] = useState([])
    const [idOfContentSelected, setIdOfContentSelected] = useState("")
    const [typeOfContentSelected, setTypeOfContentSelected] = useState("")
    const [numSeasonSelected, setNumSeasonSelected] = useState(0)
    const [episodeIdOfEpisodeSelected, setEpisodeIdOfEpisodeSelected] = useState("")
    const [viewCount, setViewCount] = useState(-1)
    const [numSeasons, setNumSeasons] = useState(0)
    const [listOfEpisodes, setListOfEpisodes] = useState([])

    console.log(numSeasonSelected)


    function getSeasonsAsOptions(num) {
            const seasons = []
            for (let i = 0; i < num;i++) {
                seasons.push({label: `Season ${i+1}` , value:`Season ${i+1}` })
            }
            return seasons;
        }


    useEffect(() => { // load content contentOptions
        fetch(`${API_BASE_URL}/getallcontent`)
            .then(response => response.json())
            .then(data => {
                setRawContent(data)
                const formattedOptions = data.map((content: { contentId: string; title: string; }) => (
                    {value: content.contentId, label: content.title}
                ));
                setContentOptions(formattedOptions);
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

        setViewCount(-1)

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

        else {
            fetch(`${API_BASE_URL}/getnumseasons`, {
                method: 'POST',
                headers: {"Content-Type": "text/plain"},
                body: idOfContentSelected
            }).then(response => response.text())
                .then(numOfSeasons => {
                    setNumSeasons(parseInt(numOfSeasons));
                })
                .catch(error => console.error("Error fetching content type:", error));
        }
    }, [typeOfContentSelected])

    useEffect(() => {

        if (!numSeasonSelected) {
            return
        }

        else {
            fetch(`${API_BASE_URL}/getepisodes`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"contentId" : idOfContentSelected, "seasonNum" : numSeasonSelected})
            }).then(response => response.json())
                .then(episodes => {
                    setListOfEpisodes(episodes);
                    console.log("episodes", episodes)
                    const formattedOptions = episodes.map((content: { episodeId: string; title: string; }) => (
                        {value: content.episodeId, label: content.title}
                    ));
                    setListOfEpisodes(formattedOptions);

                })
                .catch(error => console.error("Error fetching content type:", error));

        }

    }, [numSeasonSelected]);

    useEffect(()=> {
        fetch(`${API_BASE_URL}/getepisodeviewcount`, {
            method: 'POST',
            headers: {"Content-Type": "text/plain"},
            body: episodeIdOfEpisodeSelected
        }).then(response => response.text())
            .then(numViews => {
                setViewCount(parseInt(numViews));
            })
            .catch(error => console.error("Error fetching content type:", error));

    },[episodeIdOfEpisodeSelected]);


    return (
        <>
            <Select
                options={contentOptions}
                onChange={(data) => setIdOfContentSelected(data.value)}
            />

            {typeOfContentSelected === "movie" && (
                <>
                    View count: {viewCount}
                </>
            )}

            {typeOfContentSelected === "series" && (
                <>
                    <Select
                        options={getSeasonsAsOptions(numSeasons)}
                        onChange={(data) => setNumSeasonSelected(parseInt(data.label.slice(-1)))}
                    />

                    <Select
                        options={listOfEpisodes}
                        onChange={data=> setEpisodeIdOfEpisodeSelected(data.value)}
                    />

                    {viewCount >= 0 && (<>View count: {viewCount}</>)}
                </>


            )
            }


        </>
    );

} //end of WWW

export default WWW;
