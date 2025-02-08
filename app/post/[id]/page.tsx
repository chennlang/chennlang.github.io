import { getAllPostIds, getPost } from "@/utils/post";
import Comments from "@/components/comments";

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
    .filter((m) => !["title"].includes(m.label));
  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold">{frontmatter.title}</h1>
      <p className="flex flex-wrap">
        {metaList.map((item) => (
          <span key={item.label} className="text-gray-600 mr-4">
            <label>{item.label}: </label> {item.value}
          </span>
        ))}
      </p>
      <div className="mt-4" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <div className="mt-10">
        <Comments />
      </div>
    </div>
  );
};

export default Post;
