import { useState } from "react";
import { ADMIN_URL } from "./api";
import Button from "./components/Button";
import { useParams, useSearchParams } from "react-router-dom";

type AdminAddSeasonProps = {
  onClose: () => void;
};

const AdminAddSeason = ({ onClose }: AdminAddSeasonProps) => {
  const params = useParams();

  const [addFormData, setAddFormData] = useState({
    startedAiring: "",
    finishedAiring: "",
    isFinished: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await ADMIN_URL.post(`/season/${params.animeName}`, {
        startedAiring: new Date(addFormData.startedAiring).toISOString(),
        finishedAiring: new Date(addFormData.finishedAiring).toISOString(),
        isFinished: addFormData.isFinished,
      });
      window.location.reload();
    } catch (err) {
      console.error("Error adding season:", err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-[#1c1a2e]/90 border border-[#2c2844] rounded-xl shadow-2xl p-8 w-[420px] relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b2e]/90 via-[#2c293c]/80 to-[#1c1a2e]/90 pointer-events-none rounded-xl border border-[#2c2844]" />

        <h2 className="relative text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-6 z-10">
          Add New Season
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Started Airing */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Started Airing
            </label>
            <input
              type="date"
              value={addFormData.startedAiring}
              onChange={(e) =>
                setAddFormData((prev) => ({
                  ...prev,
                  startedAiring: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Finished Airing */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Finished Airing
            </label>
            <input
              type="date"
              value={addFormData.finishedAiring}
              onChange={(e) =>
                setAddFormData((prev) => ({
                  ...prev,
                  finishedAiring: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Is Finished */}
          <div className="flex items-center space-x-2">
            <input
              id="isFinished"
              type="checkbox"
              checked={addFormData.isFinished}
              onChange={(e) =>
                setAddFormData((prev) => ({
                  ...prev,
                  isFinished: e.target.checked,
                }))
              }
              className="h-4 w-4 text-pink-500 border-gray-400 rounded focus:ring-cyan-400"
            />
            <label
              htmlFor="isFinished"
              className="text-gray-300 text-sm font-medium"
            >
              Mark as Finished
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border-2 border-gray-400 bg-transparent text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200"
            >
              Cancel
            </button>

            <Button
              innerText={isSaving ? "Saving..." : "Add Season"}
              onClick={handleSubmit as any}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddSeason;
