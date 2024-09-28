import { useState } from "react";
import InputMessage from "../../ui/InputMessage";
import API from "../../axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    API.post("/Auth/login", { email: email, password: password })
      .then((response) => {
        console.log("created", response.data.result);
        sessionStorage.setItem("auth", response.data.result);
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-r from-[#31587A] to-[#3C3266] place-items-center justify-center gap-12">
      <h1 className="text-white font-bold text-4xl">Autorizēšanās</h1>
      <form onSubmit={onFormSubmit} className="flex flex-col gap-6">
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
        <div className="flex flex-col gap-4">
          <input
            className="h-12 bg-[#E63946] rounded-md shadow-lg text-white text-2xl font-bold hover:bg-opacity-50 transition-all hover:cursor-pointer"
            type="submit"
            value="Turpināt"
          />
          <InputMessage error={true} message="Kļūda..." />
        </div>
        <hr className="border-dashed" />
        <a
          href="/admin/register"
          className="text-white text-lg place-self-center hover:underline"
        >
          Reģistrēt kontu
        </a>
      </form>
    </div>
  );
};

export default AdminLogin;
