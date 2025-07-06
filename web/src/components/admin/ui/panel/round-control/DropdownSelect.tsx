import { useEffect, useRef, useState } from "react";

interface IDropdownSelectProps<T> {
  title: string;
  items: T[];
  value: string;
  getItemName: (item: T) => string;
  onItemSelect: (item: T) => void;
}

export const DropdownSelect = <T,>({
  title,
  items,
  getItemName,
  onItemSelect,
}: IDropdownSelectProps<T>) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>(
    getItemName(items[0])
  );
  const dropdownRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectItem = (item: T) => {
    setSelectedItem(getItemName(item));
    onItemSelect(item);
  };

  return (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      ref={dropdownRef}
      className="bg-slate-300 flex-col flex place-items-center text-center h-10 cursor-pointer relative min-w-0 w-1/2"
    >
      <p className="text-xs">{title}</p>
      <div className="w-5/6 flex place-items-center justify-center gap-2">
        <p className="text-ellipsis overflow-hidden whitespace-nowrap">
          {selectedItem}
        </p>
        <i className={`fa-solid fa-caret-${isExpanded ? "up" : "down"}`}></i>
      </div>
      {isExpanded && (
        <ol className="shadow-lg absolute w-full z-20 top-[44px] overflow-y-scroll max-h-[450px]">
          {items.map((item, index) => (
            <li
              onClick={() => selectItem(item)}
              key={index}
              className="h-8 py-1 w-full bg-slate-100 hover:bg-slate-200 list-item"
            >
              <button className="w-full text-ellipsis overflow-hidden whitespace-nowrap px-4">
                {index + 1}. {getItemName(item)}
              </button>
            </li>
          ))}
        </ol>
      )}
    </button>
  );
};
