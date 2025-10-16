import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing";
import Home from "./components/Home";
import Layout from "./layouts/Layout";
import Watch from "./components/Watch";
import AnimeDetails from "./components/AnimeDetails";

const App = () => {

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
      path: "/anime",
      element: <Layout />,
      children: [
        {
          path: ":id",
          element: <AnimeDetails />
        },
      ]
    },
    {
      path: "watch",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Watch />
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />
}

export default App;
