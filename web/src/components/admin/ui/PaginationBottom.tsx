interface IPaginationBottomProps {
  current_page: number;
  total_results: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const PaginationBottom = ({
  current_page,
  total_results,
  limit,
  onPageChange,
}: IPaginationBottomProps) => {
  const total_pages = Math.ceil(total_results / limit);

  const getVisiblePages = (): number[] => {
    const pages: number[] = [];

    for (let i = -1; i <= 1; i++) {
      const page = current_page + i;
      if (page >= 1 && page <= total_pages) {
        pages.push(page);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center pb-2 px-3">
      <div className="flex gap-2">
        {current_page > 1 && (
          <button
            onClick={() => onPageChange(current_page - 1)}
            className="w-8 h-8 text-center bg-gray-200"
          >{`<`}</button>
        )}
        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 text-center ${
              page === current_page
                ? "bg-[#E63946] font-bold text-white"
                : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
        {current_page < total_pages && (
          <button
            onClick={() => onPageChange(current_page + 1)}
            className="w-8 h-8 text-center bg-gray-200"
          >{`>`}</button>
        )}
      </div>

      <p>
        Kopā {total_results} {total_results === 1 ? "ieraksts" : "ieraksti"}{" "}
        {total_pages} {total_pages === 1 ? "lapā" : "lapās"}
      </p>
    </div>
  );
};
