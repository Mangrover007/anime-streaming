import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing";
import Home, { type Anime } from "./components/Home";
import Layout from "./layouts/Layout";
import Watch from "./components/Watch";
import AnimeDetails, { type Season } from "./components/AnimeDetails";
import { createContext, use, useEffect, useRef, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AUTH_URL } from "./api";
import Settings from "./components/Settings";

type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
  roleId: number;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
  favoriteAnimes: Anime[]
};


type SeasonContextType = {
  seasonList: React.RefObject<Season[]>;
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  userRef: React.RefObject<User | null>,
};

export const PORTAL = createContext<SeasonContextType>({
  seasonList: {
    current: []
  },
  user: null,
  setUser: () => {},
  userRef: {
    current: null
  }
});

const App = () => {

  const seasonListRef = useRef<Season[]>([]);
  const userRef = useRef<User | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const contextValue: SeasonContextType = {
    seasonList: seasonListRef,
    user: user,
    setUser: setUser,
    userRef: userRef
  }

  useEffect(() => {
    userRef.current = user
  }, [user]);

  useEffect(() => {
    async function whoAmI() {
      const res = await AUTH_URL.get("/who");
      if (res.status === 200) {
        setUser(res.data);
        console.log(res.data);
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
    },
    {
      path: "/settings",
      element: <Settings />
    }
  ]);

  return <PORTAL.Provider value={contextValue}>
    <RouterProvider router={router} />
  </PORTAL.Provider>
}

export default App;
