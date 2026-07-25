export const commentKeys = {
  all: ["comments"] as const,
  byBlog: (blogId: string) => [...commentKeys.all, "blog", blogId] as const,
};
