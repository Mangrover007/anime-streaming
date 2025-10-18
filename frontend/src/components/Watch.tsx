import React, { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { COMMON_URL, PROT_URL } from "../api";
import videojs from "video.js";
import VideoJS from "./VideoJS";
import type Player from "video.js/dist/types/player";
import "./Temp.css"
import type { Season } from "./AnimeDetails";
import Button from "./Button";
import { PORTAL } from "../App";

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

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    username: string;
    profilePicture: string | null;
  };
};


const Watch = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const playerRef = React.useRef<Player>(null);
  const [episode, setEpisode] = useState<Episode>();
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [seasonList, setSeasonList] = useState<Season[]>([]);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [writeComment, setWriteComment] = useState<string>("");

  const { user } = useContext(PORTAL);

  if (!searchParams.get("sid") || !searchParams.get("sid")?.trim()) {
    return <>
      fuck you
    </>
  }

  useEffect(() => {
    async function getEpisodesList() {
      const res = await COMMON_URL.get(`/episode/${searchParams.get("sid")}/all`);
      const data: Episode[] = res.data;
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

  useEffect(() => {
    console.log("ladies and gentlemen, we got him", params);
    async function getSeasons() {
      const res = await COMMON_URL.get(`/season/${params.animeName}`);
      setSeasonList(res.data);
    }
    if (params.animeName) {
      getSeasons();
    }
  }, [])

  useEffect(() => {
    async function getComments() {
      const res = await COMMON_URL.get(`/comment?id=${episode?.id}`);
      console.log("commentador", res.data.data);
      setCommentList(res.data.data);
    }
    if (episode?.id) {
      getComments();
    }
  }, [episode])

  const videoJsOptions = {
    controls: true,
    sources: [{
      src: episode?.subUrl,
      type: 'application/x-mpegURL'
    }]
  };

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  async function handleChangeEpisode() {

  }

  async function handleSendComment() {
    const res = await PROT_URL.post(`/comment?ep=${episode?.id}`, {
      content: writeComment
    });
    if (res.status === 200) {
      setWriteComment("");
    }
    console.log(res);
  }

  return (
    <div className="min-h-screen bg-[#1e1b2e] text-white">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-screen grid-container">

        {/* Sidebar - Episode List */}
        <aside className="bg-[#2c293c] border-r border-gray-700 p-4 overflow-y-auto" style={{ gridArea: "box-1" }}>
          <h2 className="text-xl font-semibold text-rose-200 mb-4">Episodes</h2>
          <ul className="space-y-3">
            {episodeList.length > 0 ? (
              episodeList.map((ep) => (
                <li
                  key={ep.id}
                  className="bg-gray-700 hover:bg-gray-600 transition rounded-lg p-3 cursor-pointer"
                  onClick={handleChangeEpisode}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-rose-100 font-medium">
                      Episode {ep.episodeNumber}
                    </span>
                    <span className="text-xs text-gray-300">
                      {Math.floor(ep.length / 60000)} min
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 truncate">{ep.title}</p>
                </li>
              ))
            ) : (
              <li className="text-gray-400">Loading episodes...</li>
            )}
          </ul>
        </aside>

        {/* Main Content - Video Player */}
        <main className="flex flex-col items-center justify-center p-4 overflow-y-auto" style={{ gridArea: "box-2" }}>
          <div className="w-[80%] aspect-video">
            {episode?.subUrl && (
              <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            )}
          </div>
        </main>

        <div
          style={{ gridArea: "box-4" }}
          className="bg-[#2c293c] border-l border-gray-700 p-4 overflow-y-auto"
        >
          <div className="w-full">
            <h2 className="text-2xl font-bold text-rose-100 mb-4">Seasons</h2>
            <ul className="space-y-4">
              {seasonList && seasonList.length > 0 ? (
                seasonList.map((season) => (
                  <li key={season.id}>
                    <div
                      className="bg-[#2d2a3a]/80 backdrop-blur-md p-4 rounded-lg shadow border border-gray-700 hover:border-rose-400 transition-colors duration-200"
                      onClick={() => {
                        if (searchParams.get("sid") !== String(season.id)) {
                          setSearchParams(prev => {
                            const newParams = new URLSearchParams(prev);
                            newParams.set("sid", String(season.id));
                            return newParams;
                          });
                        }
                      }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-base font-semibold text-rose-100">
                          Season {season.seasonNumber}
                        </span>
                        {season.isFinished ? (
                          <span className="text-sm text-green-400">Finished</span>
                        ) : (
                          <span className="text-sm text-yellow-400">Ongoing</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        <p>
                          <strong>Start:</strong>{" "}
                          {new Date(season.startedAiring).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>End:</strong>{" "}
                          {new Date(season.finishedAiring).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No seasons available</li>
              )}
            </ul>
          </div>
        </div>

        <div
          style={{ gridArea: "box-3" }}
          className="bg-[#1e1b2e] border-t border-gray-700 p-6 overflow-y-auto space-y-6"
        >
          {
            user && <>
              {/* Comment Input */}
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Leave a comment</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Write your comment..."
                    className="flex-1 px-5 py-3 rounded-full text-white placeholder:text-gray-400 bg-[#1c1a2e] border border-transparent focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={writeComment}
                    onChange={e => setWriteComment(e.target.value)}
                  />
                  <Button innerText="Send" onClick={handleSendComment} />
                </div>
              </div>
            </>
          }

          {/* Comment List */}
          <div className="space-y-4">
            {commentList.length > 0 ? (
              commentList.map((comment, index) => (
                <div
                  key={index}
                  className="bg-[#2d2a3a]/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-sm"
                >
                  <div className="grid grid-cols-[48px_1fr] gap-4">
                    {/* Profile Picture */}
                    <img
                      src={comment.user.profilePicture || "/vite.svg"}
                      alt={`${comment.user.username}'s profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    {/* Username, Date & Content */}
                    <div className="grid grid-rows-[auto_1fr] gap-1">
                      {/* Username & Date */}
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span className="font-semibold text-rose-200">{comment.user.username}</span>
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Comment Content */}
                      <p className="text-sm text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            )}
          </div>



        </div>


      </div>
    </div>
  );

}

export default Watch;
