import { useEffect, useState } from "react";
import axios from "axios";

// ✅ Define the Anime type
interface Genre {
  name: string;
}

interface Season {
  id: number;
  // Add other fields if needed later
}

interface Anime {
  id: number;
  thumbnailUrl: string;
  title: string;
  description: string;
  author: string;
  rating: number;
  status: string;
  startedAiring: string;
  finishedAiring: string | null;
  genres: Genre[];
  seasons: Season[];
  createdAt: string;
  updatedAt: string;
}

export default function AllAnimeList() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await axios.get<Anime[]>("http://localhost:3000/admin/", {
            withCredentials: true
        });
        setAnimes(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch anime list.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 mt-10">Loading anime...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">All Anime</h1>

      {animes.length === 0 ? (
        <p className="text-gray-500">No anime records found.</p>
      ) : (
        <div className="space-y-6">
          {animes.map((anime) => (
            <div
              key={anime.id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={anime.thumbnailUrl}
                  alt={anime.title}
                  className="w-full md:w-48 h-auto rounded object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{anime.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{anime.description}</p>

                  <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-medium">Author:</span> {anime.author}</p>
                    <p><span className="font-medium">Rating:</span> {anime.rating ?? "N/A"}</p>
                    <p><span className="font-medium">Status:</span> {anime.status}</p>
                    <p><span className="font-medium">Started:</span> {anime.startedAiring?.slice(0, 10)}</p>
                    <p><span className="font-medium">Finished:</span> {anime.finishedAiring?.slice(0, 10) || "Ongoing"}</p>
                    <p>
                      <span className="font-medium">Genres:</span>{" "}
                      {anime.genres.map((g) => g.name).join(", ") || "None"}
                    </p>
                    <p><span className="font-medium">Seasons:</span> {anime.seasons?.length || 0}</p>
                    <p className="text-xs text-gray-400">
                      Created at: {anime.createdAt?.slice(0, 19).replace("T", " ")} | Updated: {anime.updatedAt?.slice(0, 19).replace("T", " ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
