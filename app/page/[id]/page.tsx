import CanvasTitlePanel from "@/components/canvas-title-panel";
import { getAllPostIds, getAllPostList } from "@/utils/post";
import Link from "next/link";
import Pagination from "@/components/pagination";

// 添加静态路径生成
export async function generateStaticParams() {
  const ids = await getAllPostIds();
  const totalPages = Math.ceil(ids.length / 10);
  console.log(totalPages, "totalPages");

  return Array.from({ length: totalPages }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

const Page = async ({ params }: { params: any }) => {
  const currentPage = Number(params.id) || 1;
  const postsPerPage = 10; // 每页显示的文章数量
  const posts = await getAllPostList(); // 获取所有文章
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div>
      <CanvasTitlePanel></CanvasTitlePanel>
      <div className="mx-8 max-w-[950px] lg:mx-auto mt-8">
        <ul className="w-full">
          {currentPosts.map((m) => (
            <Link
              key={m.frontmatter.title}
              className="w-full block bg-white p-4 mt-5 shadow-md"
              href={`/post/${m.id}`}
            >
              <article>
                <h1 className="text-2xl font-bold my-4">
                  {m.frontmatter.title}
                </h1>
                <p className="mt-4 text-wrap break-words leading-7 text-stone-600">
                  【{m.frontmatter.date}】{m.frontmatter.summary}
                </p>
              </article>
            </Link>
          ))}
        </ul>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Page;
