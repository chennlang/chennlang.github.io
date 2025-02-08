import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

// 获取文章ID列表
export async function getAllPostIds(): Promise<{ id: string }[]> {
    // 读取 posts 目录下的所有文件
    const fileNames = await fs.readdir(postsDirectory);
  
    // 过滤出 .md 文件，并生成路径参数
    return fileNames
      .filter((fileName) => fileName.endsWith(".md")) // 只处理 .md 文件
      .map((fileName) => ({
        id: fileName.replace(/\.md$/, ""), // 去掉 .md 后缀
      }));
  }


// 获取文章内容
export async function getPost(id: string) {
    const markdownWithMeta = await fs.readFile(
    path.join("posts", id + ".md"),
    "utf-8"
    );
    const { data: frontmatter, content } = matter(markdownWithMeta);

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        frontmatter,
    }
}

// 获取所有文章列表+内容
export async function getAllPostList() {
    const ids = await getAllPostIds()
    const list  = await Promise.all(ids.map(m => getPost((m.id))))
    return list.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
}