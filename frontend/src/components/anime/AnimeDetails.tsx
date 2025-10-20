import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ADMIN_URL, COMMON_URL, PROT_URL } from "../../api"; // Assuming this is where your API is defined

import { PORTAL } from "../../App";
import type { Anime, Season } from "../../types";

const AnimeDetails = () => {
  const { animeName } = useParams<{ animeName: string }>(); // Get the anime ID from the URL
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [seasons, setSeasons] = useState<Season[]>([]);

  const [editing, setEditing] = useState<boolean>(false);
  const { seasonList, userRef, isAdmin, user } = useContext(PORTAL);
  const nav = useNavigate();

  const editableStyles = (editing && isAdmin)
    ? "border-2 border-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition duration-200"
    : "";

  useEffect(() => {
    console.log(isAdmin, "is admin")
  }, []);

  useEffect(() => {
    if (seasons.length !== 0) {
      seasonList.current = seasons
      // console.log("update or not")
      // console.log(seasonList.current);
    }
    // console.log("THIS IS SEASONS", seasons);
  }, [seasons]);

  async function getSeasons() {
    if (anime) {
      const res = await COMMON_URL.get(`/season/${anime.title}`)
      setSeasons(res.data);
      // console.log(res.data);
    }
  }

  function isCurrentAnimeFavorite() {
    if (!userRef || !userRef.current?.favoriteAnimes) return false;
    const findIndex = userRef.current?.favoriteAnimes?.findIndex(favAnime => {
      return favAnime.id === anime?.id
    });
    console.log(findIndex !== -1, "THIS IS WHAT WE CALL SHIT", userRef.current?.favoriteAnimes);
    return findIndex !== -1
  }

  useEffect(() => {
    if (anime) {
      getSeasons();
      if (isCurrentAnimeFavorite()) {
        setIsFavorite(true);
      }
      else {
        setIsFavorite(false);
      }
    }
  }, [anime, user]);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        const response = await COMMON_URL.get(`/anime/${animeName}`);
        setAnime(response.data);
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

  async function handleFavorite() {
    if (!isFavorite) {
      const res = await PROT_URL.post("/anime/add-fav", {
        animeId: anime?.id,
        userId: userRef.current?.id
      });
      console.log(res.data);
      if (res.status === 200) {
        if (anime && userRef.current) {
          // lil cp :)
          setIsFavorite(true);
          userRef.current?.favoriteAnimes.push(anime);
          const addedAnimeSet = new Set<number>();
          userRef.current.favoriteAnimes = userRef.current?.favoriteAnimes.filter(favAnime => {
            if (!addedAnimeSet.has(favAnime.id)) {
              addedAnimeSet.add(favAnime.id);
              return favAnime;
            }
          });
        }
      }
    }
    else {
      console.log("removing or nah")
      const res = await PROT_URL.post("/anime/remove-fav", {
        animeId: anime?.id,
        userId: userRef.current?.id
      });
      if (res.status === 200) {
        if (anime && userRef.current) {
          setIsFavorite(false);
          userRef.current.favoriteAnimes = userRef.current?.favoriteAnimes.filter(favAnime => {
            return favAnime.id !== anime.id;
          });
        }
      }
    }
  }

  function handleAdminChange(e: React.FocusEvent<HTMLParagraphElement, Element>) {
    console.log(e.target.textContent);
    const val = e.target.textContent;
    const key = e.target.id;
    setAnime(prev => {
      if (!prev) return null;
      return {
        ...prev, [key]: val
      }
    })
  }

  async function updateAdminAnime() {
    const res = await ADMIN_URL.patch(`/anime/update/${anime?.id}`, anime);
    if (res.status === 200) {
      nav(`/${anime?.title}`)
    }
  }

  async function handleAdminDeleteAnime() {
    const res = await ADMIN_URL.delete(`/anime/${anime?.id}`);
    if (res.status === 200) {
      nav("/home");
    }
  }

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
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

        {/* Optional: Vignette Gradient Overlay (can go above or below black layer depending on your preference) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#242031] via-transparent to-transparent opacity-80 z-10"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen px-[100px] py-8 backdrop-blur-md">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-extrabold text-rose-100 text-shadow-black">
            <p
              contentEditable={isAdmin && editing}
              onBlur={handleAdminChange}
              id="title"
              suppressContentEditableWarning
              className={`outline-none ${editableStyles}`}
            >
              {anime.title}
            </p>
          </h1>

          {/* Button Group */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleAdminDeleteAnime}
              className={`px-4 py-2 rounded-full bg-rose-600 text-white font-semibold hover:bg-rose-500 transition ${isFavorite ? "bg-rose-400" : ""
                }`}
            >
              DELETE ANIME
            </button>

            <button
              onClick={handleFavorite}
              className={`px-4 py-2 rounded-full bg-rose-600 text-white font-semibold hover:bg-rose-500 transition ${isFavorite ? "bg-rose-400" : ""
                }`}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>

            {isAdmin && (
              <>
                {/* EDIT Button */}
                <button
                  className="px-4 py-2 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-500 transition"
                  onClick={() => setEditing((prev) => !prev)}
                >
                  {editing ? "CANCEL" : "EDIT"}
                </button>

                {/* SAVE Button */}
                {editing && (
                  <button
                    className="px-4 py-2 rounded-full bg-rose-600 text-white font-bold hover:bg-rose-500 transition"
                    onClick={updateAdminAnime}
                  >
                    SAVE
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Main Section */}
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Thumbnail */}
          <div
            className="flex-shrink-0 w-full md:w-[300px] h-[450px] bg-cover bg-center rounded-lg shadow-lg"
            style={{
              backgroundImage: `url(${anime.thumbnailUrl})`,
            }}
          ></div>

          {/* Right Section */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-rose-100 mb-4 text-shadow-black">Anime Details</h2>

            <div className="space-y-6 text-shadow-black">
              {/* Description */}
              <div>
                <h3 className="text-2xl text-rose-100">Description</h3>
                <p
                  id="description"
                  contentEditable={isAdmin && editing}
                  onBlur={handleAdminChange}
                  suppressContentEditableWarning
                  className={`text-lg text-gray-300 mb-4 outline-none text-shadow-black ${editableStyles}`}
                >
                  {anime.description}
                </p>

              </div>

              {/* Rating */}
              <div>
                <h3 className="text-2xl text-rose-100">Rating</h3>
                {editing && isAdmin ? (
                  <input
                    type="number"
                    name="rating"
                    value={anime.rating}
                    onChange={(e) =>
                      setAnime((prev) =>
                        prev ? { ...prev, [e.target.name]: e.target.value } : prev
                      )
                    }
                    className={`bg-transparent border-none outline-none text-xl text-white w-full text-shadow-black ${editableStyles}`}
                  />
                ) : (
                  <p className="text-xl">{anime.rating}</p>
                )}

              </div>

              {/* Status */}
              <div>
                <h3 className="text-2xl text-rose-100">Status</h3>
                {editing && isAdmin ? (
                  <select
                    name="status"
                    value={anime.status}
                    onChange={(e) =>
                      setAnime((prev) =>
                        prev ? { ...prev, [e.target.name]: e.target.value } : prev
                      )
                    }
                    className={`bg-transparent border border-gray-600 rounded px-2 py-1 text-xl text-white text-shadow-black ${editableStyles}`}
                  >
                    <option value="AIRING">AIRING</option>
                    <option value="FINISHED">FINISHED</option>
                    <option value="HIATUS">HIATUS</option>
                    <option value="DONT">DONT (UNKNOWN)</option>
                  </select>
                ) : (
                  <p className="text-xl">{anime.status}</p>
                )}

              </div>

              {/* Dates */}
              <div className="flex justify-between items-center gap-8">
                <div className="flex flex-col">
                  <h3 className="font-semibold text-2xl text-rose-100">Started Airing</h3>
                  <input
                    type="date"
                    name="startedAiring"
                    value={anime.startedAiring?.slice(0, 10)}
                    onChange={(e) =>
                      setAnime((prev) =>
                        prev ? { ...prev, [e.target.name]: e.target.value } : prev
                      )
                    }
                    readOnly={!(editing && isAdmin)}
                    className={`bg-transparent text-white outline-none border-b border-gray-600 w-full text-shadow-black ${editableStyles}`}
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-2xl text-rose-100">Finished Airing</h3>
                  <input
                    type="date"
                    name="finishedAiring"
                    value={anime.finishedAiring?.slice(0, 10)}
                    onChange={(e) =>
                      setAnime((prev) =>
                        prev ? { ...prev, [e.target.name]: e.target.value } : prev
                      )
                    }
                    readOnly={!(editing && isAdmin)}
                    className={`bg-transparent text-white outline-none border-b border-gray-600 w-full text-shadow-black ${editableStyles}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seasons */}
          <div className="w-full md:w-[400px] bg-[#2d2a3a]/80 backdrop-blur-md p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-3xl font-bold text-rose-100 mb-4">Seasons</h3>
            <ul className="space-y-4">
              {seasons && seasons.length > 0 ? (
                seasons.map((season) => (
                  <li key={season.id}>
                    <NavLink
                      to={`/${anime.title}/watch?sid=${season.id}&eid=1`}
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
