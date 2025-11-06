import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { COMMON_URL } from "../../api";
import "./Temp.css";

import Comment from "./Comment";
import type { Season } from "../../types";

import Episode from "./Episode";
import SeasonListComponent from "./SeasonListComponent";
import Ringo from "./VideoPlayer";

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
    <div className="min-h-screen w-[100vw] bg-[#1e1b2e] text-white">
      <div className="flex min-h-screen">
        <Episode />
        <div className="w-full mt-10">
          <Ringo />
          <Comment />
        </div>
        <SeasonListComponent seasonList={seasonList} />
      </div>
    </div>
  );

}

export default Watch;
