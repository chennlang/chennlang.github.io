import { getAllPostList } from "@/utils/post";
import Pagination from "@/components/pagination";
import CategorySidebar from "@/components/category-sidebar";
import PostList from "@/components/post-list";
import PageLayout from "@/components/page-layout";

type Params = Promise<{ category: string; page: string }>;

export async function generateStaticParams() {
  const posts = await getAllPostList();
  const categories = Array.from(
    new Set(posts.flatMap((post) => post.frontmatter.categories || []))
  );

  const params = [];
  for (const category of categories) {
    const categoryPosts = posts.filter((post) =>
      post.frontmatter.categories?.includes(category)
    );
    const totalPages = Math.ceil(categoryPosts.length / 10);

    for (let page = 1; page <= totalPages; page++) {
      params.push({
        category,
        page: page.toString(),
      });
    }
  }
  return params;
}

async function CategoryPage({ params }: { params: Params }) {
  const { page, category } = await params;
  const posts = await getAllPostList();
  const categories = Array.from(
    new Set(posts.flatMap((post) => post.frontmatter.categories || []))
  );

  const currentPage = Number(page);
  const postsPerPage = 10;

  const filteredPosts = posts.filter((post) =>
    post.frontmatter.categories?.includes(category)
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <PageLayout>
      <CategorySidebar
        categories={categories}
        posts={posts}
        currentCategory={category}
      />
      <div className="flex-grow mx-4">
        <PostList posts={currentPosts} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </PageLayout>
  );
}

export default CategoryPage;
