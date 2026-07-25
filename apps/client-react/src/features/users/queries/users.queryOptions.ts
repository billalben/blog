import { queryOptions } from "@tanstack/react-query";
import { usersApi } from "@/features/users/api/users.api";
import { userKeys } from "@/features/users/queries/users.keys";

export const allUsersQueryOptions = (params: {
  page?: number;
  page_size?: number;
}) =>
  queryOptions({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const { data } = await usersApi.getAllUsers(params);
      return data;
    },
  });
