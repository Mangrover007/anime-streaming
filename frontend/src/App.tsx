import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing";
import Home from "./components/Home";
import Layout from "./layouts/Layout";
import Watch from "./components/Watch";
import AnimeDetails, { type Season } from "./components/AnimeDetails";
import { createContext, useEffect, useRef, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AUTH_URL } from "./api";

type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
  roleId: number;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
};


type SeasonContextType = {
  seasonList: React.RefObject<Season[]>;
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
};

export const PORTAL = createContext<SeasonContextType>({
  seasonList: {
    current: []
  },
  user: null,
  setUser: () => {},
});

const App = () => {

  const seasonListRef = useRef<Season[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const contextValue: SeasonContextType = {
    seasonList: seasonListRef,
    user: user,
    setUser: setUser
  }

  useEffect(() => {
    async function whoAmI() {
      const res = await AUTH_URL.get("/who");
      if (res.status === 200) {
        setUser(res.data);
      }
    }
    whoAmI();
  }, []);

  const router = createBrowserRouter([
    {
      index: true,
      path: "/",
      element: <Landing />
    },
    {
      path: "/home",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />
        },
      ]
    },
    {
      path: "/:animeName",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <AnimeDetails />
        },
        {
          path: "watch",
          element: <Watch />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    }
  ]);

  return <PORTAL.Provider value={contextValue}>
    <RouterProvider router={router} />
  </PORTAL.Provider>
}

export default App;
