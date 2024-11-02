import { FormEvent, useEffect, useState } from "react";
import { AdminSessionStorage } from "../enum/AdminSessionStorage";
import { CreateGameFormValues } from "../interface/CreateGameFormValues";
import CreateGameModel from "../models/CreateGameModel";
import useDebounce from "../../universal/useDebounce";
import { constants } from "../../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { SubmitSaveButton } from "../ui/SubmitSaveButton";
import { BreadCrumbs } from "../../universal/BreadCrumbs";
import { BreadCrumb } from "../interface/BreadCrumb";
import { useToast } from "../../universal/Toast";
import { localizeError, localizeSuccess } from "../../../localization";

export const AdminGameCreator = () => {
  const [title, setTitle] = useState(CreateGameModel.title);
  const [description, setDescription] = useState(CreateGameModel.description);
  const [isLoaded, setIsLoaded] = useState(false);

  var formValues: CreateGameFormValues = CreateGameModel;

  const navigate = useNavigate();

  const { gameId } = useParams();

  const debounceTitle = useDebounce(title, 300);
  const debounceDescription = useDebounce(description, 300);

  const showToast = useToast();

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
      formValues.title = debounceTitle;
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
    setTitle(formValues.title);
    setDescription(formValues.description);
    loadValues();
    setIsLoaded(true);
  }, []);

  const loadValues = async () => {
    await fetch(`${constants.baseApiUrl}/games/${gameId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
    }).then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        setTitle(data.title);
        setDescription(data.description);
      }
    });
  };

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch(`${constants.baseApiUrl}/games/${gameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
      body: JSON.stringify(formValues),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          if (data.existingId) {
            console.log("existing");
            navigate(`/admin/games/creator/${gameId}/round/${data.existingId}`);
            return;
          }
          console.log("data", data);
          showToast!(true, localizeSuccess(data.message));

          navigate(`/admin/games/creator/${gameId}/round/${data.id}`);
        } else {
          Object.keys(data).map((key) =>
            showToast!(false, localizeError(data[key]))
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSave = async () => {
    await fetch(`${constants.baseApiUrl}/games/${gameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
      body: JSON.stringify(formValues),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          showToast!(true, localizeSuccess(data.message));
        } else {
          Object.keys(data).map((key) =>
            showToast!(false, localizeError(data[key]))
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const breadCrumbs: BreadCrumb[] = [
    { name: "Spēļu saraksts", path: "/admin/games" },
    { name: "Spēles izveide", path: "" },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden p-12 bg-gradient-to-r from-[#31587A] to-[#3C3266] gap-6">
      <BreadCrumbs crumbs={breadCrumbs} />
      <div className="flex w-full p-4 rounded-md font-[Manrope] grow bg-white">
        <form
          onSubmit={(e) => onFormSubmit(e)}
          className="flex flex-col gap-2 w-full justify-between"
        >
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
          <div className="place-self-end">
            <SubmitSaveButton onSave={onSave} />
          </div>
        </form>
      </div>
    </div>
  );
};
