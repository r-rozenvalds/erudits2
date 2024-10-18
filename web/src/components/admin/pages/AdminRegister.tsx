import { useEffect, useState } from "react";
import { constants } from "../../../constants";
import { InputMessage } from "../../ui/InputMessage";
import { getCurrentUser } from "../../universal/functions";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onFormSubmit = async (e: { preventDefault: () => void }) => {
    setIsLoading(true);
    setError({});
    e.preventDefault();
    await fetch(`${constants.baseApiUrl}/auth/register`, {
      body: JSON.stringify({
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          sessionStorage.setItem(constants.sessionStorage.TOKEN, data.token);
          navigate("/admin/games");
        } else {
          setError(data);
        }
      })
      .catch((err) => {
        setError(err);
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
      <h1 className="text-white font-bold text-4xl">Reģistrācija</h1>
      <form
        onSubmit={onFormSubmit}
        className="flex flex-col gap-6 place-items-center"
      >
        <input
          className={`h-10 w-80 rounded-md px-4 text-xl ${
            Object.keys(error).length ? "border-2 border-[#E63946]" : ""
          }`}
          placeholder="E-pasts"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={`h-10 w-80 rounded-md px-4 text-xl ${
            Object.keys(error).length ? "border-2 border-[#E63946]" : ""
          }`}
          placeholder="Parole"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className={`h-10 w-80 rounded-md px-4 text-xl ${
            Object.keys(error).length ? "border-2 border-[#E63946]" : ""
          }`}
          placeholder="Paroles apstiprinājums"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <div className="flex flex-col gap-4 place-items-center">
          <input
            className={`h-12 rounded-md shadow-lg text-white text-2xl font-bold transition-all w-80 ${
              isLoading
                ? "cursor-not-allowed bg-gray-500"
                : "hover:cursor-pointer bg-[#E63946] hover:bg-opacity-50"
            }`}
            type="submit"
            value="Turpināt"
            disabled={isLoading}
          />
          <div className="flex flex-col">
            {Object.keys(error).map((key, index) => (
              <InputMessage key={index} error={true} message={error[key]} />
            ))}
          </div>
        </div>
        <hr className="border-dashed w-80" />
        <button
          onClick={() => navigate("/admin/login")}
          className="text-white text-lg place-self-center hover:underline"
        >
          Autorizēties
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
