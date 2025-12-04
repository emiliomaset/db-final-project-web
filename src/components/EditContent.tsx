import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import AddContentModal from "./AddContentModal.tsx";

interface Content {
    contentId: string;
    title: string;
    releaseDate: string;
    genre: string;
    imdbLink: string;
    type: "movie" | "series";
    duration?: string; // for movie
    numSeasons?: number; // for series
}

const EditContent = () => {
    const [contentList, setContentList] = useState<Content[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            const response = await fetch(`${API_BASE_URL}/getallcontent`);
            if (!response.ok)
                throw new Error(`Error fetching content: ${response.status}`);

            const result: Content[] = await response.json();
            setContentList(result);
            setIsLoading(false);
        };

        fetchContent();
    }, []);

    const removeContent = async (index: number) => {
        const contentToRemove = contentList[index];
        const response = await fetch(
            `${API_BASE_URL}/removecontent/${contentToRemove.contentId}`,
            { method: "POST" }
        );

        if (!response.ok)
            throw new Error(`Error removing content: ${response.status}`);

        setContentList((prev) => [
            ...prev.slice(0, index),
            ...prev.slice(index + 1),
        ]);

        alert(`${contentToRemove.title} has been removed!`);
    };

    return (
        <div className="admin-home-content">

            {!isLoading && contentList.length > 0 && (
                <table
                    cellPadding="15"
                    style={{
                        borderCollapse: "collapse",
                        width: "80%",
                        margin: "auto",
                        textAlign: "center",
                        background: "#f0f0f0",
                        fontSize: "1em",
                    }}
                >
                    <thead>
                        <tr>
                            <th>Content ID</th>
                            <th>Title</th>
                            <th>Release Date</th>
                            <th>Genre</th>
                            <th>IMDB</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {contentList.map((c, i) => (
                            <tr key={c.contentId}>
                                <td>{c.contentId}</td>
                                <td>{c.title}</td>
                                <td>{c.releaseDate}</td>
                                <td>{c.genre}</td>
                                <td><a href={c.imdbLink}>Link</a></td>
                                <td>
                                    <button className="blue-btn btn" onClick={() => removeContent(i)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button className="blue-btn btn" onClick={() => setIsModalOpen(true)}>
                Add Content
            </button>

            {isModalOpen && (
                <AddContentModal
                    contentList={contentList}
                    setContentList={setContentList}
                    setIsModalOpen={setIsModalOpen}
                />
            )}
        </div>
    );
};

export default EditContent;