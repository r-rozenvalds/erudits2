import { useNavigate } from "react-router-dom";
import { userStore } from "../../../stores/UserStore";

interface INavbarProps {
  sectionTitle: string;
}

interface INavbarItem {
  text: string;
  icon: string;
  customClass?: string;
  function: () => void;
}

export const Navbar = ({ sectionTitle }: INavbarProps) => {
  const { logout } = userStore();
  const navigate = useNavigate();

  const navbarItems: INavbarItem[] = [
    {
      text: "Manas spēles",
      icon: "list-ul",
      function: () => navigate("/admin/games"),
    },
    {
      text: "Jauna spēle",
      icon: "plus",
      customClass: "hover:bg-green-300",
      function: () => console.log("shit"),
    },
    {
      text: "Beigt darbu",
      icon: "right-from-bracket",
      function: () => handleLogout(),
    },
  ];

  const handleLogout = async () => {
    if (await logout()) {
      navigate("/");
    }
  };

  return (
    <div className="h-12 w-full bg-white rounded-sm flex place-items-center px-4 justify-between">
      <span className="font-semibold text-xl">{sectionTitle}</span>
      <div className="flex place-items-center">
        {navbarItems.map((item: INavbarItem, idx) => {
          return (
            <>
              {idx !== 0 && <div className="w-[1px] bg-gray-300 h-8"></div>}
              <button
                onClick={item.function}
                className={`font-semibold h-12 hover:bg-slate-200 px-4 ${item.customClass}`}
              >
                <i className={`fa-solid fa-${item.icon} me-2`}></i>
                {item.text}
              </button>
            </>
          );
        })}
      </div>
    </div>
  );
};
