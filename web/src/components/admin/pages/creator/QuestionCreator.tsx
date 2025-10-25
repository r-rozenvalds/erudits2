import { FormEvent, useEffect, useState } from "react";
import { SaveDeleteButtons } from "../../ui/SaveDeleteButtons";
import { gameStore } from "../../../../stores/GameStore";
import { IQuestion } from "../../../../stores/interfaces/creator/IQuestion";
import { ImageUploadModal } from "./ImageUploadModal";
import { IAnswer } from "../../../../stores/interfaces/creator/IAnswer";
import { AnswerCreator } from "./AnswerCreator";
import { useConfirmation } from "../../../universal/ConfirmationWindowContext";
import { creatorStore } from "../../../../stores/CreatorStore";
import { useParams } from "react-router-dom";

export const QuestionCreator = ({ question }: { question: IQuestion }) => {
  const [title, setTitle] = useState<string>(question.title);
  const [isTextAnswer, setIsTextAnswer] = useState<boolean>(
    question.is_text_answer
  );
  const [answers, setAnswers] = useState<IAnswer[]>(question.answers ?? []);

  const [isImageUploadModalOpen, setIsImageUploadModalOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { postQuestion, postAnswer } = gameStore();
  const { fetchCurrentGame } = creatorStore();
  const { gameId } = useParams();

  const confirm = useConfirmation();

  useEffect(() => {
    // potentially problematic
    setTitle(question.title);
    setIsTextAnswer(question.is_text_answer);
    setAnswers(question.answers ?? []);
  }, [question]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const request = {
      ...question,
      title,
      is_text_answer: isTextAnswer,
    } as IQuestion;

    await postQuestion(request);

    setIsLoading(false);
  };

  const onDelete = async () => {};

  const onImageUploadModalConfirm = (guidelines: string, image: File) => {};

  const addNewAnswer = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const request = {
      question_id: question.id,
      text: "Atbilde",
      is_correct: false,
    } as IAnswer;

    if (await postAnswer(request)) {
      await fetchCurrentGame(gameId!);
    }
  };

  const toggleTextAnswer = async () => {
    if (answers.length > 0) {
      if (
        await confirm(
          "Vai tiešām mainīt jautājuma veidu? Pašlaik ierakstītās atbildes tiks dzēstas."
        )
      ) {
        setAnswers([]);
        setIsTextAnswer(!isTextAnswer);
      }

      return;
    }
    setIsTextAnswer(!isTextAnswer);
  };

  const deleteAnswer = async (
    e: { preventDefault: () => void },
    index: number
  ) => {
    e.preventDefault();

    const updatedAnswers = answers.filter((_, i) => i !== index);

    setAnswers(updatedAnswers);
  };

  return (
    <div className="flex w-full p-4 rounded-md font-[Manrope] grow bg-white">
      {isImageUploadModalOpen && (
        <ImageUploadModal
          question={question}
          onCancel={() => setIsImageUploadModalOpen(false)}
          onConfirm={onImageUploadModalConfirm}
        />
      )}
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-2 w-full justify-between"
      >
        <div className="flex grow flex-col gap-6">
          <div className="flex gap-6">
            <div className="flex flex-col gap-2 grow">
              <label className="text-lg font-semibold">Jautājums</label>
              <div className="flex">
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="Kā sauc Latvijas pirmo prezidentu?"
                  className="p-2 px-4 shadow-sm rounded-s-sm grow bg-slate-100"
                  value={title}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsImageUploadModalOpen(!isImageUploadModalOpen);
                  }}
                  className="p-2 rounded-e-sm px-4 bg-slate-200 hover:bg-slate-300"
                >
                  <i className="fa-solid fa-image"></i>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 place-items-center justify-between">
              <label className="text-lg font-semibold">
                Atvērtais jautājums
              </label>
              <input
                onChange={toggleTextAnswer}
                type="checkbox"
                className="w-8 h-8 p-2 rounded-md text-center accent-[#E63946]"
                checked={isTextAnswer}
              />
            </div>
          </div>
          <div className="">
            {answers.map((answer, idx) => {
              return (
                <AnswerCreator
                  answer={answer}
                  index={answer.id}
                  setAnswer={(answer) =>
                    setAnswers(answers.map((a, i) => (i === idx ? answer : a)))
                  }
                />
              );
            })}
          </div>
        </div>
        <div className="w-full mt-8">
          <SaveDeleteButtons
            showSpinner={isLoading}
            onDelete={onDelete}
            showNavigationButtons
          />
        </div>
      </form>
    </div>
  );
};
