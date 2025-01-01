import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLogin from "./components/admin/pages/Login.tsx";
import AdminRegister from "./components/admin/pages/Register.tsx";
import { AdminGames } from "./components/admin/pages/Games.tsx";
import { AdminGameCreator } from "./components/admin/pages/creator/Game.tsx";
import { GameCreatorQuestionRound } from "./components/admin/pages/creator/Round.tsx";
import { GameCreatorQuestion } from "./components/admin/pages/creator/Question.tsx";
import { ToastProvider } from "./components/universal/Toast.tsx";
import { CreatorLayout } from "./components/admin/pages/layouts/CreatorLayout.tsx";
import { BreadCrumbProvider } from "./components/universal/BreadCrumbContext.tsx";
import { AdminGameEditor } from "./components/admin/pages/editor/Game.tsx";
import { GameEditorQuestionRound } from "./components/admin/pages/editor/Round.tsx";
import { GameEditorQuestion } from "./components/admin/pages/editor/Question.tsx";
import { ConfirmationProvider } from "./components/universal/ConfirmationWindowContext.tsx";

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
    path: "admin/games/creator",
    element: <CreatorLayout />,
    children: [
      {
        path: "game/:gameId",
        element: <AdminGameCreator />,
      },
      {
        path: "round/:roundId",
        element: <GameCreatorQuestionRound />,
      },
      {
        path: "question/:questionId",
        element: <GameCreatorQuestion />,
      },
    ],
  },
  {
    path: "admin/games/editor",
    element: <CreatorLayout />,
    children: [
      {
        path: "game/:roundId",
        element: <AdminGameEditor />,
      },
      {
        path: "round/:roundId",
        element: <GameEditorQuestionRound />,
      },
      {
        path: "question/:questionId",
        element: <GameEditorQuestion />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <ConfirmationProvider>
        <BreadCrumbProvider>
          <RouterProvider router={router} />
        </BreadCrumbProvider>
      </ConfirmationProvider>
    </ToastProvider>
  </React.StrictMode>
);
