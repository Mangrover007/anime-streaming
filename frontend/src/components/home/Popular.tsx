import { useEffect, useState } from "react";
import { COMMON_URL } from "../../api";
import type { Anime } from "../../types";
import AnimeCard from "../anime/AnimeCard";

const Popular = () => {

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);

  async function getPopular() {
    const res = await COMMON_URL.get(`/anime/popular/${pageNumber}`);
    console.log(res.data);
    setAnimeList(res.data);
  }

  useEffect(() => {
    getPopular();
  }, [pageNumber]);

  return <>
    <div className="px-[100px] py-16 bg-[#242031] min-h-screen text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
        test
      </h1>
      <div className="grid grid-cols-5 gap-10">
        {animeList.map((anime) => (
          <>
            <AnimeCard
              key={Math.random()}
              imgUrl={anime.thumbnailUrl}
              title={anime.title}
            />
          </>
        ))}
      </div>
      <div className="flex justify-center gap-10">
        <button onClick={() => setPageNumber(prev => prev - 1)}>back</button>
        <button onClick={() => setPageNumber(prev => prev + 1)}>forward</button>
      </div>
    </div>
  </>
}

export default Popular;
