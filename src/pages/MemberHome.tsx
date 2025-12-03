import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.ts";
import Select from "react-select";

function MemberHome(){
    const navigate = useNavigate();

    const [email] = useState(localStorage.getItem("email"));
    const [memberName, setMemberName] = useState(localStorage.getItem("memberName") || "");
    const [memberId, setMemberId] = useState<string | null>(localStorage.getItem("userId"));

    const [sequels, setSequels] = useState([]);
    const [history, setHistory] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieInfo, setMovieInfo] = useState<any>({});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!email) {
            navigate("/");
        }
    }, [email, navigate]);

    useEffect(() => {
        async function fetchData() {
            try {
                const sequelRes = await fetch(`${API_BASE_URL}/movies/sequels`);
                const sequelData = await sequelRes.json();
                setSequels(sequelData);

                const infoRes = await fetch(`${API_BASE_URL}/movies/member-info/${email}`);
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

    useEffect(() => {
        if (!selectedMovie)
        {
            setMovieInfo(null);
            return;
        }

        setMovieInfo({
            title: selectedMovie.label,
            genre: selectedMovie.genre,
            release_date: selectedMovie.release_date,
            imdb_link: selectedMovie.imdb_link,
        });

        fetch(`${API_BASE_URL}/movies/sequels/${selectedMovie.value}`)
            .then(res => res.json())
            .then(data => {
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
            fetch(`${API_BASE_URL}/movies/all-history/${memberId}`)
                .then(res => res.json())
                .then(data => setHistory(data))
                .catch(err => console.error("Error fetching watch history:", err));
        }
    }, [memberId]);


    if (loading) return <p style={{ color: "white" }}>Loading...</p>;

    function WatchHistoryTable({ title, rows, color }) {
        const [open, setOpen] = useState(false);

        return (
            <div style={{ marginBottom: "25px" }}>

                <div
                    onClick={() => setOpen(!open)}
                    style={{
                        cursor: "pointer",
                        padding: "12px 16px",
                        background: "#1a1a1a",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        border: `1px solid ${color}`,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                    }}
                >
                    <h3 style={{ margin: 0, color }}>{title}</h3>
                    <span style={{ fontSize: "20px", color }}>{open ? "▼" : "►"}</span>
                </div>


                <div
                    style={{
                        maxHeight: open ? "500px" : "0px",
                        overflow: "hidden",
                        transition: "max-height 0.35s ease",
                        background: "#141414",
                        borderRadius: "10px",
                        border: "1px solid #222",
                    }}
                >
                    <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
                        <thead>
                        <tr style={{ borderBottom: "1px solid #333", color: "#ccc" }}>
                            <th style={{ padding: "10px", textAlign: "left" }}>Title</th>

                            {title.includes("Series") && (
                                <th style={{ padding: "10px", textAlign: "center" }}>Episode</th>
                            )}

                            <th style={{ padding: "10px", textAlign: "center" }}>Date</th>
                            <th style={{ padding: "10px", textAlign: "center" }}>Time</th>
                        </tr>
                        </thead>

                        <tbody>
                        {rows.map((item, idx) => {
                            const dt = new Date(item.watch_time.replace(" ", "T"));

                            return (
                                <tr key={idx} style={{ borderBottom: "1px solid #222" }}>

                                    <td style={{ padding: "12px", fontWeight: "600", textAlign:"left" }}>
                                        {item.title}
                                    </td>


                                    {title.includes("Series") && (
                                        <td style={{ padding: "12px", textAlign: "center" }}>
                                            {item.episode_title || "—"}
                                        </td>
                                    )}

                                    <td style={{ padding: "12px", textAlign: "center" }}>
                                        {dt.toLocaleDateString()}
                                    </td>

                                    <td style={{ padding: "12px", textAlign: "center" }}>
                                        {dt.toLocaleTimeString()}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }



    return(
        <div
            style={{
                padding: "30px",
                color: "white",
                backgroundColor: "#1c1c1c",
                minHeight: "100vh",
                fontFamily: "Inter, sans-serif",
            }}>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "5vh",
                    gap: "5rem"
                }}
            >
                <button
                    className="search-btn"
                    style={{
                        textAlign: "center",
                        borderRadius: "12px",
                        backgroundColor: "black",
                        fontSize: "1rem",
                        minWidth: "min-content",
                        width: "15vw",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/browse")}
                >
                    Search
                </button>

                <button
                    style={{
                        textAlign: "center",
                        borderRadius: "12px",
                        backgroundColor: "black",
                        fontSize: "1rem",
                        minWidth: "min-content",
                        width: "15vw",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/")}
                >
                    Logout
                </button>
            </div>


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

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "20px" }}>
                <button
                    onClick={() => navigate("/member/profile")}
                    style={{
                        textAlign: "center",
                        borderRadius: "12px",
                        backgroundColor: "#1a1a1a",
                        fontSize: "0.95rem",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                    }}
                >
                    Edit Profile
                </button>
            </div>


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
                    <p style={{ color: "#ffffff" }}>
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


            {movieInfo?.sequelList && (
                <div style={{ marginTop: "25px", textAlign: "center" }}>
                    <h3 style={{ color: "#ffffff" }}>🎬 Sequel (s)</h3>
                    {movieInfo.sequelList.length > 0 ? (
                        <ul style={{ listStyleType: "none", padding: 0, width: "30%", marginLeft: "auto", marginRight: "auto", marginBottom: "2rem" }}>
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
                                        fontSize: "1.1rem"
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


            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "30vh",
                    marginTop: "20px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "700px",
                        padding: "20px",
                        borderRadius: "16px",
                        background: "black",
                        border: "1px solid #222",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                    }}
                >
                    <h3
                        style={{
                            textAlign: "center",
                            color: "#ffffff",
                            marginBottom: "20px",
                            fontWeight: "500",
                        }}
                    >
                        📺 Your Watch History
                    </h3>

                    {history && history.length > 0 ? (
                        <>
                            <div className="scrollbar-table" style={{ maxHeight: "300px", overflow: "hidden", marginBottom: "20px" }}>
                                <WatchHistoryTable
                                    title=" Movie History"
                                    color="red"
                                    rows={history.filter((h) => h.type === "Movie")}
                                />
                            </div>
                            <div className="scrollbar-table" style={{ maxHeight: "300px", overflow: "hidden" }}>
                                <WatchHistoryTable
                                    title=" Series History"
                                    color="rgb(184,198,2)"
                                    rows={history.filter((h) => h.type === "Episode")}
                                />
                            </div>
                        </>
                    ) : (
                        <p style={{ textAlign: "center", color: "#777" }}>
                            No watch history found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
export default MemberHome