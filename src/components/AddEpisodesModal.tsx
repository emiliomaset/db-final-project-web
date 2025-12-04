import { useState } from "react";
import { API_BASE_URL } from "../config";

interface EpisodeInput {
    title: string;
    duration: string;
    seasonNum: number;
}

const AddEpisodesModal = ({ contentId, totalSeasons, closeAllModals }) => {
    const [episodes, setEpisodes] = useState<EpisodeInput[]>([
        { title: "", duration: "", seasonNum: 1 }
    ]);

    const addEpisodeRow = () => {
        setEpisodes([...episodes, { title: "", duration: "", seasonNum: 1 }]);
    };

    

    const updateEpisode = (index, field, value) => {
        const updated = [...episodes];
        updated[index][field] = value;
        setEpisodes(updated);
    };

    const submitEpisodes = async () => {
        const payload = episodes.map(ep => ({
            contentId,
            title: ep.title,
            duration: ep.duration,
            seasonNum: ep.seasonNum
        }));

        const response = await fetch(`${API_BASE_URL}/addepisodes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            alert("Error adding episodes!");
            return;
        }

        alert("Episodes added successfully!");
        closeAllModals();
    };

    return (
        <div className="modal-container">
            <div className="model-content">

                <h2>Add Episodes</h2>

                {episodes.map((ep, i) => (
                    <div key={i} className="form-row">
                        <input
                            type="text"
                            placeholder="Episode Title"
                            value={ep.title}
                            onChange={e => updateEpisode(i, "title", e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Duration (HH:MM:SS)"
                            value={ep.duration}
                            onChange={e => updateEpisode(i, "duration", e.target.value)}
                            required
                        />

                        <select
                            value={ep.seasonNum}
                            onChange={(e) => updateEpisode(i, "seasonNum", Number(e.target.value))}
                            required
                            style={{ padding: "8px", fontSize: "1em" }}
                        >
                            <option value="" disabled>Select Season</option>
                            {Array.from({ length: totalSeasons }, (_, idx) => (
                            <option key={idx + 1} value={idx + 1}>
                                Season {idx + 1}
                            </option>
                            ))}
                        </select>
                    </div>
                ))}

                <button className="blue-btn btn" onClick={addEpisodeRow}>
                    + Add Another Episode
                </button>

                <button className="blue-btn btn" onClick={submitEpisodes}>
                    Submit All Episodes
                </button>
            </div>
        </div>
    );
};

export default AddEpisodesModal;
