import React from "react";
import ReactDOM from "react-dom/client";
import { LandingPage } from "./components/player/pages/LandingPage.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLogin from "./components/admin/pages/Login.tsx";
import AdminRegister from "./components/admin/pages/Register.tsx";
import { ToastProvider } from "./components/universal/Toast.tsx";
import { BreadCrumbProvider } from "./components/universal/BreadCrumbContext.tsx";
import { ConfirmationProvider } from "./components/universal/ConfirmationWindowContext.tsx";
import { Lobby } from "./components/player/pages/Lobby.tsx";
import { Game } from "./components/player/pages/Game.tsx";
import { Panel } from "./components/admin/pages/panel/Panel.tsx";
import { PlayerLayout } from "./components/player/pages/layouts/PlayerLayout.tsx";
import { PanelLayout } from "./components/admin/pages/layouts/PanelLayout.tsx";
import { GameEnd } from "./components/player/pages/GameEnd.tsx";
import { Disqualified } from "./components/player/pages/Disqualified.tsx";
import { Buzzer } from "./components/admin/ui/panel/Buzzer.tsx";
import { AdminLayout } from "./components/admin/pages/layouts/AdminLayout.tsx";
import { UserProvider } from "./stores/UserStore.tsx";
import { RequireAuth } from "./components/universal/RequireAuth.tsx";
import { Creator } from "./components/admin/pages/creator/Creator.tsx";
import { CreatorProvider } from "./stores/CreatorStore.tsx";
import { Dashboard } from "./components/admin/pages/Dashboard.tsx";
import { PlayerInstanceProvider } from "./components/player/stores/PlayerInstanceStore.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PlayerInstanceProvider>
        <LandingPage />
      </PlayerInstanceProvider>
    ),
  },
  {
    path: "admin/login",
    element: (
      <UserProvider>
        <AdminLogin />
      </UserProvider>
    ),
  },
  {
    path: "admin/register",
    element: (
      <UserProvider>
        <AdminRegister />
      </UserProvider>
    ),
  },
  {
    path: "admin",
    element: (
      <UserProvider>
        <RequireAuth>
          <AdminLayout />
        </RequireAuth>
      </UserProvider>
    ),
    children: [
      {
        path: "games",
        element: <Dashboard />,
      },
      {
        path: "creator/:gameId",
        element: (
          <CreatorProvider>
            <Creator />
          </CreatorProvider>
        ),
      },
    ],
  },
  {
    path: "play",
    element: <PlayerLayout />,
    children: [
      {
        path: "lobby",
        element: <Lobby />,
      },
      {
        path: "game",
        element: <Game />,
      },
      {
        path: "end",
        element: <GameEnd />,
      },
      {
        path: "disqualified",
        element: <Disqualified />,
      },
    ],
  },
  {
    path: "admin/panel",
    element: <PanelLayout />,
    children: [
      {
        path: ":instanceId",
        element: <Panel />,
      },
      {
        path: "buzzer/:instanceId",
        element: <Buzzer />,
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
