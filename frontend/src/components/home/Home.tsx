import { useEffect, useState } from "react";
import { COMMON_URL } from "../../api";
import AnimeCard from "../anime/AnimeCard";
import type { Anime } from "../../types";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [latestAnimeList, setLatestAnimeList] = useState<Anime[]>([]);
  const [popularAnimeList, setPopularAnimeList] = useState<Anime[]>([]);
  const nav = useNavigate();

  async function getLatestAnime() {
    try {
      const res = await COMMON_URL.get(`/anime/latest/1`);
      const { data }: { data: Anime[] } = res.data;
      // console.log(res);
      setLatestAnimeList(data); // assuming res.data is Anime[]
    } catch (err) {
      console.error("Failed to fetch anime list:", err);
    }
  }

  async function getPopularAnime() {
    try {
      const res = await COMMON_URL.get(`/anime/popular/1`);
      const { data }: { data: Anime[] } = res.data;
      setPopularAnimeList(data); // assuming res.data is Anime[]
    } catch (err) {
      console.error("Failed to fetch anime list:", err);
    }
  }

  useEffect(() => {
    getLatestAnime();
    getPopularAnime();
  }, []);

  return (
    <>
      {/* Popular Anime section */}
      <div className="px-[100px] py-16 bg-[#242031] min-h-screen text-white">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
            POPULAR SHOWS
          </h1>
          <button
            onClick={() => nav("/misc/popular")}
            className="text-gray-400 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
          >
            VIEW MORE
          </button>
        </div>

        <div className="grid grid-cols-5 gap-10">
          {popularAnimeList.map((anime) => (
            <AnimeCard
              key={Math.random()}
              imgUrl={anime.thumbnailUrl}
              title={anime.title}
            />
          ))}
        </div>
      </div>

      {/* Recently Added Anime section */}
      <div className="px-[100px] py-16 bg-[#242031] min-h-screen text-white">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
            RECENTLY ADDED SHOWS
          </h1>
          <button
            onClick={() => nav("/misc/latest")}
            className="text-gray-400 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
          >
            VIEW MORE
          </button>
        </div>

        <div className="grid grid-cols-5 gap-10">
          {latestAnimeList.map((anime) => (
            <AnimeCard
              key={Math.random()}
              imgUrl={anime.thumbnailUrl}
              title={anime.title}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
