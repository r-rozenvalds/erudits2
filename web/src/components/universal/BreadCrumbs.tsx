import { useNavigate } from "react-router-dom";
import { BreadCrumb } from "../admin/interface/BreadCrumb";

export const BreadCrumbs = ({ crumbs }: { crumbs: BreadCrumb[] }) => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full p-4 rounded-md font-[Manrope] gap-4 bg-white place-items-center">
      {crumbs.map((crumb) => {
        return (
          <>
            <button onClick={() => navigate(crumb.path)} className="text-lg">
              {crumb.name}
            </button>
            <i className="fa-solid fa-chevron-right"></i>
          </>
        );
      })}
    </div>
  );
};
