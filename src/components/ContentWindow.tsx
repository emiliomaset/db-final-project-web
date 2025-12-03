import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.ts";

function ContentDetails() {
    const { contentId } = useParams();
    const navigate = useNavigate();

    const [content, setContent] = useState(null);
    const [type, setType] = useState("");
    const [sequels, setSequels] = useState([]);
    const [seasonCount, setSeasonCount] = useState(0);
    const [episodes, setEpisodes] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [poster, setPoster] = useState<string | null>(null);

    const memberId = localStorage.getItem("userId");

    async function showContentPoster(title: string, type: string)
    {
        const apiKey = "b852861278c3dd4b02948d2ceef07609";

        // Decide endpoint based on type
        const endpoint =
            type === "series"
                ? "https://api.themoviedb.org/3/search/tv"
                : "https://api.themoviedb.org/3/search/movie";

        const res = await fetch(
            `${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(title)}`
        );
        const data = await res.json();

        if (!data.results || data.results.length === 0) return null;

        const lowerTitle = title.toLowerCase();

        const exact =
            data.results.find(
                (r: any) =>
                    r.name?.toLowerCase() === lowerTitle ||
                    r.title?.toLowerCase() === lowerTitle ||
                    r.original_name?.toLowerCase() === lowerTitle ||
                    r.original_title?.toLowerCase() === lowerTitle
            ) || data.results[0];

        if (!exact.poster_path) return null;

        return `https://image.tmdb.org/t/p/w500${exact.poster_path}`;
    }

    useEffect(() => {
        if (!contentId) return;

        (async () => {

            const typeRes = await fetch(`${API_BASE_URL}/getmovieorseries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contentId }),
            });
            const contentType = await typeRes.text();
            setType(contentType);


            const detailsRes = await fetch(`${API_BASE_URL}/content-details/${contentId}`);
            const data = await detailsRes.json();
            setContent(data);


            const poster = await showContentPoster(data.title, contentType);
            setPoster(poster);
        })();
    }, [contentId]);



    useEffect(() => {
        if (type !== "series") return;

        fetch(`${API_BASE_URL}/getnumseasons`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId }),
        })
            .then((res) => res.text())
            .then((count) => setSeasonCount(parseInt(count)));
    }, [type]);


    const loadEpisodes = (seasonNum) => {
        setSelectedSeason(seasonNum);

        fetch(`${API_BASE_URL}/getepisodes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId, seasonNum }),
        })
            .then((res) => res.json())
            .then((eps) => setEpisodes(eps));
    };

    const streamMovie = () => {
        fetch(`${API_BASE_URL}/movies/stream/movie`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: memberId, contentId }),
        }).then((res) => {
            if (res.status === 201) alert("Now streaming movie");
            else alert("Streaming failed");
        });
    };

    const streamEpisode = (ep) => {
        fetch(`${API_BASE_URL}/movies/stream/episode`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: memberId,
                contentId,
                seasonNum: ep.seasonNum,
                episodeId: ep.episodeId,
            }),
        }).then((res) => {
            if (res.status === 201) alert("Now streaming episode");
            else alert("Failed to stream episode");
        });
    };


    useEffect(() => {
        if (!contentId || type !== "movie") return;

        fetch(`${API_BASE_URL}/movies/sequels/${contentId}`)
            .then(res => res.json())
            .then(data => {
                setSequels(data.map((r: any) => r.sequel_movie));
            })
            .catch(err => console.error("Error fetching sequels:", err));
    }, [contentId, type]);


    if (!content)
        return (
            <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>
                Loading...
            </div>
        );

    return (
        <div
            style={{
                minHeight: "100vh",
                color: "white",
                backgroundColor: "#1c1c1c",
                padding: "2rem",
            }}
        >
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: "1rem",
                    textDecorationColor: "#000000",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                }}
            >
                ◀ Back
            </button>
            {/*Content Poster*/}
            {poster && (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <img
                        src={poster}
                        alt="Poster"
                        style={{
                            width: "280px",
                            borderRadius: "12px",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
                        }}
                    />
                </div>
            )}
            {/*Title*/}
            <h1>{content.title}</h1>

            <p>
                <strong>Genre:</strong> {content.genre}
            </p>
            <p>
                <strong>Release Date:</strong>{" "}
                {new Date(content.releaseDate).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                })}
            </p>

            {/*Movie Stream Card*/}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "1rem",
                    marginTop: "1.5rem",
                }}
            >
                <a
                    href={content.imdbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "#019185",
                        fontSize: "1.1rem",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    View on IMDB
                </a>

                {/* Streaming a movie button */}
                {type === "movie" && (
                    <button
                        onClick={streamMovie}
                        style={{
                            backgroundColor: "rgb(186,2,2)",
                            padding: "10px 18px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            color: "black",
                            fontSize: "1rem",
                            width: "fit-content",
                        }}
                    >
                        ▶ Watch Movie
                    </button>
                )}
            </div>

            {/* Sequel Section */}
            {type === "movie" && sequels.length > 0 && (
                <div style={{ marginTop: "2rem" }}>
                    <h2 style={{ color: "#fff" }}>Sequel</h2>
                    <ul
                        style={{
                            listStyleType: "none",
                            padding: "0",
                            margin: "20px auto",
                            width: "320px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                    {sequels.map((title, index) => (
                        <li
                            key={index}
                            style={{
                                padding: "14px 0",
                                margin: "0 12px",
                                backgroundColor: "#000000",
                                borderRadius: "10px",
                                color: "white",
                                textAlign: "center",
                                fontSize: "1.1rem",
                                fontWeight: "500",
                                border: "1px solid #333",
                            }}
                        >
                            {title}
                        </li>
                    ))}
                    </ul>
                </div>
            )}

            {/* Series Season */}
            {type === "series" && (
                <div style={{ marginTop: "2rem", color: "white" }}>
                    <h2>Seasons</h2>

                    {[...Array(seasonCount)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => loadEpisodes(i + 1)}
                            style={{
                                margin: "6px",
                                padding: "10px 16px",
                                borderRadius: "8px",
                                backgroundColor: "rgb(184,198,2)",
                                border: "none",
                                cursor: "pointer",
                                color: "#000000",
                            }}
                        >
                            Season {i + 1}
                        </button>
                    ))}

                    {/* Episodes */}
                    {selectedSeason && (
                        <div style={{ marginTop: "2rem" }}>
                            <h3>Episodes (Season {selectedSeason})</h3>

                            {episodes.map((ep) => (
                                <div
                                    key={ep.episodeId}
                                    style={{
                                        padding: "10px",
                                        marginBottom: "8px",
                                        backgroundColor: "#000000",
                                        borderRadius: "8px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <span>{ep.title}</span>

                                    <button
                                        onClick={() => streamEpisode(ep)}
                                        style={{
                                            backgroundColor: "rgb(186,2,2)",
                                            padding: "6px 10px",
                                            borderRadius: "6px",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "black",
                                        }}
                                    >
                                        ▶ Watch Episode
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
export default ContentDetails;
