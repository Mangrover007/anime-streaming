const Profile = () => {
    return <>
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
    </>
}

export default Profile;
