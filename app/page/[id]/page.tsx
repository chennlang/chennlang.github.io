import { getAllPostList } from "@/utils/post";
import Pagination from "@/components/pagination";
import CategorySidebar from "@/components/category-sidebar";
import PostList from "@/components/post-list";
import PageLayout from "@/components/page-layout";

export async function generateStaticParams() {
  const posts = await getAllPostList();
  const totalPages = Math.ceil(posts.length / 10);

  return Array.from({ length: totalPages }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

const Page = async ({ params }: { params: any }) => {
  const currentPage = Number(params.id) || 1;
  const postsPerPage = 10;
  const posts = await getAllPostList();
  const categories = Array.from(
    new Set(posts.flatMap((post) => post.frontmatter.categories || []))
  );

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <PageLayout>
      <CategorySidebar categories={categories} posts={posts} />
      <div className="flex-grow mx-4">
        <PostList posts={currentPosts} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </PageLayout>
  );
};

export default Page;
