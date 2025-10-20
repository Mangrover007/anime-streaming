import { useState } from "react"
import EditEpisodeModal from "../../EditEpisodeModal";
import type { EpisodeType, Season } from "../../types";
import EditSeasonModal from "../../EditSeasonModal";

type EditButtonProps = {
  type: "episode" | "season",
  episode?: EpisodeType,
  season?: Season
}

const EditButton = ({ type, episode, season }: EditButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function handleEpisodeModal() {
    setIsModalOpen(true);
    console.log("episode edit cllicked", episode)
  }

  function handleSeasonModal() {
    console.log("season edit clicked", season)
    setIsModalOpen(true);
  }

  return <>
    {type === "episode" && isModalOpen && episode && <EditEpisodeModal episode={episode} onClose={() => setIsModalOpen(false)} />}
    {type === "season" && isModalOpen && season && <EditSeasonModal season={season} onClose={() => setIsModalOpen(false)} />}
    <button
      className="text-white cursor-pointer font-medium hover:text-pink-400 transition-colors duration-200"
      onClick={(e) => {
        e.stopPropagation();
        type === "episode" ? handleEpisodeModal() : handleSeasonModal();
      }}
    >
      Edit
    </button>
  </>
}

export default EditButton;
