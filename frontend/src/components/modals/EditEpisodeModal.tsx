import { useState } from "react";
import ReactDOM from "react-dom";
import type { EpisodeType } from "../../types";
import { ADMIN_URL } from "../../api";
import Button from "../Button";


type EditEpisodeModalProps = {
  episode: EpisodeType;
  onClose: () => void;
};

const EditEpisodeModal = ({ episode, onClose }: EditEpisodeModalProps) => {
  const [title, setTitle] = useState(episode.title);
  const [episodeNumber, setEpisodeNumber] = useState(episode.episodeNumber);
  const [lengthMinutes, setLengthMinutes] = useState(episode.length / 60000);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await ADMIN_URL.patch(`/episode/${episode.id}`, {
        title,
        episodeNumber,
        length: lengthMinutes * 60000,
      });
      window.location.reload();
    } catch (err) {
      console.error("Error updating episode:", err);
    } finally {
      setIsSaving(false);
    }
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50" onClick={e => e.stopPropagation()}>
      <div className="bg-[#1c1a2e]/90 border border-[#2c2844] rounded-xl shadow-2xl p-8 w-96 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b2e]/90 via-[#2c293c]/80 to-[#1c1a2e]/90 pointer-events-none rounded-xl border border-[#2c2844]" />

        <h2 className="relative text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-6 z-10">
          Edit Episode
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Episode Number
            </label>
            <input
              type="number"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Length (minutes)
            </label>
            <input
              type="number"
              value={lengthMinutes}
              onChange={(e) => setLengthMinutes(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border-2 border-gray-400 bg-transparent text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200"
            >
              Cancel
            </button>

            <Button
              innerText={isSaving ? "Saving..." : "Save"}
              onClick={e => {
                handleSubmit(e);
                onClose();
              }}
            />
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal")!
  );
};

export default EditEpisodeModal;
