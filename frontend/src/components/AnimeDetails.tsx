import { useState, useEffect, useContext } from "react";
import { NavLink, useParams } from "react-router-dom";
import { COMMON_URL } from "../api"; // Assuming this is where your API is defined
import type { Anime } from "./Home";
import { PORTAL } from "../App";

export type Season = {
  id: number;
  animeId: number;
  seasonNumber: number;
  startedAiring: string; // ISO date string
  finishedAiring: string; // ISO date string
  isFinished: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

const AnimeDetails = () => {
  const { animeName } = useParams<{ animeName: string }>(); // Get the anime ID from the URL
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [seasons, setSeasons] = useState<Season[]>([]);

  const { seasonList } = useContext(PORTAL);

  useEffect(() => {
    if (seasons.length !== 0) {
      seasonList.current = seasons
      console.log("update or not")
      console.log(seasonList.current);
    }
    // console.log("THIS IS SEASONS", seasons);
  }, [seasons]);

  useEffect(() => {
    async function getSeasons() {
      if (anime) {
        const res = await COMMON_URL.get(`/season/${anime.title}`)
        setSeasons(res.data);
        // console.log(res.data);
      }
    }
    getSeasons();
  }, [anime]);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        const response = await COMMON_URL.get(`/anime/${animeName}`);
        setAnime(response.data); // Set the fetched data to state
      } catch (err) {
        setError("Failed to fetch anime details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (animeName) {
      fetchAnimeDetails();
      console.log(animeName)
    }
  }, [animeName]);

  const handleFavorite = () => {
    // Add logic for adding to favorites
    setIsFavorite((prev) => !prev); // Toggle favorite for now
    console.log(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleEditClick = (field: string) => {
    console.log(`Edit ${field}`);
    // Add your editing logic here
  };

  if (loading) {
    return <div className="text-white text-center text-2xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-white text-center text-2xl">{error}</div>;
  }

  if (!anime) {
    return <div className="text-white text-center text-2xl">Anime not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#242031] text-white relative">
      {/* Background Image - Banner */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${anime.thumbnailUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Vignette Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#242031] via-transparent to-transparent opacity-80"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen px-[100px] py-8 backdrop-blur-xs">
        {/* Header with Favorite Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-extrabold text-rose-100 text-shadow-black">
            {anime.title}
          </h1>
          <button
            onClick={handleFavorite}
            className={`px-4 py-2 rounded-full bg-rose-600 text-white font-semibold hover:bg-rose-500 transition ${isFavorite ? "bg-rose-400" : ""
              }`}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Left - Thumbnail */}
          <div
            className="flex-shrink-0 w-full md:w-[300px] h-[450px] bg-cover bg-center rounded-lg shadow-lg"
            style={{
              backgroundImage: `url(${anime.thumbnailUrl})`,
            }}
          ></div>

          {/* Right - Anime Info and Editable Fields */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-rose-100 mb-4 text-shadow-black">
              Anime Details
            </h2>

            <div className="space-y-6 text-shadow-black">
              {/* Description */}
              <div className="flex justify-between items-center ">
                <div>
                  <h3 className="text-2xl text-rose-100 ">Description</h3>
                  <p className="text-lg text-gray-300 mb-4">
                    {anime.description}
                  </p>
                </div>
                <button
                  onClick={() => handleEditClick("description")}
                  className="text-gray-300 hover:text-white"
                >
                  <i className="fa fa-pencil-alt"></i>
                </button>
              </div>

              {/* Rating */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl text-rose-100">Rating</h3>
                  <p className="text-xl">{anime.rating}</p>
                </div>
                <button
                  onClick={() => handleEditClick("rating")}
                  className="text-gray-300 hover:text-white"
                >
                  <i className="fa fa-pencil-alt"></i>
                </button>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl text-rose-100">Status</h3>
                  <p className="text-xl">{anime.status}</p>
                </div>
                <button
                  onClick={() => handleEditClick("status")}
                  className="text-gray-300 hover:text-white"
                >
                  <i className="fa fa-pencil-alt"></i>
                </button>
              </div>

              {/* Airing Dates */}
              <div className="flex justify-between items-center gap-8">
                <div className="flex flex-col">
                  <h3 className="font-semibold text-2xl text-rose-100">
                    Started Airing
                  </h3>
                  <p className="text-xl">
                    {new Date(anime.startedAiring).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-2xl text-rose-100">
                    Finished Airing
                  </h3>
                  <p className="text-xl">
                    {new Date(anime.finishedAiring).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Expanded Seasons List */}
          {/* Seasons Section */}
          <div className="w-full md:w-[400px] bg-[#2d2a3a]/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-3xl font-bold text-rose-100 mb-4">Seasons</h3>
            <ul className="space-y-4">
              {seasons && seasons.length > 0 ? (
                seasons.map((season) => (
                  <li key={season.id}>
                    <NavLink
                      to={`/${anime.title}/watch?sid=${season.id}`}
                      className={({ isActive }) =>
                        `block p-4 rounded-lg transition-colors duration-200 ${isActive ? "bg-gray-600" : "bg-gray-700 hover:bg-gray-600"
                        } text-gray-200`
                      }
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-lg font-semibold text-rose-100">
                          Season {season.seasonNumber}
                        </span>
                        {season.isFinished ? (
                          <span className="text-sm text-green-400">Finished</span>
                        ) : (
                          <span className="text-sm text-yellow-400">Ongoing</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-300">
                        <p>
                          <strong>Start:</strong>{" "}
                          {new Date(season.startedAiring).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>End:</strong>{" "}
                          {new Date(season.finishedAiring).toLocaleDateString()}
                        </p>
                      </div>
                    </NavLink>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No seasons available</li>
              )}
            </ul>
          </div>


        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
