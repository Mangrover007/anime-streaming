import { NavLink } from "react-router-dom";
import Button from "./Button";
import { useContext } from "react";
import { PORTAL } from "../App";
import { AUTH_URL } from "../api";

const Header = () => {

  const { user, setUser } = useContext(PORTAL);

  async function handleLogout() {
    const res = await AUTH_URL.get("/logout");
    if (res.status === 200) {
      setUser(null);
    }
  }

  return (
    <header className="h-[80px] px-[100px] bg-[#0f0c1a] flex items-center justify-between shadow-md">
      {/* Left - Logo */}
      <div className="text-white text-3xl font-extrabold tracking-wider">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-200">
          AnimeVerse
        </span>
      </div>

      {/* Middle - Search Bar */}
      <div className="grid grid-cols-[auto_1fr] gap-4 max-w-md mx-8">
        <input
          type="text"
          placeholder="Search anime..."
          className="w-full px-4 py-2 bg-[#322f49] rounded-full text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <Button innerText="" />
      </div>

      {/* Right - Auth Buttons */}
      <div className="flex items-center gap-4">
        {
          user === null ? <>
            <NavLink className="text-white cursor-pointer font-medium hover:text-pink-400 transition" to="/login">
              Log in
            </NavLink>
            <NavLink className="px-4 py-2 rounded-full cursor-pointer text-white hover:text-pink-400 transition" to="/signup">
              Sign up
            </NavLink>
          </> :
            <button className="px-4 py-2 rounded-full cursor-pointer text-white hover:text-pink-400 transition" onClick={handleLogout}>
              Log out
            </button>
        }
      </div>
    </header>

  );
};

export default Header;
