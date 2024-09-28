import { useEffect, useState } from "react";
import { AdminSessionStorage } from "../enum/AdminSessionStorage";
import { CreateGameFormValues } from "../interface/CreateGameFormValues";
import CreateGameModel from "../models/CreateGameModel";
import useDebounce from "../useDebounce";

export const AdminGameCreator = () => {
  const [title, setTitle] = useState(CreateGameModel.name);
  const [description, setDescription] = useState(CreateGameModel.description);
  const [isLoaded, setIsLoaded] = useState(false);

  let formValues: CreateGameFormValues = CreateGameModel;

  const debounceTitle = useDebounce(title, 1000);
  const debounceDescription = useDebounce(description, 1000);

  const saveToSessionStorage = () => {
    sessionStorage.setItem(
      AdminSessionStorage.gameCreator,
      JSON.stringify(formValues)
    );
  };

  const loadFormValues = () => {
    return JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.gameCreator) || "{}"
    ) as CreateGameFormValues;
  };

  useEffect(() => {
    if (isLoaded) {
      formValues.name = debounceTitle;
      saveToSessionStorage();
    }
  }, [debounceTitle]);

  useEffect(() => {
    if (isLoaded) {
      formValues.description = debounceDescription;
      saveToSessionStorage();
    }
  }, [debounceDescription]);

  useEffect(() => {
    formValues = loadFormValues();
    setTitle(formValues.name);
    setDescription(formValues.description);
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden p-12 bg-gradient-to-r from-[#31587A] to-[#3C3266] gap-6">
      <div className="flex w-full p-4 rounded-md font-[Manrope] gap-4 bg-white place-items-center">
        <a href="/admin/games" className="text-lg">
          Spēļu saraksts
        </a>
        <i className="fa-solid fa-chevron-right"></i>
        <a className="text-lg">Spēles izveide</a>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
      <div className="flex w-full p-4 rounded-md font-[Manrope] grow bg-white">
        <form className="flex flex-col gap-2 w-full justify-between">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold">Spēles nosaukums</label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="p-2 px-4 shadow-sm rounded-sm bg-slate-100"
              value={title}
            />
            <label className="text-lg font-semibold">Apraksts</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="p-2 px-4 shadow-sm h-40 rounded-sm bg-slate-100 resize-none"
            />
          </div>
          <input
            className="h-12 w-60 bg-[#E63946] rounded-md shadow-lg text-white text-xl font-bold hover:bg-opacity-50 transition-all hover:cursor-pointer place-self-end"
            type="submit"
            value="Turpināt"
          />
        </form>
      </div>
    </div>
  );
};
