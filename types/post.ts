export interface PostFrontmatter {
  title: string;
  date: string;
  summary: string;
  categories?: string[];
}

export interface PostData {
  id: string;
  frontmatter: PostFrontmatter;
  content: string;
} 