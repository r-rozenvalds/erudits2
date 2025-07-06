interface IPaginationBottomProps {
  className?: string;
  currentPage: number;
  totalResults: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const PaginationBottom = ({
  className,
  currentPage,
  totalResults,
  limit,
  onPageChange,
}: IPaginationBottomProps) => {
  const total_pages = Math.ceil(totalResults / limit);

  const getVisiblePages = (): number[] => {
    const pages: number[] = [];

    for (let i = -1; i <= 1; i++) {
      const page = currentPage + i;
      if (page >= 1 && page <= total_pages) {
        pages.push(page);
      }
    }

    return pages;
  };

  return (
    <div className={`flex justify-between items-center pb-2 px-3 ${className}`}>
      <div className="flex gap-2">
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 text-center bg-gray-200"
          >
            <i className="fa-solid fa-caret-left"></i>
          </button>
        )}
        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 text-center rounded-sm ${
              page === currentPage
                ? "bg-[#E63946] font-bold text-white"
                : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
        {currentPage < total_pages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 text-center bg-gray-200"
          >
            <i className="fa-solid fa-caret-right"></i>
          </button>
        )}
      </div>

      <p>
        Kopā {totalResults} {totalResults === 1 ? "ieraksts" : "ieraksti"}{" "}
        {total_pages} {total_pages === 1 ? "lapā" : "lapās"}
      </p>
    </div>
  );
};
