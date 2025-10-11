import { useEffect, useState } from "react";
import axios, { type CancelTokenSource } from "axios";

type Anime = {
  id: number;
  title: string;
  thumbnailUrl: string;
};

export default function AnimeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelToken, setCancelToken] = useState<CancelTokenSource | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError("");
      return;
    }

    const fetchData = async () => {
      // Cancel previous request if still pending
      if (cancelToken) {
        cancelToken.cancel("Operation canceled due to new request.");
      }

      const source = axios.CancelToken.source();
      setCancelToken(source);
      setLoading(true);
      setError("");

      try {
        const response = await axios.get<Anime[]>("http://localhost:3000/admin/search", {
          params: { q: query },
          cancelToken: source.token,
          withCredentials: true
        });

        setResults(response.data);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          // Cancelled - do nothing
        } else {
          setError(err.response?.data?.error || "Failed to fetch results.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup token on unmount
    return () => {
      cancelToken?.cancel("Component unmounted.");
    };
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Search Anime</h2>

      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Start typing an anime title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="text-sm text-gray-500 mt-4">Searching...</p>}
      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      <div className="mt-6 space-y-4">
        {results.map((anime) => (
          <div
            key={anime.id}
            className="flex items-center gap-4 border p-3 rounded hover:shadow-sm transition"
          >
            <img
              src={anime.thumbnailUrl}
              alt={anime.title}
              className="w-16 h-24 object-cover rounded"
            />
            <p className="text-lg font-medium text-gray-800">{anime.title}</p>
          </div>
        ))}

        {results.length === 0 && !loading && query && (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
