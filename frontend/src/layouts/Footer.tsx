import { useState } from "react";

const Footer = () => {
  const [formData, setFormData] = useState({
    senderEmail: "",
    subject: "",
    content: "",
  });
  const [message, setMessage] = useState<string>("");
  const [loading] = useState<boolean>(false); // NEW state

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // setLoading(true);
    // setMessage("");
    // try {
    //   // const res = await PROT_URL.post("/email", formData);
    //   if (res.status === 200) {
    //     setMessage("Message sent successfully!");
    //     setFormData({ senderEmail: "", subject: "", content: "" });
    //   }
    // } catch (err) {
    //   console.error(err);
    //   setMessage("Something went wrong. Please try again later.");
    // } finally {
      // setLoading(false);
    // }
    setMessage("Message sent successfully!");
    // setLoading(false);
    setFormData({ senderEmail: "", subject: "", content: "" });
  }

  return (
    <footer className="relative px-[100px] py-12 bg-[#0f0c1a] text-white shadow-inner border-t border-[#2e2a47]/40">
      <div className="flex flex-col md:flex-row justify-between gap-12">
        {/* Left Section — Brand Info */}
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-amber-200">
            LOGO
          </h2>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed max-w-md">
            We're passionate about anime and bringing fans together.  
            Have feedback, ideas, or collaboration inquiries? Drop us a message — we'll get back to you soon!
          </p>

          <div className="flex items-center gap-4 mt-5">
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
              <i className="fab fa-twitter"></i> Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
              <i className="fab fa-discord"></i> Discord
            </a>
          </div>
        </div>

        {/* Right Section — Contact Form */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-pink-400 mb-4">Contact Us</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                name="senderEmail"
                placeholder="Your email"
                value={formData.senderEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-[#1a172b]/70 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                disabled={loading}
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-[#1a172b]/70 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
                disabled={loading}
              />
            </div>

            <textarea
              name="content"
              placeholder="Write your message..."
              value={formData.content}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-xl bg-[#1a172b]/70 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition resize-none"
              disabled={loading}
            />

            <div className="flex justify-end items-center gap-3">
              {loading && (
                <span className="text-sm text-gray-400 animate-pulse">
                  Sending...
                </span>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`py-2 px-6 rounded-full font-semibold bg-gradient-to-r from-pink-400 to-amber-300 text-white shadow-md transition 
                ${loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>

            {message && (
              <p
                className={`text-sm text-center mt-2 ${
                  message.includes("success") ? "text-cyan-300" : "text-pink-400"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="mt-12 pt-6 border-t border-[#2e2a47]/40 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} LOGO. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
