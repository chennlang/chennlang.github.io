import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const generatePagination = (currentPage: number, totalPages: number) => {
    const pages = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        pages.push(2, 3);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push("...");
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push("...");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = generatePagination(currentPage, totalPages);

  return (
    <div className="pagination flex justify-center mt-4">
      <ul className="flex items-center">
        {pages.map((page, index) => (
          <li key={index} className="px-2 mr-2">
            {page === "..." ? (
              <span className="text-2xl cursor-default">{page}</span>
            ) : (
              <Link
                href={`/page/${page}`}
                className={`text-2xl cursor-pointer ${
                  page === currentPage ? "text-black" : ""
                }`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
