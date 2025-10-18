import { useContext, useEffect, useState } from "react";
import AnimeCard from "./AnimeCard";
import type { Anime } from "./Home";
import { PORTAL } from "../App";
import { PROT_URL } from "../api";

const Favorites = () => {

  const [favorites, setFavorites] = useState<Anime[]>([]);
  const { user } = useContext(PORTAL);
  
  useEffect(() => {
    console.log("running or no", user)
    async function getFavorites() {
      const res = await PROT_URL.get(`/anime/fav?id=${user?.id}`);
      if (res.status === 200)
        setFavorites(res.data);
    }
    if (user)
      getFavorites();
  }, [user]);

  return (
    <div className="p-6 bg-transparent rounded-lg h-full w-full">
      <h1 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
        Favorite Anime
      </h1>

      <div className="grid grid-cols-6 gap-6">
        {favorites.map((anime) => (
          <AnimeCard key={anime.id} imgUrl={anime.thumbnailUrl} title={anime.title} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
