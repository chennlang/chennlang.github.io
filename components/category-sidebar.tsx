import Link from "next/link";
import { PostData } from "@/types/post";

interface CategorySidebarProps {
  categories: string[];
  posts: PostData[];
  currentCategory?: string;
}

export default function CategorySidebar({
  categories,
  posts,
  currentCategory,
}: CategorySidebarProps) {
  return (
    <>
      {/* 移动端横向布局 */}
      <div className="md:hidden w-full overflow-x-auto sticky left-0 top-20">
        <div className="bg-white shadow-md p-4">
          <div className="flex gap-2 min-w-max">
            <Link
              href="/page/1"
              className={`px-3 py-2 rounded-full text-sm whitespace-nowrap
                ${
                  !currentCategory
                    ? "bg-gray-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              全部文章
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/categories/${encodeURIComponent(category)}/1`}
                className={`px-3 py-2 rounded-full text-sm whitespace-nowrap
                  ${
                    category === currentCategory
                      ? "bg-gray-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {category}
                <span className="ml-1">
                  (
                  {
                    posts.filter((post) =>
                      post.frontmatter.categories?.includes(category)
                    ).length
                  }
                  )
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* PC端竖向侧边栏 */}
      <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24 self-start">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">文章分类</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/page/1"
                className={`block p-2 rounded transition-colors
                  ${
                    !currentCategory
                      ? "bg-gray-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                全部文章
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/categories/${encodeURIComponent(category)}/1`}
                  className={`block p-2 rounded transition-colors
                    ${
                      category === currentCategory
                        ? "bg-gray-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-sm ml-2 ${
                      category === currentCategory
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    (
                    {
                      posts.filter((post) =>
                        post.frontmatter.categories?.includes(category)
                      ).length
                    }
                    )
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
