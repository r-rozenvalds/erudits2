import { AdminGameTableHeader } from "./AdminGameTableHeader";
import { AdminGameTableItem } from "./AdminGameTableItem";

export const AdminGameTable = () => {
  return (
    <ul className="w-full gap-2 flex flex-col">
      <li>
        <AdminGameTableHeader />
      </li>
      <li>
        <AdminGameTableItem />
      </li>
      <li>
        <AdminGameTableItem />
      </li>
      <li>
        <AdminGameTableItem />
      </li>
    </ul>
  );
};
