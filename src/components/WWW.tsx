import Select from "react-select";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../config.ts";

interface Viewer {
    name:string,
    numTimesViewed: string,
    lastViewed:string


}

function WWW() {
    const [contentOptions, setContentOptions] = useState([]);
    const [idOfContentSelected, setIdOfContentSelected] = useState("")
    const [typeOfContentSelected, setTypeOfContentSelected] = useState("")
    const [numSeasonSelected, setNumSeasonSelected] = useState(0)
    const [episodeIdOfEpisodeSelected, setEpisodeIdOfEpisodeSelected] = useState("")
    const [viewCount, setViewCount] = useState(-1)
    const [numSeasons, setNumSeasons] = useState(0)
    const [listOfEpisodes, setListOfEpisodes] = useState([])
    const [arrayOfViewers, setArrayOfViewers] = useState<Viewer[]>([])

    function getSeasonsAsOptions(numOfSeasonsForSeries: number) {
        const seasons = []
        for (let i = 1; i <= numOfSeasonsForSeries; i++) {
            seasons.push({label: `Season ${i}`, value: i.toString()})
        }
        return seasons;
    }

    useEffect(() => {
        fetch(`${API_BASE_URL}/getallcontent`)
            .then(response => response.json())
            .then(data => {
                const formattedOptions = data.map((content: { contentId: string; title: string; }) => (
                    {value: content.contentId, label: content.title}
                ));
                setContentOptions(formattedOptions);
            })
    }, []);

    useEffect(() => {
        if (!idOfContentSelected) {
            return;
        }

        fetch(`${API_BASE_URL}/getmovieorseries`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ contentId: idOfContentSelected })
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
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ contentId: idOfContentSelected })
            }).then(response => response.text())
                .then(numViews => {
                    setViewCount(parseInt(numViews));
                })
                .catch(error => console.error("Error fetching content type:", error));
        }

        else {
            fetch(`${API_BASE_URL}/getnumseasons`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ contentId: idOfContentSelected })
            }).then(response => response.text())
                .then(numOfSeasons => {
                    setNumSeasons(parseInt(numOfSeasons));
                })
                .catch(error => console.error("Error fetching content type:", error));
        }
    }, [idOfContentSelected, typeOfContentSelected])

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
                .catch(error => console.error("Error:", error));

        }

    }, [idOfContentSelected, numSeasonSelected]);

    useEffect(() => {
        if (!episodeIdOfEpisodeSelected) return;

        fetch(`${API_BASE_URL}/getepisodeviewcount`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ episodeId: episodeIdOfEpisodeSelected })
        })
            .then(res => res.text())
            .then(numViews => {
                setViewCount(parseInt(numViews));
            })
            .catch(err => console.error("Error:", err));
    }, [episodeIdOfEpisodeSelected]);

    useEffect( () => {
        async function getViewers(id: string) {
            const response = await fetch(`${API_BASE_URL}/getviewers/${id}/${typeOfContentSelected}`);
            const viewersArray = await response.json();
            console.log("viewersArray", viewersArray)
            const arrayOfViewers = viewersArray.map( (viewer: { name: string; timesViewed: string; lastView: string; }) => ({name: viewer.name, numTimesViewed: viewer.timesViewed, lastViewed: viewer.lastView.toString()}) );

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
        setNumSeasonSelected(0)
        setEpisodeIdOfEpisodeSelected("");
        setViewCount(-1)
        setArrayOfViewers([])
    }, [idOfContentSelected]);

    useEffect(() => {
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
                    <p>Total View Count: {viewCount}</p>

                    {viewCount > 0 && (<table
                        cellPadding="8"
                        style={{borderCollapse: "collapse", width: "100%", textAlign: "center"}}
                    >
                        <thead style={{ background: "#f0f0f0" }}>
                        <tr>
                            <th>Viewer</th>
                            <th>Number of Times Viewed</th>
                            <th>Last Viewed</th>
                        </tr>
                        </thead>
                        <tbody style={{ background: "#f0f0f0" }}>
                        {arrayOfViewers.map((viewer: Viewer, i) => (
                            <tr key={i}>
                                <td>{viewer.name}</td>
                                <td>{viewer.numTimesViewed}</td>
                                <td>{viewer.lastViewed}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>)}

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
                                    value={episodeIdOfEpisodeSelected ?
                                        listOfEpisodes.find((episode) => episode.value === episodeIdOfEpisodeSelected)
                                        : null
                                    }
                                    onChange={(data) =>
                                        setEpisodeIdOfEpisodeSelected(data.value)
                                    }
                                />
                            </div>

                            {viewCount >= 0 && <p>Total View count: {viewCount}</p>}

                            {arrayOfViewers.length > 0 && (
                                <>
                                    {viewCount > 0 && (<table
                                        cellPadding="8"
                                        style={{borderCollapse: "collapse", width: "100%", textAlign: "center"}}
                                    >
                                        <thead style={{ background: "#f0f0f0" }}>
                                        <tr>
                                            <th>Viewer</th>
                                            <th>Number of Times Viewed</th>
                                            <th>Last Viewed</th>
                                        </tr>
                                        </thead>
                                        <tbody style={{ background: "#f0f0f0" }}>
                                        {arrayOfViewers.map((viewer: Viewer, i) => (
                                            <tr key={i}>
                                                <td>{viewer.name}</td>
                                                <td>{viewer.numTimesViewed}</td>
                                                <td>{viewer.lastViewed}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>)}
                                </>
                            )}
                        </>)
                    }
                </>
            )
            }
        </div>
    );

}

export default WWW;
