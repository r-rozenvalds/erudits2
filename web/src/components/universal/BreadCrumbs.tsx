import { useNavigate } from "react-router-dom";
import { useBreadCrumbs } from "./BreadCrumbContext";

export const BreadCrumbs = () => {
  const navigate = useNavigate();
  const { breadCrumbs } = useBreadCrumbs();
  return (
    <div className="flex w-full p-4 rounded-md font-[Manrope] bg-white place-items-center">
      {breadCrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex place-items-center">
          <button
            onClick={() => navigate(crumb.path)}
            className="text-lg hover:underline"
          >
            {crumb.name}
          </button>
          {index < breadCrumbs.length - 1 && (
            <i className="fa-solid fa-chevron-right mx-3"></i>
          )}
        </div>
      ))}
    </div>
  );
};
