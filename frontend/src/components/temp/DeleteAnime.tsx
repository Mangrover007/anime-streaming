import { useState } from "react";
import axios from "axios";

export default function DeleteAnime() {
  const [animeId, setAnimeId] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleDelete = async () => {
    if (!animeId) {
      setStatus({ type: "error", message: "Anime ID is required." });
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/admin/${animeId}`, {
        withCredentials: true   
      });

      setStatus({ type: "success", message: response.data.message });
      setAnimeId("");
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Failed to delete anime.";
      setStatus({ type: "error", message });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Anime</h2>

      <label
        htmlFor="animeId"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Anime ID
      </label>
      <input
        id="animeId"
        type="number"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        value={animeId}
        onChange={(e) => setAnimeId(e.target.value)}
        placeholder="Enter Anime ID"
      />

      <button
        onClick={handleDelete}
        className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200"
      >
        Delete Anime
      </button>

      {status.message && (
        <div
          className={`mt-4 p-3 rounded ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
