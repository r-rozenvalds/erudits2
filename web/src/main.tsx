import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLogin from "./components/admin/pages/AdminLogin.tsx";
import AdminRegister from "./components/admin/pages/AdminRegister.tsx";
import { AdminGames } from "./components/admin/pages/AdminGames.tsx";
import { AdminGameCreator } from "./components/admin/pages/AdminGameCreator.tsx";
import { GameCreatorQuestionRound } from "./components/admin/pages/GameCreatorRound.tsx";
import { GameCreatorQuestion } from "./components/admin/pages/GameCreatorQuestion.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "admin/login",
    element: <AdminLogin />,
  },
  {
    path: "admin/register",
    element: <AdminRegister />,
  },
  {
    path: "admin/games",
    element: <AdminGames />,
  },
  {
    path: "admin/games/creator/:gameId",
    element: <AdminGameCreator />,
  },
  {
    path: "admin/games/creator/:gameId/round/:roundId",
    element: <GameCreatorQuestionRound />,
  },
  {
    path: "admin/games/creator/:gameId/round/:roundId/question/:questionId",
    element: <GameCreatorQuestion />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
