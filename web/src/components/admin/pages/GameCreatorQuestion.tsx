import { useEffect, useState } from "react";
import { AdminSessionStorage } from "../enum/AdminSessionStorage";
import { CreateQuestionFormValues } from "../interface/CreateQuestionFormValues";
import useDebounce from "../useDebounce";
import { GroupMinimap } from "../ui/minimap/GroupMinimap";
import { QuestionMinimap } from "../ui/minimap/QuestionMinimap";
import CreateQuestionModel from "../models/CreateQuestionModel";
import { Answer } from "../ui/Answer";

export const GameCreatorQuestion = () => {
  const [question, setQuestion] = useState(CreateQuestionModel.question);
  const [isOpenAnswer, setIsOpenAnswer] = useState(
    CreateQuestionModel.is_open_answer
  );
  const [answers, setAnswers] = useState(CreateQuestionModel.answers);
  const [openAnswers, setOpenAnswers] = useState(
    CreateQuestionModel.open_answers
  );

  const [isLoaded, setIsLoaded] = useState(false);

  let formValues: CreateQuestionFormValues = CreateQuestionModel;

  const debounceQuestion = useDebounce(question, 1000);
  const debounceIsOpenAnswer = useDebounce(isOpenAnswer, 1000);
  const debounceAnswers = useDebounce(answers, 1000);
  const debounceOpenAnswers = useDebounce(openAnswers, 1000);

  const saveToSessionStorage = () => {
    sessionStorage.setItem(
      AdminSessionStorage.questionCreator,
      JSON.stringify(formValues)
    );
  };

  const loadFormValues = () => {
    return JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.questionCreator) || "{}"
    ) as CreateQuestionFormValues;
  };

  useEffect(() => {
    if (isLoaded) {
      formValues.question = debounceQuestion;
      saveToSessionStorage();
    }
  }, [debounceQuestion]);

  useEffect(() => {
    if (isLoaded) {
      formValues.is_open_answer = debounceIsOpenAnswer;
      saveToSessionStorage();
    }
  }, [debounceIsOpenAnswer]);

  useEffect(() => {
    if (isLoaded) {
      formValues.answers = debounceAnswers;
      saveToSessionStorage();
    }
  }, [debounceAnswers]);

  useEffect(() => {
    if (isLoaded) {
      formValues.open_answers = debounceOpenAnswers;
      saveToSessionStorage();
      console.log(formatOpenAnswers());
    }
  }, [debounceOpenAnswers]);

  useEffect(() => {
    const loadedValues = loadFormValues();
    formValues = { ...formValues, ...loadedValues };
    setQuestion(formValues.question);
    setIsOpenAnswer(formValues.is_open_answer);
    setAnswers(formValues.answers);
    setOpenAnswers(formValues.open_answers);
    console.log("initial", formValues);

    setIsLoaded(true);
  }, []);

  const addNewAnswer = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (answers.length < 4) {
      setAnswers([...answers, { prompt: "", isCorrect: false }]);
    }
  };

  const formatOpenAnswers = () => {
    return openAnswers.toString().split(",");
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden p-12 bg-gradient-to-r from-[#31587A] to-[#3C3266] gap-6">
      <div className="flex w-full p-4 rounded-md font-[Manrope] gap-4 bg-white place-items-center">
        <a href="/admin/games" className="text-lg">
          Spēļu saraksts
        </a>
        <i className="fa-solid fa-chevron-right"></i>
        <a className="text-lg">Spēles izveide</a>
        <i className="fa-solid fa-chevron-right"></i>
        <a className="text-lg">Pirmā kārta</a>
        <i className="fa-solid fa-chevron-right"></i>
        <a className="text-lg">Jautājums</a>
      </div>
      <div className="flex w-full p-4 rounded-md font-[Manrope] grow bg-white">
        <form className="flex flex-col gap-2 w-full justify-between">
          <div className="flex grow flex-col gap-6">
            <div className="flex gap-6">
              <div className="flex flex-col gap-2 grow">
                <label className="text-lg font-semibold">Jautājums</label>
                <div className="flex">
                  <input
                    onChange={(e) => setQuestion(e.target.value)}
                    type="text"
                    placeholder="Kā sauc Latvijas pirmo prezidentu?"
                    className="p-2 px-4 shadow-sm rounded-s-sm grow bg-slate-100"
                    value={question}
                  />
                  <label
                    htmlFor="imageUpload"
                    className="p-2 bg-slate-200 rounded-e-sm px-4 hover:bg-slate-300"
                  >
                    <i className="fa-solid fa-image"></i>
                  </label>
                  <input
                    id="imageUpload"
                    className="hidden"
                    type="file"
                  ></input>
                </div>
              </div>
              <div className="flex flex-col gap-2 place-items-center justify-between">
                <label className="text-lg font-semibold">
                  Atvērtais jautājums
                </label>
                <input
                  onChange={() => setIsOpenAnswer(!isOpenAnswer)}
                  type="checkbox"
                  className="w-8 h-8 p-2 rounded-md text-center accent-[#E63946]"
                  checked={isOpenAnswer}
                />
              </div>
            </div>
            {!isOpenAnswer && (
              <div className="h-full flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="text-lg font-semibold">
                      Atbildes ({answers ? answers.length : 0}/4)
                    </label>
                    <button
                      onClick={(e) => addNewAnswer(e)}
                      className="mx-2 px-4 rounded-md shadow-md bg-[#E63946] hover:bg-opacity-50"
                    >
                      <i className="fa-solid text-sm text-white fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div className="flex justify-evenly h-full">
                  {answers &&
                    answers.map((answer, index) => (
                      <Answer
                        key={index}
                        answer={answer}
                        index={index}
                        onInput={(newPrompt: string) => {
                          const updatedAnswers = [...answers];
                          updatedAnswers[index] = {
                            ...updatedAnswers[index],
                            prompt: newPrompt,
                          };
                          setAnswers(updatedAnswers);
                        }}
                        onChecked={(isCorrect: boolean) => {
                          const updatedAnswers = [...answers];
                          updatedAnswers[index] = {
                            ...updatedAnswers[index],
                            isCorrect: isCorrect,
                          };
                          setAnswers(updatedAnswers);
                        }}
                        onDelete={() => {
                          const updatedAnswers = [...answers];
                          if (answers.length > 1) {
                            setAnswers(
                              updatedAnswers.filter(
                                (item) => item !== updatedAnswers[index]
                              )
                            );
                          }
                        }}
                      />
                    ))}
                </div>
              </div>
            )}
            {isOpenAnswer && (
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-lg">
                  Spēlētājs uz šo jautājumu atbildi sniegs rakstiski.
                </span>
                <label>
                  Pareizās atbildes: (mazie burti, atdalīt ar komatiem,
                  <b> bez liekām atstarpēm</b>)
                </label>
                <textarea
                  value={openAnswers}
                  onChange={(e) => setOpenAnswers(e.target.value)}
                  placeholder="jānis čakste,j.čakste,j. čakste"
                  className="resize-none grow h-48 p-2 px-4 bg-slate-100 rounded-md"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            <QuestionMinimap />
            <div className="flex gap-6">
              <GroupMinimap />
              <div className="flex gap-1 w-60">
                <input
                  className="h-12 grow bg-[#E63946] rounded-s-md shadow-lg text-white text-xl font-bold hover:bg-opacity-50 transition-all hover:cursor-pointer place-self-end"
                  type="submit"
                  value="Turpināt"
                />
                <button className="bg-[#9c2630] w-10 rounded-e-md hover:opacity-50">
                  <i className="fa-solid fa-eye text-white"></i>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
