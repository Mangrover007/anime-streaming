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
      setLatestAnimeList(res.data); // assuming res.data is Anime[]
    } catch (err) {
      console.error("Failed to fetch anime list:", err);
    }
  }

  async function getPopularAnime() {
    try {
      const res = await COMMON_URL.get(`/anime/popular/1`);
      setPopularAnimeList(res.data); // assuming res.data is Anime[]
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
      {/* Recently Added Anime section */}
      <div className="px-[100px] py-16 bg-[#242031] min-h-screen text-white">
        <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
          NEW RELEASES
        </h1>
        <button onClick={() => nav("/misc/latest")}>VIEW MORE</button>
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

      {/* Popular Anime section */}
      <div className="px-[100px] py-16 bg-[#242031] min-h-screen text-white">
        <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
          POPULAR
        </h1>
        <button onClick={() => nav("/misc/trending")}>VIEW MORE</button>
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
    </>
  );
};

export default Home;
