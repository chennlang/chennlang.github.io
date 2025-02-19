import Link from "next/link";
import { PostData } from "@/types/post"; // 请确保创建了这个类型

interface PostListProps {
  posts: PostData[];
}
// visited:text-gray-500
export default function PostList({ posts }: PostListProps) {
  return (
    <ul className="w-full">
      {posts.map((post) => (
        <Link
          key={post.frontmatter.title}
          className="w-full block bg-white p-4 mb-5 shadow-md rounded-lg"
          href={`/post/${post.id}`}
        >
          <article>
            <h1 className="text-2xl font-bold my-4">
              {post.frontmatter.title}
            </h1>
            <p className="mt-4 text-wrap break-words leading-7">
              【{post.frontmatter.date}】{post.frontmatter.summary}
            </p>
            {post.frontmatter.categories && (
              <div className="mt-4 flex gap-2">
                {post.frontmatter.categories.map((cat: string) => (
                  <span
                    key={cat}
                    className="px-2 py-1 text-sm bg-gray-100 rounded"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </article>
        </Link>
      ))}
    </ul>
  );
}
