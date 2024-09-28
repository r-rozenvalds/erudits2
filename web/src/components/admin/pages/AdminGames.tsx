import { AdminGameTable } from "../ui/table/AdminGameTable";
import API from "../../axios";
import CreateGameModel from "../models/CreateGameModel";
import { useEffect } from "react";
import axios from "axios";

export const AdminGames = () => {
  async function createNewGame() {
    await API.post("/Games", CreateGameModel)
      .then(() => {
        console.log("created");
      })
      .catch((error) => {
        console.log(CreateGameModel);
        alert(error.message);
      });
  }
  const token = sessionStorage.getItem("auth");

  async function getCurrentUser() {
    try {
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        "https://localhost:7277/api/Users/current",
        {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
          },
        }
      );

      console.log("User data:", response.data);
    } catch (error: any) {
      console.error(
        "Error fetching user data:",
        error.response ? error.response.data : error.message
      );
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-r from-[#31587A] to-[#3C3266]">
      <div className="flex flex-col w-screen h-screen p-12 gap-12">
        <div className="flex justify-between">
          <span className="font-[Manrope] font-semibold text-white text-3xl">
            Izveidotās spēles
          </span>
          <button
            onClick={() => createNewGame()}
            className="bg-emerald-400 px-6 rounded-sm shadow-sm hover:cursor-pointer hover:bg-emerald-300"
          >
            <span className="font-[Manrope] font-semibold">Jauna spēle</span>
            <i className="fa-solid fa-plus ms-6"></i>
          </button>
        </div>
        <AdminGameTable />
      </div>
    </div>
  );
};
