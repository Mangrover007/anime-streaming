import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Favorites from "./Favorites";
import { PORTAL } from "../../App";
import Profile from "./Profile";
import { COMMON_URL } from "../../api";

const Settings = () => {
  const { user } = useContext(PORTAL);
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    avatarUrl: user?.profilePicture || "",
  });

  const [activeMenu, setActiveMenu] = useState("account");
  const [modalActive, setModalActive] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [avatar, setAvatar] = useState<File>();
  const [edited, setEdited] = useState<boolean>(false);

  // Handle avatar image upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
      setAvatar(file);
      setEdited(true);
    }
  };

  const handleAvatarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!avatar) return
    const data = new FormData();
    data.append("avatar", avatar);
    const res = await COMMON_URL.post("/upload-avatar", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    });
    console.log(res);
  }

  function handleCloseModal(e: MouseEvent) {
    const target = e.target as Node;
    if (modalRef.current) {
      if (!modalRef.current.contains(target)) {
        // debugger
        setModalActive(false);
        console.log("outside modal");
      }
    }
    else {
      console.log("inside modal");
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleCloseModal);
    return () => document.removeEventListener("click", handleCloseModal);
  }, []);

  useEffect(() => {
    setFormData(prev => {
      console.log(user?.profilePicture, "profile picture");
      if (!user || !user.profilePicture) return prev
      return {
        ...prev,
        avatarUrl: user?.profilePicture
      }
    });
  }, [user]);

  function toggleCustomizeModal(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    setModalActive(prev => !prev);
  }

  return (
    <div className="flex min-h-screen bg-[#0f0c1a] text-gray-300 font-sans relative">
      {/* LEFT SIDEBAR */}
      <aside className="fixed top-0 left-0 h-screen w-[300px] py-8 px-6 bg-[#1c1a2e] border-r border-[#2c2844] flex flex-col items-center z-20 overflow-y-auto">

        <section className="w-full flex flex-col items-center justify-center">
          {/* Go Back Button */}
          <button
            onClick={() => nav(-1)}
            className="self-start mb-8 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            ←
          </button>


          {/* Avatar Upload Section */}
          <form className="group mb-4 flex flex-col w-full justify-center items-center" onSubmit={handleAvatarSubmit}>
            <div className="relative flex flex-col">
              <img
                src={formData.avatarUrl || "/vite.svg"}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400 transition-all group-hover:brightness-75"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white text-xs font-semibold cursor-pointer transition"
              >
                EDIT
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            {
              edited && <div className="flex gap-4 mt-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 
               text-white text-sm font-medium shadow-sm 
               hover:from-cyan-600 hover:to-blue-600 hover:shadow-md 
               active:scale-95 transition-all duration-150"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEdited(false);
                    setFormData(prev => {
                      if (!user || !user.profilePicture) return prev;
                      return {
                        ...prev,
                        avatarUrl: user.profilePicture
                      };
                    });
                  }}
                  className="px-3 py-1.5 rounded-md border border-gray-500 text-gray-300 
               text-sm font-medium hover:bg-gray-700 hover:text-white 
               active:scale-95 transition-all duration-150"
                >
                  Cancel
                </button>
              </div>
            }
          </form>

          {/* Username */}
          <h2 className="text-lg font-bold text-white mb-6 text-center">{user?.username}</h2>

          {/* Divider */}
          <hr className="w-full border-[#2c2844] mb-6" />
        </section>

        {/* Menu Items */}
        <nav className="w-full space-y-2">
          <button
            onClick={() => setActiveMenu("account")}
            className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${activeMenu === "account"
              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white"
              : "hover:bg-[#2c2844] text-gray-400"
              }`}
          >
            Account Settings
          </button>

          <button
            onClick={() => setActiveMenu("favorites")}
            className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${activeMenu === "favorites"
              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white"
              : "hover:bg-[#2c2844] text-gray-400"
              }`}
          >
            Favorites
          </button>
        </nav>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="relative ml-[300px] w-full">

        {/* Background Image + Glass effect container */}
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("banner.png")' }}
          aria-hidden="true"
        />

        {/* Glass-like overlay */}
        <div
          className="absolute inset-0 backdrop-blur-md pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(12, 10, 26, 0.85) 0%, rgba(12, 10, 26, 0.6) 20%, rgba(255, 255, 255, 0.15) 80%, rgba(255, 255, 255, 0.3) 100%)',
          }}
        />

        {/* Content (needs to be above overlays) */}
        <div className="relative w-full z-10 flex justify-center">
          {activeMenu === "a" ? (
            <Profile />
          ) : (
            <Favorites />
          )}
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-[100] h-fit aspect-square p-4 flex items-center justify-center rounded-full bg-[#1a172b]/90 border border-[#2e2a47] text-gray-300 text-xl hover:text-white hover:border-pink-400 hover:bg-[#242031] transition-all duration-200 cursor-pointer select-none" title="Customize" onClick={e => toggleCustomizeModal(e)}>
        ✏️
      </div>

      {/* {modalActive && <>
        <div
          ref={modalRef}
          className="fixed bottom-6 right-6 z-50 w-72 p-4 rounded-xl shadow-lg border border-gray-700 bg-[#1a172b]/95 backdrop-blur-md flex flex-col gap-3"
        >
          <h3 className="text-white text-lg font-semibold text-center">Customize Background</h3>

          <input
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 rounded-md bg-[#2a2540] text-gray-200 cursor-pointer"
          />

          <button
            className="mt-2 w-full px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md transition"
            onClick={() => setModalActive(false)}
          >
            Close
          </button>
        </div>
      </>} */}

      {modalActive && (
        <div
          ref={modalRef}
          className="fixed bottom-6 right-6 z-50 w-72 p-4 rounded-xl shadow-lg border border-gray-700 bg-[#1a172b]/95 flex flex-col gap-4"
        >
          {/* Header */}
          <h3 className="text-white text-lg font-semibold text-center">
            Customize Background
          </h3>

          {/* File Upload Box */}
          <label className="w-full p-6 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 transition">
            <span className="text-gray-400 mb-2 text-center">
              Click to upload an image
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>

          {/* Close Button */}
          <button
            className="mt-2 w-full px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md transition"
            onClick={() => setModalActive(false)}
          >
            Close
          </button>
        </div>
      )}

    </div>
  );
};

export default Settings;
