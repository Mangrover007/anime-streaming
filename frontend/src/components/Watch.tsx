import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { COMMON_URL } from "../api";

export type Episode = {
  id: number;
  seasonId: number;
  episodeNumber: number;
  title: string;
  length: number; // in milliseconds (e.g. 1440000 = 24 minutes)
  subUrl: string; // streaming URL (e.g. .m3u8)
  airedAt: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

const Watch = () => {

  const [params] = useSearchParams();

  if (!params.get("sid") || !params.get("sid")?.trim()) {
    return <>
      fuck you
    </>
  }

  useEffect(() => {
    async function getEpisodes() {
      const res = await COMMON_URL.get(`/episode/${params.get("sid")}`);
      console.log(res.data);
    }
    getEpisodes();
  }, [params.get("sid")]);

  return <>
    WATCH
  </>
}

export default Watch;
