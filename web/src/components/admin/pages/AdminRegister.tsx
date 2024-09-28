import InputMessage from "../../ui/InputMessage";

const AdminRegister = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-r from-[#31587A] to-[#3C3266] place-items-center justify-center gap-12">
      <h1 className="text-white font-bold text-4xl">Reģistrācija</h1>
      <form className="flex flex-col gap-6">
        <input
          className="h-10 w-80 rounded-md px-4 text-xl"
          placeholder="Lietotājvārds"
          type="text"
        />
        <input
          className="h-10 w-80 rounded-md px-4 text-xl"
          placeholder="Parole"
          type="password"
        />
        <input
          className="h-10 w-80 rounded-md px-4 text-xl"
          placeholder="Paroles apstiprinājums"
          type="password"
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
          href="/admin/login"
          className="text-white text-lg place-self-center hover:underline"
        >
          Autorizēties
        </a>
      </form>
    </div>
  );
};

export default AdminRegister;
