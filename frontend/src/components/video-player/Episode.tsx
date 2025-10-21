import { useContext, useEffect, useState } from "react";
import type { EpisodeType } from "../../types";
import { COMMON_URL } from "../../api";
import { useSearchParams } from "react-router-dom";
import EditButton from "../EditButton";
import { PORTAL } from "../../App";

const Episode = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [episodeList, setEpisodeList] = useState<EpisodeType[]>([]);
  const [episode, setEpisode] = useState<EpisodeType | undefined>(undefined);

  const { isAdmin } = useContext(PORTAL);

  async function handleChangeEpisode(episode: EpisodeType) {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("eid", String(episode.id));
      return newParams;
    })
  }

  // get new episode list on season change
  useEffect(() => {
    async function getEpisodesList() {
      const res = await COMMON_URL.get(`/episode/${searchParams.get("sid")}/all`);
      const data: EpisodeType[] = res.data;
      setEpisodeList(data);
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set("eid", data[0].id.toString());
        return newParams;
      }, { replace: true });
    }
    getEpisodesList();
  }, [searchParams.get("sid")]);

  useEffect(() => {
    async function getEpisode() {
      const res = await COMMON_URL.get(`/episode/${searchParams.get("eid")}`);
      console.log("HELLO", res);
      if (res.status === 200) {
        setEpisode(res.data);
      }
    }
    getEpisode();
  }, [searchParams.get("eid")]);

  return <>
    {/* Sidebar - Episode List */}
    <aside className="bg-[#2c293c] border-r border-gray-700 p-4 overflow-y-auto" style={{ gridArea: "box-1" }}>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-rose-200 mb-4">Episodes</h2>
        {isAdmin && <EditButton type="addEpisode" />}
      </div>

      <ul className="space-y-3">
        {episodeList.length > 0 ? (
          episodeList.map((ep) => (
            <li
              key={ep.id}
              className="bg-gray-700 hover:bg-gray-600 transition rounded-lg p-3 cursor-pointer"
              onClick={() => handleChangeEpisode(ep)}
            >
              <div className="flex justify-between items-center">
                <span className="text-rose-100 font-medium">
                  Episode {ep.episodeNumber}
                </span>
                <span className="text-xs text-gray-300">
                  {Math.floor(ep.length / 60000)} min
                </span>
              </div>
              <div className="flex justify-between" onClick={() => console.log("this should not be happening lol")}>
                <p className="text-sm text-gray-300 truncate">{ep.title}</p>
                {
                  isAdmin && <EditButton type="episode" episode={episode} />
                }
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-400">Loading episodes...</li>
        )}
      </ul>
    </aside>
  </>
}

export default Episode;
