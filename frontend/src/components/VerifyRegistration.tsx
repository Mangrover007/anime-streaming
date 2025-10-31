import { useEffect, useState } from "react";
import { AUTH_URL } from "../api";
import { useSearchParams } from "react-router-dom";

const VerifyRegistration = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<string>("Verifying your email...");

  async function pingVerifyToken() {
    try {
      const res = await AUTH_URL.get(
        `/verify-registration?token=${searchParams.get("token")}`
      );
      if (res.status === 200) {
        setMessage("Your email is verified. You can close this window now.");
      } else {
        setMessage("Verification failed. Please try again or request a new link.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("Verification failed. Please try again later.");
    }
  }

  useEffect(() => {
    pingVerifyToken();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f0c1a] text-white font-sans overflow-hidden">
      {/* Background with glow and blur */}
      <img
        src="/banner.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1a172b]/80 via-[#1f1b3a]/60 to-[#0f0c1a]/90" />

      {/* Message box */}
      <div className="relative z-10 p-10 bg-[#1a172b]/80 backdrop-blur-xl border border-[#2e2a47] rounded-3xl shadow-[0_0_30px_rgba(255,0,255,0.1)] max-w-md text-center">
        <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
          Email Verification
        </h1>
        <p
          className={`text-sm transition-all duration-300 ${
            message.includes("verified")
              ? "text-cyan-300"
              : message.includes("failed")
              ? "text-pink-400"
              : "text-gray-400"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default VerifyRegistration;
