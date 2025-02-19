export interface PostFrontmatter {
    [key: string]: any;
}

export interface PostData {
  id: string;
  frontmatter: PostFrontmatter;
  contentHtml: string;
} 