import { useEffect, useState } from "react";
import { constants } from "../../../constants";
import { getCurrentUser } from "../../universal/functions";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../universal/Toast";
import { localizeError, localizeSuccess } from "../../../localization";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const showToast = useToast();

  const onFormSubmit = async (e: { preventDefault: () => void }) => {
    setIsLoading(true);
    e.preventDefault();
    await fetch(`${constants.baseApiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          showToast!(true, localizeSuccess(data.message));

          sessionStorage.setItem(constants.sessionStorage.TOKEN, data.token);
          navigate("/admin/games");
        } else {
          Object.keys(data).map((key) =>
            showToast!(false, localizeError(data[key]))
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setIsLoading(false);
  };

  const redirectIfLoggedIn = async () => {
    console.log(await getCurrentUser());
    if (await getCurrentUser()) {
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
        className="flex flex-col gap-6 max-w-96 place-items-center"
      >
        <input
          className="h-10 w-80 rounded-md px-4 text-xl"
          placeholder="E-pasts"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="h-10 w-80 rounded-md px-4 text-xl"
          placeholder="Parole"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex flex-col gap-4 place-items-center">
          <input
            className={`h-12 rounded-md shadow-lg text-white text-2xl font-bold transition-all w-80 ${
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
        <button
          onClick={() => navigate("/admin/register")}
          className="text-white text-lg place-self-center hover:underline"
        >
          Reģistrēt kontu
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
