import { getAllPostIds, getPost } from "@/utils/post";
import Comments from "@/components/comments";
import ImagePreview from "@/components/image-preview";
import "./post.css";

export async function generateStaticParams() {
  const posts = await getAllPostIds();
  return posts;
}

const Post = async ({ params }: any) => {
  const { frontmatter, contentHtml } = await getPost(params.id);

  const metaList = Object.keys(frontmatter)
    .map((k) => ({
      label: k,
      value: frontmatter[k],
    }))
    .filter((m) => !["title", "summary"].includes(m.label));

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl mb-6 font-bold text-gray-900">
        {frontmatter.title}
      </h1>
      <div className="flex flex-wrap gap-4 mb-8 text-sm">
        {metaList.map((item) => (
          <span
            key={item.label}
            className="text-gray-600 bg-gray-100 px-3 py-1 rounded"
          >
            <label className="font-medium">{item.label}: </label>
            <span>
              {Array.isArray(item.value) ? item.value.join(", ") : item.value}
            </span>
          </span>
        ))}
      </div>
      <div
        className="mt-4 cl-post prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      <div className="mt-16">
        <Comments />
      </div>
      <ImagePreview />
    </div>
  );
};

export default Post;
