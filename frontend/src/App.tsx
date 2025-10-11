import { useState } from "react";
import "./App.css";
import axios from "axios";
import AddAnimeForm from "./components/temp/AddAnime";
import DeleteAnime from "./components/temp/DeleteAnime";
import AllAnimeList from "./components/temp/AllAnimeList";
import AnimeSearch from "./components/temp/AnimeSearch";

const App = () => {

  const [registerPayload, setRegisterPayload] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [loginPayload, setLoginPayload] = useState({
    email: "",
    password: "",
  })

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const key = e.target.name;
    const val = e.target.value;
    setRegisterPayload(prev => {
      return {
        ...prev, [key]: val
      }
    });
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const key = e.target.name;
    const val = e.target.value;
    setLoginPayload(prev => {
      return {
        ...prev, [key]: val
      }
    });
  }

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const res = await axios.post("http://localhost:3000/auth/register", registerPayload, {
        withCredentials: true,
      })
      console.log(res.data);
    } catch (err) {
      console.log("error happened - ", err);
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const res = await axios.post("http://localhost:3000/auth/login", loginPayload, {
        withCredentials: true,
      })
      console.log(res);
    } catch (err) {
      console.log("error happened - ", err);
    }
  }


  return <div className="grid place-items-center h-full">
    <div>
      <h1 className="text-6xl text-center mb-8">Register</h1>
      <form action="" onSubmit={handleRegisterSubmit} className="grid place-items-center gap-2">
        <input
          type="text"
          name="username"
          placeholder="username"
          value={registerPayload.username}
          onChange={handleRegisterChange}
          className="border-2 p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          value={registerPayload.email}
          onChange={handleRegisterChange}
          className="border-2 p-2"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={registerPayload.password}
          onChange={handleRegisterChange}
          className="border-2 p-2"
        />
        <button className="bg-cyan-300 cursor-pointer p-2">Submit</button>
      </form>
    </div>
    <div>
      <h1 className="text-6xl text-center mb-8">Login</h1>
      <form action="" onSubmit={handleLoginSubmit} className="grid place-items-center gap-2">
        <input
          type="email"
          name="email"
          placeholder="email"
          value={loginPayload.email}
          onChange={handleLoginChange}
          className="border-2 p-2"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={loginPayload.password}
          onChange={handleLoginChange}
          className="border-2 p-2"
        />
        <button className="bg-cyan-300 cursor-pointer p-2">Submit</button>
      </form>
    </div>
    <button onClick={async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin", {
          withCredentials: true
        })
        console.log(res);
      } catch (e) {
        console.log("no idk something happended with ping adming orn ot", e);
      }
    }}>
      PING ADMIN OR NOT
    </button>
    <AddAnimeForm />
    <DeleteAnime />
    <AllAnimeList />
    <AnimeSearch />
  </div>
}

export default App;
