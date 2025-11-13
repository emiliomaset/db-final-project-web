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
  const [movies, setMovies] = useState([]);
  const [movieInfo, setMovieInfo] = useState<any>({});

  
  const [searchTerm, setSearchTerm] = useState("");
  const [awardWinning, setAwardWinning] = useState(false);
  const [notWatched, setNotWatched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search term:", searchTerm);
    console.log("Option 1:", awardWinning);
    console.log("Option 2:", notWatched);
    fetch(`${API_BASE_URL}/search/${searchTerm}/${awardWinning}/${notWatched}`)
    .then((res) => res.json())
            .then((data) => {
                console.log(data)
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
  };

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
        
      </main>
    </div>
  );
}

export default BrowsePage;