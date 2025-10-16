import Button from "./Button";

const Header = () => {
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
    <button className="text-white cursor-pointer font-medium hover:text-pink-400 transition">
      Log in
    </button>
    <button className="px-4 py-2 rounded-full cursor-pointer text-white hover:text-pink-400 transition">
      Sign up
    </button>
  </div>
</header>

  );
};

export default Header;
