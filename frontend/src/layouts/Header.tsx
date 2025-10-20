import { NavLink, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useContext, useEffect, useRef, useState } from "react";
import { PORTAL } from "../App";
import { AUTH_URL } from "../api";
import axios from "axios";
import type { Anime } from "../types";

const Header = () => {

  const { user, setUser } = useContext(PORTAL);
  const nav = useNavigate();
  const [searchString, setSearchString] = useState<string>("");
  const [searchAnimeList, setSearchAnimeList] = useState<Anime[]>([]);
  const controllerRef = useRef<AbortController>(null);

  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);

  function handleClick(e: MouseEvent) {
    if (inputRef.current) {
      // debugger
      if (!inputRef.current.contains(e.target as Node)) {
        // debugger
        console.log("yes indeed")
        setShowSearchResults(false);
      }
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClick)
    // debugger
    return () => document.removeEventListener("click", handleClick);
  }, []);

  async function getSearchResults(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchString(e.target.value);
    setShowSearchResults(true);

    if (controllerRef.current) {
      // debugger
      controllerRef.current.abort();
    }

    if (e.target.value.trim()) {

      controllerRef.current = new AbortController();
      const signal = controllerRef.current.signal;

      const res = await axios.get(`http://localhost:3000/anime/all?q=${e.target.value}`, {
        signal: signal
      })

      // debugger
      console.log(res);
      const searchList: Anime[] = res.data;
      setSearchAnimeList(searchList.slice(0, 3));
    }
    else {
      setSearchAnimeList([])
    }

  }

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
        <NavLink className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-200" to={"/home"}>
          LOGO
        </NavLink>
      </div>

      {/* Middle - Search Bar */}
      <div className="grid grid-cols-[auto_1fr] gap-4 max-w-md mx-8 relative">
        <input
          type="text"
          placeholder="Search anime..."
          className="w-full px-4 py-2 bg-[#322f49] rounded-full text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={searchString}
          onChange={getSearchResults}
        />
        <Button innerText="" />
        {showSearchResults && (
          <div
            className="absolute top-[70px] left-0 w-[400px] max-h-[400px] overflow-y-auto bg-[#1e1b2e] border border-pink-400 rounded-lg shadow-lg z-50"
            ref={inputRef}
          >
            {searchAnimeList.length > 0 ? (
              searchAnimeList.map((anime) => (
                <NavLink
                  key={anime.id}
                  className="flex items-center gap-4 p-3 hover:bg-[#2a263a] transition-colors cursor-pointer"
                  to={`/${anime.title}`}
                  onClick={() => {
                    setSearchAnimeList([]);
                    setShowSearchResults(false);
                  }}
                >
                  <img
                    src={anime.thumbnailUrl}
                    alt={anime.title}
                    className="w-[60px] h-[85px] object-cover rounded-md"
                  />
                  <div className="text-white font-medium text-sm line-clamp-2">
                    {anime.title}
                  </div>
                </NavLink>
              ))
            ) : (
              <p className="text-gray-400 px-4 py-2 text-sm">No results found.</p>
            )}
          </div>
        )}

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
            <>
              <button className="text-white cursor-pointer relative" onClick={() => nav("/settings")}>
                <img src="/vite.svg" alt="" />
              </button>
              <button className="px-4 py-2 rounded-full cursor-pointer text-white hover:text-pink-400 transition" onClick={handleLogout}>
                Log out
              </button>
            </>
        }
      </div>
    </header>

  );
};

export default Header;
