import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AUTH_URL } from "../api";
import { PORTAL } from "../App";

const LoginPage = () => {
  const { setUser } = useContext(PORTAL);
  const nav = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const key = e.target.name;
    const val = e.target.value;
    setLoginData(prev => {
      return {
        ...prev, [key]: val
      }
    });
  }

  async function handleLogin() {
    const res = await AUTH_URL.post("/login", loginData);
    if (res.status === 200) {
      setUser(res.data);
      nav("/home");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f0c1a] flex items-center justify-center overflow-hidden font-sans">

      {/* Background anime image blurred */}
      <img
        src="/banner.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
      />

      {/* Animated glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1a172b]/80 via-[#1f1b3a]/60 to-[#0f0c1a]/90" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#1a172b]/80 backdrop-blur-xl border border-[#2e2a47] rounded-3xl p-10 shadow-[0_0_30px_rgba(255,0,255,0.1)]">

        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-6">
          Welcome Back
        </h1>

        <p className="text-sm text-center text-gray-400 mb-8">
          Enter you credentials below
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-5 py-3 rounded-xl text-white placeholder:text-gray-400 bg-[#28243a]/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            name="email"
            value={loginData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 rounded-xl text-white placeholder:text-gray-400 bg-[#28243a]/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            name="password"
            value={loginData.password}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleLogin}
          className="relative mt-6 w-full py-3 rounded-xl font-bold text-white bg-pink-400 border-2 border-transparent z-10 hover:bg-pink-600 hover:border-pink-600 transition-colors duration-300 cursor-pointer"
        >
          <span className="relative z-10">Log in</span>
        </button>

        <div className="text-sm text-gray-400 text-center mt-6">
          No account?{" "}
          <NavLink to="/signup" className="text-pink-400 hover:underline">
            Sign up
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
