import { useState } from "react";
import { API_BASE_URL } from "../config";
import AddEpisodesModal from "./AddEpisodesModal";

interface Content {
    contentId: string;
    title: string;
    releaseDate: string;
    genre: string;
    imdbLink: string;
    type: "movie" | "series";
    duration?: string;
    numSeasons?: number;
}

const AddContentModal = ({
    contentList,
    setContentList,
    setIsModalOpen
}: {
    contentList: Content[];
    setContentList: any;
    setIsModalOpen: any;
}) => {
    const [type, setType] = useState<"movie" | "series">("movie");
    const [newSeriesId, setNewSeriesId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        releaseDate: "",
        genre: "",
        imdbLink: "",
        duration: "",
        numSeasons: ""
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dto =
            type === "movie"
                ? {
                      ...formData,
                      type: "movie",
                      duration: formData.duration,
                  }
                : {
                      ...formData,
                      type: "series",
                      numSeasons: Number(formData.numSeasons),
                  };

        const response = await fetch(`${API_BASE_URL}/addcontent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            alert("Error submitting content!");
            return;
        }

        const contentId = await response.text();

        // Add to local state
        setContentList([
            ...contentList,
            {
                contentId,
                ...dto,
            },
        ]);

        if (dto.type === "series") {
            setNewSeriesId(contentId);    // store ID for next modal (when a series)
        } else {
            setIsModalOpen(false);        // movies are done
        }
    };

    return (
        <div className="modal-container">
            <form onSubmit={handleSubmit} className="model-content">

                {/* General Fields */}
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title}
                           onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Release Date</label>
                    <input type="date" name="releaseDate"
                           value={formData.releaseDate} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Genre</label>
                    <input type="text" name="genre" value={formData.genre}
                           onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>IMDB Link</label>
                    <input type="text" name="imdbLink" value={formData.imdbLink}
                           onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value as any)}>
                        <option value="movie">Movie</option>
                        <option value="series">Series</option>
                    </select>
                </div>

                {/* Movie Fields */}
                {type === "movie" && (
                    <div className="form-group">
                        <label>Duration (HH:MM:SS)</label>
                        <input type="text" name="duration" value={formData.duration}
                               onChange={handleChange} required />
                    </div>
                )}

                {/* Series Fields */}
                {type === "series" && (
                    <div className="form-group">
                        <label>Number of Seasons</label>
                        <input type="number" name="numSeasons" value={formData.numSeasons}
                               onChange={handleChange} required />
                    </div>
                )}

                <button className="blue-btn btn" type="submit">Submit</button>
            </form>
            {newSeriesId && (
            <AddEpisodesModal
                contentId={newSeriesId}
                totalSeasons={Number(formData.numSeasons)}
                closeAllModals={() => {
                setNewSeriesId(null);
                setIsModalOpen(false);
                }}
            />
            )}
        </div>
    );
};

export default AddContentModal;