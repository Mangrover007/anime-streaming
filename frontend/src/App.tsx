import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing";
import Home from "./components/Home";
import Layout from "./layouts/Layout";
import Watch from "./components/Watch";
import AnimeDetails, { type Season } from "./components/AnimeDetails";
import { createContext, useRef } from "react";

type SeasonContextType = {
  seasonList: React.RefObject<Season[]>;
};

export const PORTAL = createContext<SeasonContextType>({
  seasonList: {
    current: []
  }
});

const App = () => {

  const seasonListRef = useRef<Season[]>([]);

  const contextValue: SeasonContextType = {
    seasonList: seasonListRef
  }

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
  ]);

  return <PORTAL.Provider value={contextValue}>
    <RouterProvider router={router} />
  </PORTAL.Provider>
}

export default App;
