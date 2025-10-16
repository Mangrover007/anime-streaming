import { useEffect, useState } from "react";
import { COMMON_URL } from "../api";
import AnimeCard from "./AnimeCard";

export type Anime = {
  id: number;
  title: string;
  description: string;
  author: string;
  rating: number;
  status: string;
  thumbnailUrl: string;
  startedAiring: string;
  finishedAiring: string;
  createdAt: string;
  updatedAt: string;
};

const Home = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);

  async function getAnime() {
    try {
      const res = await COMMON_URL.get("/anime/all");
      setAnimeList(res.data); // assuming res.data is Anime[]
    } catch (err) {
      console.error("Failed to fetch anime list:", err);
    }
  }

  useEffect(() => {
    getAnime();
  }, []);

  return (
    // Popular Anime section
    <div className="px-[100px] py-16 bg-[#242031] min-h-screen text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
        Browse Our Catalogue
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">
        {animeList.map((anime) => (
          <AnimeCard
            key={anime.id}
            id={anime.id}
            imgUrl={anime.thumbnailUrl}
            title={anime.title}
          />
        ))}
      </div>
    </div>

    // Recently Added Anime section
  );
};

export default Home;
