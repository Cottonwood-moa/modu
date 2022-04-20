import { User } from "@prisma/client";
import useSWR from "swr";

interface UserResponse {
  ok: boolean;
  user: User;
}

export default function useUser() {
  const { data, error, mutate } = useSWR<UserResponse>("/api/user/session");
  return { user: data?.user, isLoading: !data && !error, mutate };
}
