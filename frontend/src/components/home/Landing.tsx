import { useState } from "react";
import Button from "../Button";
import { NavLink } from "react-router-dom";

const Landing = () => {

  const [query, setQuery] = useState<string>("");

  function handleSearchAnime() {
    console.log(query);
  }

  return (
    <div className="grid grid-cols-2 h-screen bg-[#0f0c1a] font-sans overflow-hidden">

      {/* Left Side - Banner Image with Fade */}
      <div className="relative w-full h-full">
        <img
          src="banner.png"
          alt="Anime banner"
          className="w-full h-full object-cover"
        />
        {/* Gradient fade to right */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0c1a]"></div>
      </div>

      {/* Right Side - Hero Content */}
      <div className="flex flex-col justify-center px-12 space-y-8">
        <h1 className="text-4xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
          Watch the Latest Anime Shows
        </h1>

        <p className="text-lg text-gray-300">
          Stream high-quality anime episodes instantly, anytime. New shows every week!
        </p>

        {/* View All Button */}
        <NavLink
          to="/home"
          className="relative inline-flex items-center justify-center 
             px-10 py-4 text-xl font-extrabold text-white 
             bg-pink-400 rounded-full border-2 border-transparent 
             w-auto max-w-fit"
        >
          <span className="relative z-10">Watch Now</span>
          <div className="absolute inset-0 rounded-full p-[2px] 
                  bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 z-[-1]">
          </div>
        </NavLink>

        {/* Search Section */}
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-400">Looking for something specific?</p>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search for anime..."
              className="flex-1 px-5 py-3 rounded-full text-white placeholder:text-gray-400 bg-[#1c1a2e] border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Button innerText="Search" onClick={handleSearchAnime} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
