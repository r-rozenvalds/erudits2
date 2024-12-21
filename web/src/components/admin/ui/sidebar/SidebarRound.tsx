import { useState } from "react";
import { IRound } from "../../interface/IRound";
import { formatText } from "../../../universal/functions";
import { useSidebar } from "../../../universal/AdminGameSidebarContext";
import { AdminSessionStorage } from "../../enum/AdminSessionStorage";
import { constants } from "../../../../constants";
import { useBreadCrumbs } from "../../../universal/BreadCrumbContext";
import { useNavigate } from "react-router-dom";
import { SpinnerCircularFixed } from "spinners-react";

export const SidebarRound = ({ round }: { round: IRound }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { game, questions } = useSidebar();
  const navigate = useNavigate();
  const { setBreadCrumbs, clearBreadCrumbs } = useBreadCrumbs();

  const roundQuestions = questions?.filter(
    (question) => question.round_id === round.id
  );

  const createQuestion = async () => {
    setIsLoading(true);
    const values = JSON.parse(
      sessionStorage.getItem(AdminSessionStorage.questionCreator) || "{}"
    );
    if (!values) {
      return;
    }
    const response = await fetch(
      `${constants.baseApiUrl}/create-question/${values.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(
            constants.sessionStorage.TOKEN
          )}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      clearBreadCrumbs();
      setBreadCrumbs("/admin/games", "Spēļu saraksts");
      setBreadCrumbs("/admin/games/editor/game/" + game!.id, game!.title);
      setBreadCrumbs("/admin/games/editor/round/" + round.id, round.title);
      setBreadCrumbs("", "Spēles jautājums");
      sessionStorage.setItem(
        AdminSessionStorage.questionCreator,
        JSON.stringify({
          id: data.question.id,
          title: data.question.title,
          is_text_answer: data.question.is_text_answer,
          guidelines: data.question.guidelines,
          image_url: data.question.image_url,
          round_id: data.question.round_id,
          answers: data.question.answers,
        })
      );
      navigate(`/admin/games/creator/question/${data.question.id}`);
    } else {
      console.error("Failed to create question:", response.statusText);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-slate-200 font-semibold w-10 h-10 rounded-md hover:bg-slate-100 disabled:pointer disabled:hover:bg-slate-200 disabled:opacity-90"
        >
          <i
            className={`fa-solid fa-caret-${isCollapsed ? "down" : "right"}`}
          ></i>
        </button>
        <button className="bg-slate-200 font-semibold grow h-10 rounded-md hover:bg-slate-100 px-2">
          {formatText(round.title, 20)} - {roundQuestions?.length ?? 0}{" "}
          <i className="fa-regular fa-circle-question"></i>
        </button>
      </div>
      {isCollapsed && (
        <div className="flex flex-col gap-2">
          {roundQuestions &&
            roundQuestions.map((question, index) => (
              <button
                key={index}
                className="bg-slate-200 w-full h-8 rounded-md p-1 hover:bg-slate-100"
              >
                {formatText(question.title, 20)}
              </button>
            ))}

          <button
            onClick={createQuestion}
            className="bg-slate-200 w-full h-8 rounded-md p-1 hover:bg-slate-100"
          >
            {!isLoading && <i className="fa-solid fa-plus"></i>}
            {isLoading && (
              <div className="mx-auto w-4">
                <SpinnerCircularFixed
                  color="#ffffff"
                  size={16}
                  thickness={180}
                />
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
