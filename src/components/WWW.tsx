import Select from "react-select";
import {useEffect, useRef, useState} from "react";
import {API_BASE_URL} from "../config.ts";

function WWW() {
    const [contentOptions, setContentOptions] = useState([]);
    const [idOfContentSelected, setIdOfContentSelected] = useState("")
    const [typeOfContentSelected, setTypeOfContentSelected] = useState("")
    const [numSeasonSelected, setNumSeasonSelected] = useState(0)
    const [episodeIdOfEpisodeSelected, setEpisodeIdOfEpisodeSelected] = useState("")
    const [viewCount, setViewCount] = useState(-1)
    const [numSeasons, setNumSeasons] = useState(0)
    const [listOfEpisodes, setListOfEpisodes] = useState([])
    const [arrayOfViewers, setArrayOfViewers] = useState([])

    function getSeasonsAsOptions(numOfSeasonsForSeries: number) { // makes array of options for select season field
        const seasons = []
        for (let i = 0; i < numOfSeasonsForSeries;i++) {
            seasons.push({label: `Season ${i+1}` , value:`Season ${i+1}` })
        }
        return seasons;
    }

    useEffect(() => { // makes array contentOptions for options for select content field
        fetch(`${API_BASE_URL}/getallcontent`)
            .then(response => response.json())
            .then(data => {
                const formattedOptions = data.map((content: { contentId: string; title: string; }) => (
                    {value: content.contentId, label: content.title}
                ));
                setContentOptions(formattedOptions);
            })
    }, []);

    useEffect(() => { // gets type ("movie" or "series) of content selected
        if (!idOfContentSelected) { // prevents from running on first render since idOfContentSelected is empty string
            return;
        }

        setArrayOfViewers([])

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

    useEffect(() => { // once user selects content, either get view count for it if it is a movie, or get num of seasons if its a series

        if (!typeOfContentSelected) {
            return;
        }

        setViewCount(-1)
        setArrayOfViewers([])

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
    }, [idOfContentSelected, typeOfContentSelected])

    useEffect(() => { // gets names of episodes in selected season of a series

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
                .catch(error => console.error("Error:", error));

        }

    }, [idOfContentSelected, numSeasonSelected]);

    useEffect(()=> { // gets episode view count once an episode is selected
        fetch(`${API_BASE_URL}/getepisodeviewcount`, {
            method: 'POST',
            headers: {"Content-Type": "text/plain"},
            body: episodeIdOfEpisodeSelected
        }).then(response => response.text())
            .then(numViews => {
                setViewCount(parseInt(numViews));
            })
            .catch(error => console.error("Error:", error));

    },[episodeIdOfEpisodeSelected]);

    useEffect( () => { // gets names of viewers for a movie once idOfContentSelected, or gets names for an episode of a series once selected
        async function getViewers(id: string) {
            const response = await fetch(`${API_BASE_URL}/getviewers/${id}/${typeOfContentSelected}`);
            const viewersArray = await response.json();
            console.log("viewersArray", viewersArray)
            const arrayOfViewers = viewersArray.map(userObject => userObject.name);

            setArrayOfViewers(arrayOfViewers)
        }

        if (typeOfContentSelected === "movie") {
            getViewers(idOfContentSelected);
        }

        if (episodeIdOfEpisodeSelected != "") {
            getViewers(episodeIdOfEpisodeSelected)
        }

    }, [episodeIdOfEpisodeSelected, idOfContentSelected, typeOfContentSelected])

    useEffect(() => {
        setViewCount(-1)
        setArrayOfViewers([])
        setNumSeasonSelected(0)

    }, [idOfContentSelected]);

    return (
        <div className="admin-home-content">
            <div className="form-group">
                <label>Title of Content</label>
                <Select
                    options={contentOptions}
                    onChange={(data) => {
                        setIdOfContentSelected(data.value)
                        setEpisodeIdOfEpisodeSelected((""))
                        setTypeOfContentSelected("")
                    }
                    }
                />
            </div>

            {typeOfContentSelected === "movie" && (
                <>
                    <p>View count: {viewCount}</p>

                    <p>Viewers: {arrayOfViewers.map(viewer => <p>{viewer}</p>)}</p>
                </>
            )}

            {typeOfContentSelected === "series" && (
                <>
                    <div className="form-group">
                        <label>Select Season Number</label>
                        <Select
                            options={getSeasonsAsOptions(numSeasons)}
                            onChange={(data) => {
                                setNumSeasonSelected(parseInt(data.label.slice(-1)))
                            }
                        }
                        />
                    </div>

                    {numSeasonSelected != 0 && <div className="form-group">
                        <label>Select Episode Title</label>
                        <Select
                            options={listOfEpisodes}
                            onChange={data=> setEpisodeIdOfEpisodeSelected(data.value)}
                        />
                        {viewCount >= 0 && (<p>View count: {viewCount}</p>)}

                        {arrayOfViewers.length > 0 && ( <>Viewers: {arrayOfViewers.map(viewer => <p>{viewer}</p>)}
                        </>)}
                    </div>}



                </>


            )
            }

        </div> // end of div classname="admin-home-content"
    ); // end of return

} //end of WWW

export default WWW;
