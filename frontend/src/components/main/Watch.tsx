import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { COMMON_URL } from "../../api";
import "./Temp.css";

import Comment from "../comment/Comment";
import type { Season } from "../../types";

import Episode from "./Episode";
import SeasonListComponent from "./SeasonListComponent";
import Ringo from "./Ringo";

const Watch = () => {

  const [searchParams] = useSearchParams();
  const params = useParams();
  const [seasonList, setSeasonList] = useState<Season[]>([]);

  if (!searchParams.get("sid") || !searchParams.get("sid")?.trim()) {
    return <>
      fuck you
    </>
  }

  useEffect(() => {
    console.log("ladies and gentlemen, we got him", params);
    async function getSeasons() {
      const res = await COMMON_URL.get(`/season/${params.animeName}`);
      setSeasonList(res.data);
    }
    if (params.animeName) {
      getSeasons();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1e1b2e] text-white">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-screen grid-container">
        <SeasonListComponent seasonList={seasonList} />
        <Episode />
        <Ringo />
        <Comment />
      </div>
    </div>
  );

}

export default Watch;
