import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.ts";
import Select from "react-select";

function MemberHome(){
    const navigate = useNavigate();

    //User data
    const [email] = useState(localStorage.getItem("email"));
    const [memberName, setMemberName] = useState(localStorage.getItem("memberName") || "");
    const [memberId, setMemberId] = useState<string | null>(localStorage.getItem("userId"));

    //Page State
    const [sequels, setSequels] = useState([]);
    const [history, setHistory] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieInfo, setMovieInfo] = useState<any>({});
    const [loading, setLoading] = useState(true);


    //Redirects if login failed
    useEffect(() => {
        if (!email) {
            navigate("/");
        }
    }, [email, navigate]);

    //Fetch member information and sequels
    useEffect(() => {
        async function fetchData() {
            try {
                //Get all sequels
                const sequelRes = await fetch(`${API_BASE_URL}/api/movies/sequels`);
                const sequelData = await sequelRes.json();
                setSequels(sequelData);

                const infoRes = await fetch(`${API_BASE_URL}/api/movies/member-info/${email}`);
                const info = await infoRes.json();

                if (info?.user_id) {
                    setMemberId(info.user_id);
                    setMemberName(info.name || "");


                    localStorage.setItem("memberName", info.name);
                    localStorage.setItem("userId", info.user_id);
                }
                else
                {
                    console.warn("No user found for this email");
                }
            }
            catch (err)
            {
                console.error("Error fetching member data:", err);
            } finally
            {
                setLoading(false);
            }
        }

        if (email) fetchData();
    }, [email]);

    //Create and load all movies dropdown
    useEffect(() => {
        fetch(`${API_BASE_URL}/getallcontent`)
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((movie) => ({
                    value: movie.contentId,
                    label: movie.title,
                    genre: movie.genre,
                    release_date: movie.releaseDate,
                    imdb_link: movie.imdbLink,
                }));
                setMovies(formatted);
            })
            .catch((err) => console.error("Error fetching movies:", err));
    }, []);

    //Update shown movie information and sequels
    useEffect(() => {
        if (!selectedMovie)
        {
            setMovieInfo(null);
            return;
        }

        // Build the movie info for display
        setMovieInfo({
            title: selectedMovie.label,
            genre: selectedMovie.genre,
            release_date: selectedMovie.release_date,
            imdb_link: selectedMovie.imdb_link,
        });

        // Fetch sequel for the selected movie
        fetch(`${API_BASE_URL}/api/movies/sequels/${selectedMovie.value}`)
            .then(res => res.json())
            .then(data => {
                // backend returns [{ sequel_movie: "Now You See Me 2" }, ...]
                setMovieInfo(prev => ({
                    ...(prev || {}),
                    sequelList: data.map((r: any) => r.sequel_movie),
                }));
            })
            .catch(err => console.error("Error fetching sequels: ", err));
    }, [selectedMovie]);

    //Fetch watch history
    useEffect(() => {
        if (memberId) {
            fetch(`${API_BASE_URL}/api/movies/all-history/${memberId}`)
                .then(res => res.json())
                .then(data => setHistory(data))
                .catch(err => console.error("Error fetching watch history:", err));
        }
    }, [memberId]);


    if (loading) return <p style={{ color: "white" }}>Collecting your data...</p>;




    return(
        <div
            style={{
                padding: "30px",
                color: "white",
                backgroundColor: "cadetblue",
                minHeight: "100vh",
                fontFamily: "Inter, sans-serif",
        }}>
            {/* Header */}
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "28px",
                    marginBottom: "10px",
                    color: "white",
                    letterSpacing: "0.25px",
                }}
            >👋Welcome back, {memberName || email}
            </h2>

            {/* Movie Selection Bar */}
            <div style={{ maxWidth: "360px", margin: "30px auto", textAlign: "center" }}>
                <h3 style={{ marginBottom: "10px", color: "#dddddd" }}>🎥 Browse All Content</h3>
                <Select
                    options={movies}
                    onChange={(data) => setSelectedMovie(data)}
                    placeholder="Choose a movie or a series..."
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: "#1a1a1a",
                            color: "#fff",
                            borderRadius: "8px",
                            border: "1px solid #333",
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: "#fff",
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: "#1a1a1a",
                            color: "#fff",
                        }),
                        option: (base, { isFocused }) => ({
                            ...base,
                            backgroundColor: isFocused ? "#333" : "#1a1a1a",
                            color: "#fff",
                        }),
                    }}
                />
            </div>

            {/* Movie Information Card */}
            {movieInfo && (
                <div
                    style={{
                        margin: "0 auto",
                        padding: "20px",
                        borderRadius: "12px",
                        maxWidth: "420px",
                        background: "#141414",
                        border: "1px solid #222",
                        textAlign: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    }}
                >
                    <h3 style={{ color: "#ffffff", marginBottom: "10px", marginTop:"0rem" }}>{movieInfo.title}</h3>
                    <p style={{ color: "#cccccc" }}>
                        <strong>Genre:</strong> {movieInfo.genre || "N/A"}
                    </p>
                    <p>
                        <strong>Release:</strong>{" "}
                        {movieInfo.release_date
                            ? new Date(movieInfo.release_date).toLocaleDateString("en-US", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                            })
                            : "Unknown"}
                    </p>
                    {movieInfo.imdb_link && (
                        <a
                            href={movieInfo.imdb_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#00bfff",
                                textDecoration: "none",
                                fontWeight: "bold",
                            }}
                        >
                            IMDb Page
                        </a>
                    )}
                </div>
            )}

            {/* Sequel Area */}
            {movieInfo?.sequelList && (
                <div style={{ marginTop: "25px", textAlign: "center" }}>
                    <h3 style={{ color: "#dddddd" }}>🎬 Sequel</h3>
                    {movieInfo.sequelList.length > 0 ? (
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {movieInfo.sequelList.map((title: string, index: number) => (
                                <li
                                    key={index}
                                    style={{
                                        margin: "6px 0",
                                        color: "#f5f5f5",
                                        backgroundColor: "#1a1a1a",
                                        borderRadius: "6px",
                                        padding: "8px",
                                        transition: "0.3s",
                                    }}
                                >
                                    {title}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: "white" }}>No sequel for this content</p>
                    )}
                </div>
            )}

            {/* Watch History Card */}
            <div
                style={{
                    marginTop: "50px",
                    padding: "20px",
                    borderRadius: "12px",
                    maxWidth: "520px",
                    margin: "auto",
                    background: "#141414",
                    border: "1px solid #222",
                }}
            >
                <h3
                    style={{
                        textAlign: "center",
                        color: "#ddd",
                        marginBottom: "20px",
                        fontWeight: "500",
                    }}
                >
                    📺 Your Watch History
                </h3>

                {history && history.length > 0 ? (
                    <>
                        {/* Movie History */}
                        <h4
                            style={{
                                color: "#00bfff",
                                borderBottom: "1px solid #333",
                                paddingBottom: "4px",
                            }}
                        >
                            Movie History
                        </h4>
                        {history
                            .filter((h: any) => h.type === "Movie")
                            .map((h: any, i: number) => {
                                const dt = new Date(h.watch_time.replace(" ", "T"));
                                return (
                                    <p
                                        key={i}
                                        style={{
                                            color: "#f5f5f5",
                                            background: "#1a1a1a",
                                            padding: "10px",
                                            borderRadius: "8px",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Watched <b>{h.title}</b> at {dt.toLocaleTimeString()} on{" "}
                                        {dt.toLocaleDateString()}
                                    </p>
                                );
                            })}

                        {/* Series History */}
                        <h4
                            style={{
                                color: "#7fff00",
                                borderBottom: "1px solid #333",
                                paddingBottom: "4px",
                                marginTop: "20px",
                            }}
                        >
                            Series History
                        </h4>
                        {history
                            .filter((h: any) => h.type === "Episode")
                            .map((h: any, i: number) => {
                                const dt = new Date(h.watch_time.replace(" ", "T"));
                                return (
                                    <p
                                        key={i}
                                        style={{
                                            color: "#f5f5f5",
                                            background: "#1a1a1a",
                                            padding: "10px",
                                            borderRadius: "8px",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Watched <b>{h.title}</b> — <i>{h.episode_title}</i> at{" "}
                                        {dt.toLocaleTimeString()} on {dt.toLocaleDateString()}
                                    </p>
                                );
                            })}
                    </>
                ) : (
                    <p style={{ textAlign: "center", color: "#777" }}>
                        No watch history found.
                    </p>
                )}
            </div>
        </div>
    );
}

export default MemberHome