import { useEffect, useState } from "react";
import { AdminSessionStorage } from "../../enum/AdminSessionStorage";
import useDebounce from "../../../universal/useDebounce";
import { QuestionMinimap } from "../../ui/minimap/QuestionMinimap";
import CreateQuestionModel from "../../models/CreateQuestionModel";
import { Answer } from "../../ui/Answer";
import { SubmitSaveButton } from "../../ui/SubmitSaveButton";
import { useBreadCrumbs } from "../../../universal/BreadCrumbContext";
import { IQuestion } from "../../interface/IQuestion";
import { useSidebar } from "../../../universal/AdminGameSidebarContext";
import { constants } from "../../../../constants";
import { useToast } from "../../../universal/Toast";
import { localizeError, localizeSuccess } from "../../../../localization";

export const GameCreatorQuestion = () => {
  const [question, setQuestion] = useState(CreateQuestionModel.title);
  const [isOpenAnswer, setIsOpenAnswer] = useState(
    CreateQuestionModel.is_text_answer
  );
  const [answers, setAnswers] = useState(CreateQuestionModel.answers);
  const [openAnswers, setOpenAnswers] = useState(
    CreateQuestionModel.open_answers
  );

  let formValues: IQuestion = CreateQuestionModel;

  const { questions, setQuestions } = useSidebar();

  const [isLoading, setIsLoading] = useState(false); // for spinner

  const [isLoaded, setIsLoaded] = useState(false); // for debounce

  const debounceQuestion = useDebounce(question, 300);
  const debounceIsOpenAnswer = useDebounce(isOpenAnswer, 300);
  const debounceAnswers = useDebounce(answers, 300);
  const debounceOpenAnswers = useDebounce(openAnswers, 300);

  const saveToSessionStorage = () => {
    var values = JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.questionCreator) || "{}"
    );

    values = {
      ...values,
      title: formValues.title,
      is_text_answer: formValues.is_text_answer,
      guidelines: formValues.guidelines,
      image_url: formValues.image_url,
      answers: formValues.answers,
    };
    sessionStorage.setItem(
      AdminSessionStorage.questionCreator,
      JSON.stringify(values)
    );
  };

  const loadFormValues = () => {
    return JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.questionCreator) || "{}"
    ) as IQuestion;
  };

  useEffect(() => {
    if (isLoaded) {
      formValues.title = debounceQuestion;
      saveToSessionStorage();
    }
  }, [debounceQuestion]);

  useEffect(() => {
    if (isLoaded) {
      formValues.is_text_answer = debounceIsOpenAnswer;
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
    setQuestion(formValues.title);
    setIsOpenAnswer(formValues.is_text_answer);
    setAnswers(formValues.answers);
    setOpenAnswers(formValues.open_answers);

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

  const { setBreadCrumbs, clearBreadCrumbs, removeLastBreadCrumb } =
    useBreadCrumbs();

  const showToast = useToast();

  const onFormSubmit = async (e: { preventDefault: () => void }) => {
    setIsLoading(true);
    e.preventDefault();
    const values = JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.questionCreator) || "{}"
    );
    if (!values) {
      return;
    }
    const response = await fetch(`${constants.baseApiUrl}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem(
          constants.sessionStorage.TOKEN
        )}`,
      },
      body: JSON.stringify({
        id: values.id,
        title: values.title,
        is_text_answer: values.is_text_answer,
        guidelines: values.guidelines,
        image_url: values.image_url,
        round_id: values.round_id,
        answers: values.answers,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setQuestions([...(questions || []), values]);
      removeLastBreadCrumb();
      setBreadCrumbs("/admin/games/editor/question/" + values.id, values.title);
      showToast(true, localizeSuccess(data.message));
    } else {
      setIsLoading(false);
      const data = await response.json();
      Object.keys(data).map((key) =>
        showToast!(false, localizeError(data[key]))
      );
    }
  };

  return (
    <div className="flex w-full p-4 rounded-md font-[Manrope] grow bg-white">
      <form
        onSubmit={onFormSubmit}
        className="flex flex-col gap-2 w-full justify-between"
      >
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
                <input id="imageUpload" className="hidden" type="file"></input>
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
        <div className="flex gap-6 justify-end">
          <SubmitSaveButton showSpinner={isLoading} hideContinueButton={true} />
        </div>
      </form>
    </div>
  );
};
