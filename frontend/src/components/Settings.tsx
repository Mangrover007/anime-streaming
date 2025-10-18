import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PORTAL } from "../App";
import Favorites from "./Favorites";

const Settings = () => {
  const { user } = useContext(PORTAL);
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    avatarUrl: user?.profilePicture || "",
  });

  const [activeMenu, setActiveMenu] = useState("account");

  // Handle avatar image upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f0c1a] text-gray-300 font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="fixed top-0 left-0 h-screen w-[300px] py-8 px-6 bg-[#1c1a2e] border-r border-[#2c2844] flex flex-col items-center z-20 overflow-y-auto">

        {/* Go Back Button */}
        <button
          onClick={() => nav(-1)}
          className="self-start mb-8 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          ←
        </button>


        {/* Avatar Upload Section */}
        <div className="relative group mb-4">
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

        {/* Username */}
        <h2 className="text-lg font-bold text-white mb-6 text-center">{user?.username}</h2>

        {/* Divider */}
        <hr className="w-full border-[#2c2844] mb-6" />

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
      {/* RIGHT CONTENT */}
      <main className="flex-1 relative flex ml-[300px]">

        {/* Background Image + Glass effect container */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("banner.png")' }}
          aria-hidden="true"
        ></div>

        {/* Glass-like overlay */}
        {/* Glass-like overlay with smooth fade from left */}
        {/* Glass-like overlay with dark-to-light gradient */}
        <div
          className="absolute inset-0 backdrop-blur-md pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(12, 10, 26, 0.85) 0%, rgba(12, 10, 26, 0.6) 20%, rgba(255, 255, 255, 0.15) 80%, rgba(255, 255, 255, 0.3) 100%)',
          }}
        ></div>

        {/* Content (needs to be above overlays) */}
        <div className="relative w-full z-10 flex justify-center">
          {activeMenu === "a" ? (
            <div className="bg-[#1c1a2e] bg-opacity-70 rounded-lg p-8 shadow-md border border-[#2c2844] backdrop-blur-sm max-w-md w-full">
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-6">
                Account Settings
              </h2>

              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-semibold text-gray-400"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    defaultValue="user@example.com"
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Password Section */}
                <fieldset className="space-y-6 border-t border-[#2c2844] pt-6">
                  <legend className="text-lg font-semibold text-gray-300 mb-4">
                    Change Password
                  </legend>

                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block mb-2 text-sm font-semibold text-gray-400"
                    >
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      name="currentPassword"
                      placeholder="••••••••"
                      defaultValue="password123"
                      required
                      className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block mb-2 text-sm font-semibold text-gray-400"
                    >
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      placeholder="Leave blank to keep current password"
                      className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-2 text-sm font-semibold text-gray-400"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your new password"
                      className="w-full px-4 py-3 bg-[#2c2844] text-white rounded-full border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>
                </fieldset>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 mt-4 text-lg font-bold text-white bg-pink-500 rounded-full border-2 border-transparent hover:opacity-90 transition"
                >
                  Save Changes
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full h-full">
              <Favorites />
            </div>
          )}
        </div>
      </main>


    </div>
  );
};

export default Settings;
