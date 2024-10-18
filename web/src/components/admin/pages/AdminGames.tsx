import { constants } from "../../../constants";
import { AdminGameTable } from "../ui/table/AdminGameTable";
import { useEffect } from "react";

export const AdminGames = () => {
  useEffect(() => {
    fetch(`${constants.baseApiUrl}/users/me`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (response) => {
        alert("fetched");
        console.log(await response.formData());
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const logOut = () => {
    fetch(`${constants.baseApiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        sessionStorage.removeItem(constants.sessionStorage.TOKEN);
        window.location.assign("/");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-r from-[#31587A] to-[#3C3266]">
      <div className="flex flex-col w-screen h-screen p-12 gap-12">
        <div className="flex justify-between">
          <span className="font-[Manrope] font-semibold text-white text-3xl">
            Izveidotās spēles
          </span>
          <div className="flex gap-6">
            <button onClick={() => logOut()}>
              <i className="fa-solid fa-right-from-bracket text-white text-3xl hover:opacity-80"></i>
            </button>
            <button
              onClick={() => window.location.assign("games/create")}
              className="bg-emerald-400 px-6 rounded-sm shadow-sm hover:cursor-pointer hover:bg-emerald-300 py-2"
            >
              <span className="font-[Manrope] font-semibold">Jauna spēle</span>
              <i className="fa-solid fa-plus ms-6"></i>
            </button>
          </div>
        </div>
        <AdminGameTable />
      </div>
    </div>
  );
};
