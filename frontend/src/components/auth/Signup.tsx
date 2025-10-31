import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AUTH_URL } from "../../api";

const Signup = () => {
  const nav = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSignup() {
    try {
      const res = await AUTH_URL.post("/register", registerData);
      if (res.status === 201) {
        setMessage("Email registered. Please check your email to veirfy it and then proceed to log in.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }

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

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md bg-[#1a172b]/80 backdrop-blur-xl border border-[#2e2a47] rounded-3xl p-10 shadow-[0_0_30px_rgba(255,0,255,0.1)]">
        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-6">
          Create Account
        </h1>

        <p className="text-sm text-center text-gray-400 mb-8">
          Sign up to get started
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="w-full px-5 py-3 rounded-xl text-white placeholder:text-gray-400 bg-[#28243a]/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            value={registerData.username}
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            className="w-full px-5 py-3 rounded-xl text-white placeholder:text-gray-400 bg-[#28243a]/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            value={registerData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            className="w-full px-5 py-3 rounded-xl text-white placeholder:text-gray-400 bg-[#28243a]/80 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            value={registerData.password}
            onChange={handleChange}
          />
        </div>

        <p
          className={`mt-4 text-center text-sm transition-all duration-300 ${message
              ? "text-cyan-300 bg-[#28243a]/60 px-4 py-2 rounded-lg border border-cyan-400/30 shadow-[0_0_10px_rgba(0,255,255,0.1)]"
              : "text-transparent"
            }`}
        >
          {message}
        </p>


        <button
          onClick={handleSignup}
          className="relative mt-6 w-full py-3 rounded-xl font-bold text-white bg-pink-400 border-2 border-transparent z-10 hover:bg-pink-600 hover:border-pink-600 transition-colors duration-300 cursor-pointer"
        >
          <span className="relative z-10">Sign up</span>
        </button>

        <div className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <NavLink to="/login" className="text-pink-400 hover:underline">
            Log in
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Signup;
