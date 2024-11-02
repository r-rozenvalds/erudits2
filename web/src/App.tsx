import { useNavigate } from "react-router-dom";
import InstanceCard from "./components/ui/InstanceCard";

function App() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-r from-[#31587A] to-[#3C3266]">
      <form className="flex flex-col w-screen h-screen">
        <div className="flex flex-col w-full h-full place-items-center justify-center gap-8">
          <p className="text-white lg:text-5xl text-3xl font-[Manrope]">
            Sistēma "Erudīts v2.0"
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 place-items-center">
              <input
                placeholder="Spēles kods"
                type="text"
                className="font-[Manrope] h-14 lg:rounded-e-none rounded-md shadow-lg lg:text-4xl text-2xl font-semibold px-6 text-center focus:outline-none focus:border-2 border-[#E63946]"
              />
              <input
                className="font-[Manrope] w-32 h-14 bg-[#E63946] lg:rounded-s-none rounded-md shadow-lg text-white text-2xl font-bold hover:bg-opacity-50 transition-all hover:cursor-pointer"
                type="submit"
                value="Spēlēt"
              />
            </div>
          </div>
        </div>

        <div className="text-center animate-bounce">
          <p className="text-white font-semibold text-2xl">Lokālās spēles</p>
          <i className="fa-solid fa-chevron-down text-3xl text-white"></i>
        </div>
      </form>
      <div className="bg-black bg-opacity-25 h-auto p-12">
        <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-12">
          <InstanceCard />
        </div>
        <div className="w-full text-center">
          <h1 className="text-white text-2xl font-[Manrope]">
            Pašlaik nav lokālas spēles. :(
          </h1>
        </div>
      </div>
      <div className="bg-black bg-opacity-30 flex h-24 p-12 place-items-center justify-between">
        <p className="text-white font-semibold">Veidoja: Roberts R.; 2024</p>
        <button
          onClick={() => navigate("/admin/login")}
          className="w-24 py-1 bg-[#E63946] rounded-md text-center shadow-lg text-white font-semibold hover:bg-opacity-50 transition-all lg:block hidden hover:cursor-pointer"
        >
          <span className="text-center h-8">Admin</span>
        </button>
      </div>
    </div>
  );
}

export default App;
