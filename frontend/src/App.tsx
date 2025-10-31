import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Landing from "./components/home/Landing";
import Home from "./components/home/Home";
import Layout from "./layouts/Layout";
import Watch from "./components/video-player/Watch";
import AnimeDetails from "./components/anime/AnimeDetails";
import { createContext, useEffect, useRef, useState } from "react";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { ADMIN_URL, AUTH_URL } from "./api";
import Settings from "./components/user-profile/Settings";
import type { Season, User } from "./types";
import Popular from "./components/home/Popular";
import Latest from "./components/home/Latest";
import VerifyRegistration from "./components/VerifyRegistration";


type PORTAL_CONTEXT = {
  seasonList: React.RefObject<Season[]>;
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  userRef: React.RefObject<User | null>,
  isAdmin: boolean
};

export const PORTAL = createContext<PORTAL_CONTEXT>({
  seasonList: {
    current: []
  },
  user: null,
  setUser: () => {},
  userRef: {
    current: null
  },
  isAdmin: false
});

const App = () => {

  const seasonListRef = useRef<Season[]>([]);
  const userRef = useRef<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const contextValue: PORTAL_CONTEXT = {
    seasonList: seasonListRef,
    user: user,
    setUser: setUser,
    userRef: userRef,
    isAdmin: isAdmin
  }

  useEffect(() => {
    userRef.current = user
    async function amIAdmin() {
      try {
        const res = await ADMIN_URL.get("/");
        if (res.status === 200) {
          setIsAdmin(true);
          // console.log("is admin")
        }
      }
      catch (err) {
        setIsAdmin(false);
        console.error(err);
      }
    }
    amIAdmin();
  }, [user]);

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
    },
    {
      path: "/settings",
      element: <Settings />
    },
    {
      path: "/misc",
      element: <Layout />,
      children: [
        {
          path: "popular",
          element: <Popular />
        },
        {
          path: "latest",
          element: <Latest />
        }
      ]
    },
    {
      path: "/auth/verify-registration",
      element: <VerifyRegistration />
    }
  ]);

  return <PORTAL.Provider value={contextValue}>
    <RouterProvider router={router} />
  </PORTAL.Provider>
}

export default App;
