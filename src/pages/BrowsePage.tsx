import {useLocation} from "react-router-dom";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { API_BASE_URL } from "../config.ts";

function BrowsePage(){

  //User data
  const [email] = useState(localStorage.getItem("email"));
  const [memberName, setMemberName] = useState(localStorage.getItem("memberName") || "");
  const [memberId, setMemberId] = useState<string | null>(localStorage.getItem("userId"));

  //Page States
  const [content, setContent] = useState([]);
  const [contentInfo, setContentInfo] = useState<any>({});

  
  const [searchTerm, setSearchTerm] = useState("");
  const [awardWinning, setAwardWinning] = useState(false);
  const [notWatched, setNotWatched] = useState(false);

    const [openSeries, setOpenSeries] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState({});
    const [episodes, setEpisodes] = useState({});
    const [seasonCounts, setSeasonCounts] = useState({});

    const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search term:", searchTerm);
    console.log("Option 1:", awardWinning);
    console.log("Option 2:", notWatched);
    fetch(`${API_BASE_URL}/search?query=${searchTerm}&award=${awardWinning}&watched=${notWatched}&userID=${memberId}`)
    .then((res) => res.json())
            .then((data) => {
                console.log(data)
                const formatted = data.map((item) => ({
                    value: item.content_id,
                    label: item.title,
                    genre: item.genre,
                    release_date: item.release_date,
                    imdb_link: item.imdb_link,
                    contentType: item.contentType,
                }));
                setContent(formatted);
            })
        .catch((err) => console.error("Error fetching movies:", err));
  };

    async function getContentType(contentId)
    {
        const res = await fetch(`${API_BASE_URL}/getmovieorseries`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId })   // <-- FIXED
        });
        return res.text();
    }



    async function loadSeasons(contentId)
    {
        const res = await fetch(`${API_BASE_URL}/getnumseasons`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId }),
        });

        const seasons = await res.text();
        setSeasonCounts(prev => ({ ...prev, [contentId]: Number(seasons) }));
    }

    async function loadEpisodes(contentId, seasonNum)
    {
        const res = await fetch(`${API_BASE_URL}/getepisodes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contentId,
                seasonNum,
            }),
        });

        const eps = await res.json();

        setEpisodes(prev => ({
            ...prev,
            [contentId]: eps,
        }));
    }

    async function streamEpisode(contentId, episodeId, seasonNum, userId)
    {
        try {
            const res = await fetch(`${API_BASE_URL}/movies/stream/episode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    contentId,
                    episodeId,
                    seasonNum,
                }),
            });

            if (res.ok) {
                alert("Episode streaming started! Added to your history.");
            } else {
                alert("Failed to start episode stream.");
            }
        } catch (err) {
            console.error(err);
            alert("Error starting streaming.");
        }
    }

    return (
    <div
      style={{
        display: "flex",
        color: "white",
        backgroundColor: "cadetblue",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: " #106881ff",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* Home Button */}
        <button
          onClick={() => navigate("/member/home")}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Home
        </button>

        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              width: "250px",
            }}
          />

          {/* Checkboxes */}
          <label>
            <input
              type="checkbox"
              checked={awardWinning}
              onChange={(e) => setAwardWinning(e.target.checked)}
              style={{ marginRight: "0.5rem" }}
            />
            Award-Winning Only
          </label>

          <label>
            <input
              type="checkbox"
              checked={notWatched}
              onChange={(e) => setNotWatched(e.target.checked)}
              style={{ marginRight: "0.5rem" }}
            />
            Haven't Watched
          </label>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Search
          </button>
        </form>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "cadetblue",
        }}
      >
        {/* Display Search Results */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem",
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          {content.length === 0 ? (
            <p style={{ color: "white", fontSize: "1.2rem" }}>No results yet. Try a search!</p>
          ) : (
            content.map((item) => (
                <div
                    key={item.value}
                    style={{
                        backgroundColor: "#0d4d5e",
                        padding: "1rem",
                        borderRadius: "10px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    }}
                >
                    <h3 style={{ marginBottom: "0.5rem" }}>{item.label}</h3>
                    <p><strong>Genre:</strong> {item.genre}</p>
                    <p><strong>Release Date:</strong> {item.release_date}</p>

                    <a
                        href={item.imdb_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#ffd700" }}
                    >
                        View on IMDB
                    </a>

                    {/* Movie Streaming Button */}
                    {item.contentType === "movie" && (
                        <button
                            onClick={() => {
                                fetch(`${API_BASE_URL}/movies/stream/movie`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        userId: memberId,
                                        contentId: item.value,
                                    }),
                                }).then((res) => {
                                    if (res.status === 201) alert("Streaming started! Recorded in your history.");
                                    else alert("Failed to start streaming");
                                });
                            }}
                            style={{
                                marginTop: "10px",
                                backgroundColor: "#0084ff",
                                padding: "8px 14px",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                                color: "white",
                            }}
                        >
                            ▶ Watch Movie
                        </button>
                    )}

                    {/* Series Card  */}
                    {item.contentType === "series" && (
                        <>
                            {/* Series Card Expand Button */}
                            <button
                                onClick={async () => {
                                    const type = await getContentType(item.value);

                                    if (type === "series") {
                                        setOpenSeries((prev) => (prev === item.value ? null : item.value));
                                        loadSeasons(item.value);
                                    }
                                }}
                                style={{
                                    marginTop: "10px",
                                    backgroundColor: "darkgreen",
                                    padding: "8px 14px",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "white",
                                }}
                            >
                                📺 View Seasons
                            </button>

                            {/* Expanded Series Card */}
                            {openSeries === item.value && (
                                <div
                                    style={{
                                        marginTop: "15px",
                                        backgroundColor: "#083b46",
                                        padding: "1rem",
                                        borderRadius: "10px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                                    }}
                                >
                                    <h4 style={{ color: "white", marginBottom: "10px" }}>Seasons</h4>

                                    {/* Seasons list */}
                                    {Array.from({ length: seasonCounts[item.value] || 0 }, (_, i) => (
                                        <button
                                            key={i}
                                            style={{
                                                width: "100%",
                                                margin: "6px 0",
                                                padding: "10px",
                                                backgroundColor: "#0d4d5e",
                                                borderRadius: "6px",
                                                color: "white",
                                            }}
                                            onClick={() => {
                                                setSelectedSeason({ [item.value]: i + 1 });
                                                loadEpisodes(item.value, i + 1);
                                            }}
                                        >
                                            Season {i + 1}
                                        </button>
                                    ))}

                                    {/* Episodes of Season Selected */}
                                    {selectedSeason[item.value] && episodes[item.value] && (
                                        <div style={{ marginTop: "15px" }}>
                                            <h4>Episodes</h4>

                                            {episodes[item.value].map((ep) => (
                                                <div
                                                    key={ep.episodeId}
                                                    style={{
                                                        padding: "10px",
                                                        marginBottom: "8px",
                                                        backgroundColor: "#0a2f38",
                                                        borderRadius: "8px",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <span>{ep.title}</span>

                                                    <button
                                                        onClick={() =>
                                                            streamEpisode(
                                                                item.value,
                                                                ep.episodeId,
                                                                ep.seasonNum,
                                                                memberId
                                                            )
                                                        }
                                                        style={{
                                                            backgroundColor: "#0099ff",
                                                            padding: "6px 10px",
                                                            borderRadius: "6px",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            color: "white",
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
                        </>
                    )}
                </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default BrowsePage;