import videojs from "video.js";
import VideoJS from "./VideoJS";
import type Player from "video.js/dist/types/player";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { COMMON_URL } from "../../api";

const Ringo = () => {
  const playerRef = React.useRef<Player>(null);
  const [searchParams] = useSearchParams();


  const [episodeUrl, setEpisodeUrl] = useState<string>("");

  async function getEpisodeUrl() {
    const res = await COMMON_URL.get(`/episode/${searchParams.get("eid")}`);
    console.log("FUCK YOU", res.data.subUrl);
    setEpisodeUrl(res.data.subUrl);
  }

  useEffect(() => {
    console.log("FROM RINGO")
    getEpisodeUrl();
  }, [searchParams.get("eid")])

  const videoJsOptions = {
    controls: true,
    sources: [{
      src: episodeUrl,
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

  return <>
    <main className="flex flex-col items-center justify-center p-4 overflow-y-auto" style={{ gridArea: "box-2" }}>
      <div className="w-[80%] aspect-video">
        {episodeUrl && (
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        )}
      </div>
    </main>
  </>
}

export default Ringo
