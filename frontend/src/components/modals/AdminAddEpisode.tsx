import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ADMIN_URL } from "../../api";
import Button from "../Button";
import ReactDOM from "react-dom";

type AdminAddEpisodeProps = {
  onClose: () => void,
}

const AdminAddEpisode = ({ onClose }: AdminAddEpisodeProps) => {

  const [searchParams] = useSearchParams();

  const [addFormData, setAddFormData] = useState({
    title: "",
    length: 0,
    airedAt: "",
    subUrl: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await ADMIN_URL.post("/episode", {
        ...addFormData,
        airedAt: addFormData.airedAt ? new Date(addFormData.airedAt).toISOString() : null,
        length: addFormData.length * 60000, // assume minutes → ms,
        seasonId: searchParams.get("sid"),
      });
      window.location.reload();
    } catch (err) {
      console.error("Error adding episode:", err);
    } finally {
      setIsSaving(false);
    }
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50" onClick={e => e.stopPropagation()}>
      <div className="bg-[#1c1a2e]/90 border border-[#2c2844] rounded-xl shadow-2xl p-8 w-[420px] relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b2e]/90 via-[#2c293c]/80 to-[#1c1a2e]/90 pointer-events-none rounded-xl border border-[#2c2844]" />

        <h2 className="relative text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-6 z-10">
          Add New Episode
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Episode Title
            </label>
            <input
              type="text"
              value={addFormData.title}
              onChange={(e) =>
                setAddFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Length (minutes)
            </label>
            <input
              type="number"
              value={addFormData.length}
              onChange={(e) =>
                setAddFormData((prev) => ({
                  ...prev,
                  length: Number(e.target.value),
                }))
              }
              className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Aired At */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Aired At
            </label>
            <input
              type="date"
              value={addFormData.airedAt}
              onChange={(e) =>
                setAddFormData((prev) => ({ ...prev, airedAt: e.target.value }))
              }
              className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Subtitle URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Subtitle / Stream URL
            </label>
            <input
              type="text"
              value={addFormData.subUrl}
              onChange={(e) =>
                setAddFormData((prev) => ({ ...prev, subUrl: e.target.value }))
              }
              placeholder="https://example.com/episode.mp4"
              className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border-2 border-gray-400 bg-transparent text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200"
            >
              Cancel
            </button>
            <Button
              innerText={isSaving ? "Saving..." : "Add Episode"}
              onClick={handleSubmit as any}
            />
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal")!
  );
};

export default AdminAddEpisode;
