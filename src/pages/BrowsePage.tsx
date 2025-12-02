import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { useEffect } from "react";
import { API_BASE_URL } from "../config.ts";

function BrowsePage(){

  //User data
  const [email] = useState(localStorage.getItem("email"));
  const [memberName, setMemberName] = useState(localStorage.getItem("memberName") || "");
  const [memberId, setMemberId] = useState<string | null>(localStorage.getItem("userId"));

  //Page States
  const [content, setContent] = useState([]);
  const [contentInfo, setContentInfo] = useState<any>({});
  const [posters, setPosters] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [awardWinning, setAwardWinning] = useState(false);
  const [notWatched, setNotWatched] = useState(false);

  const [openSeries, setOpenSeries] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState({});
  const [episodes, setEpisodes] = useState({});
  const [seasonCounts, setSeasonCounts] = useState({});

    const navigate = useNavigate();

    async function showContentPoster(title: string, type: string) {
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

        // Try to find an EXACT title match first
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

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(
                `${API_BASE_URL}/search?query=${searchTerm}&award=${awardWinning}&watched=${notWatched}&userID=${memberId}`
            );

            const data = await res.json();

            const formatted = data.map((item: any) => ({
                value: item.content_id,
                label: item.title,
                genre: item.genre,
                release_date: item.release_date,
                imdb_link: item.imdb_link,
                contentType: item.contentType,
            }));

            formatted.sort((a, b) => a.label.localeCompare(b.label));

            setContent(formatted);

            const postersMap: any = {};

            for (const item of formatted) {
                const poster = await showContentPoster(item.label, item.contentType);
                postersMap[item.value] = poster;
            }

            setPosters(postersMap);

        } catch (err) {
            console.error("Error fetching movies:", err);
        }
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

    async function loadAllContent() {
        try {
            const res = await fetch(`${API_BASE_URL}/search?query=&award=false&watched=false&userID=${memberId}`);
            const data = await res.json();

            const formatted = data.map((item) => ({
                value: item.content_id,
                label: item.title,
                genre: item.genre,
                release_date: item.release_date,
                imdb_link: item.imdb_link,
                contentType: item.contentType,
            }));

            formatted.sort((a, b) => a.label.localeCompare(b.label));

            setContent(formatted);

            const postersMap: any = {};
            for (const item of formatted) {
                const poster = await showContentPoster(item.label, item.contentType);
                postersMap[item.value] = poster;
            }

            setPosters(postersMap);

        } catch (err) {
            console.error("Error loading all content:", err);
        }
    }

    useEffect(() => {
        loadAllContent();
    }, []);

    return (
    <div
      style={{
        display: "flex",
        color: "white",
        backgroundColor: "#0d0d0d",
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
            backgroundColor: "#111111",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Home Button */}
        <button
          onClick={() => navigate("/member/home")}
          style={{
            backgroundColor: "rgb(186,2,2)",
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
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.2)",
                fontSize: "1rem",
                width: "250px",
                backgroundColor: "#1a1a1a",
                color: "white",
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
              backgroundColor: "rgb(186,2,2)",
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
          alignItems: "flex-start",
            paddingTop: "50px",
          backgroundColor: "#1c1c1c",
        }}
      >
        {/* Display Search Results */}
          <div
              style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "2.5rem",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: "1200px",
                  margin: "0 auto",
                  padding: "40px 20px",
              }}
          >
              {content.map((item) => (
                <div
                    key={item.value}
                    onClick={() => navigate(`/content/${item.value}`)}
                    style={{
                        backgroundColor: "#111111",
                        padding: "1.5rem",
                        borderRadius: "14px",
                        boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
                        width: "260px",
                        margin: "0 auto",
                        cursor: "pointer",
                        transition: "transform 0.25s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    <h3 style={{
                        marginBottom: "0.5rem",
                        color: "white",
                        textAlign: "center",
                    }}>{item.label}</h3>
                    {posters[item.value] && (
                        <img
                            src={posters[item.value]}
                            alt={item.label}
                            style={{
                                width: "100%",
                                height: "350px",
                                objectFit: "cover",
                                borderRadius: "10px",
                                marginBottom: "1rem"
                            }}
                        />
                    )}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                            marginTop: "0.75rem",
                            alignItems: "center",
                        }}
                    >
                        {/* Movie Streaming Button */}
                        {item.contentType === "movie" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent opening content window accidentally
                                    fetch(`${API_BASE_URL}/api/movies/stream/movie`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            userId: memberId,
                                            contentId: item.value,
                                        }),
                                    }).then((res) => {
                                        if (res.status === 201) alert("Streaming started! Recorded.");
                                        else alert("Failed to start streaming");
                                    });
                                }}
                                style={{
                                    backgroundColor: "rgb(186,2,2)",
                                    padding: "8px 14px",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "black",
                                    width: "fit-content",
                                }}
                            >
                                ▶ Watch Movie
                            </button>
                        )}
                    </div>

                    {/* Series Card  */}
                    {item.contentType === "series" && (
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            {/* Series Card Expansion Button */}
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
                                    backgroundColor: "rgb(184,198,2)",
                                    padding: "8px 14px",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "black",
                                }}
                            >
                                📺 View Seasons
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}

export default BrowsePage;