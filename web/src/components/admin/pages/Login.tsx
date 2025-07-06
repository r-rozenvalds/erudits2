import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../../stores/UserStore";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, getUser } = userStore();

  const navigate = useNavigate();

  const onFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    await login({ email, password });
    setIsLoading(false);
  };

  const redirectIfLoggedIn = async () => {
    if (await getUser()) {
      navigate("/admin/games");
    }
  };

  useEffect(() => {
    redirectIfLoggedIn();
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-r from-[#31587A] to-[#3C3266] place-items-center justify-center gap-12">
      <h1 className="text-white font-bold text-4xl">Autorizācija</h1>
      <form
        onSubmit={onFormSubmit}
        className="flex flex-col gap-3 max-w-96 place-items-center"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-white">
            E-pasts
          </label>
          <input
            id="email"
            className="h-10 w-80 rounded-md px-4 text-xl"
            placeholder="janis.berzins@erudits.lv"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-white">
            Parole
          </label>
          <input
            className="h-10 w-80 rounded-md px-4 text-xl"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4 place-items-center">
          <input
            className={`h-12 rounded-md shadow-lg mt-4 text-white text-2xl font-bold transition-all w-80 ${
              isLoading
                ? "cursor-not-allowed bg-gray-500"
                : "hover:cursor-pointer bg-[#E63946] hover:bg-opacity-50"
            }`}
            type="submit"
            disabled={isLoading}
            value="Turpināt"
          />
          <div className="flex flex-col"></div>
        </div>
        <hr className="border-dashed w-80" />
      </form>
      <button
        onClick={() => navigate("/admin/register")}
        className="text-white text-lg place-self-center hover:underline"
      >
        Reģistrēt kontu
      </button>
    </div>
  );
};

export default AdminLogin;
