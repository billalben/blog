export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (params: { page?: number; page_size?: number }) =>
    [...blogKeys.lists(), params] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (slug: string) => [...blogKeys.details(), slug] as const,
  user: (userId: string) => [...blogKeys.all, "user", userId] as const,
  userList: (userId: string, params: { page?: number; page_size?: number }) =>
    [...blogKeys.user(userId), params] as const,
};
