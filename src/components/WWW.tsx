import Select from "react-select";
import {useEffect, useState} from "react";
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
        for (let i = 1; i <= numOfSeasonsForSeries; i++) {
            seasons.push({label: `Season ${i}`, value: i.toString()})
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
        // setArrayOfViewers([])

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
        // setViewCount(-1)
        // setArrayOfViewers([])

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

    useEffect(() => { // when idOfContentSelected changes, reset all states that rely on it
        setNumSeasonSelected(0)
        setEpisodeIdOfEpisodeSelected("");
        setViewCount(-1)
        setArrayOfViewers([])
    }, [idOfContentSelected]);

    useEffect(() => { // when numSeasonSelected changes, reset all states that rely on it
        setEpisodeIdOfEpisodeSelected("");
        setViewCount(-1);
        setArrayOfViewers([]);
    }, [numSeasonSelected]);

    return (
        <div className="admin-home-content">
            <div className="form-group">
                <label>Title of Content</label>
                <Select
                    options={contentOptions}
                    onChange={(data) => setIdOfContentSelected(data.value)
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
                            onChange={(data) => setNumSeasonSelected(data ? parseInt(data.value) : 0)}
                            isClearable
                        />
                    </div>

                    {numSeasonSelected !== 0 && (
                        <>
                            <div className="form-group">
                                <label>Select Episode Title</label>
                                <Select
                                    options={listOfEpisodes}
                                    value={episodeIdOfEpisodeSelected ? // make the value displayed in this field either the title of the
                                        // episode that has id matching episodeIdOfEpisodeSelected, or if
                                        // episodeIdOfEpisodeSelected is "", make it null so nothing is displayed
                                        listOfEpisodes.find((episode) => episode.value === episodeIdOfEpisodeSelected)
                                        : null
                                    }
                                    onChange={(data) =>
                                        setEpisodeIdOfEpisodeSelected(data.value)
                                    }
                                />
                            </div>

                            {viewCount >= 0 && <p>View count: {viewCount}</p>}

                            {arrayOfViewers.length > 0 && (
                                <>
                                    Viewers: {arrayOfViewers.map((viewer) => <p key={viewer}>{viewer}</p>)}
                                </>
                            )}
                        </>)
                    }
                </>
            ) // end of precedent stuff in series stuff
            }
        </div> // end of div classname="admin-home-content"
    ); // end of return

} //end of WWW

export default WWW;
