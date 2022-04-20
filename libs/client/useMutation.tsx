import { useState } from "react";
// 제네릭 Type은 api response의 타입이다.
// 이 훅은 POST DELETE 둘 중 하나의 메소드를 받는다.
// const [fetchFn, {data, loading, error}] = useMutation<resType>(url,"METHOD")
interface UseMutationState<Type> {
  loading: boolean;
  data?: Type; // 여기의 Type은 결국 enter page의 EnterMutationResult 이다.
  error?: object;
}
type UseMutationResult<Type> = [(data: any) => void, UseMutationState<Type>];
// 제네릭 <Type>은 결국엔 props 같은것 -> useMutation에서 넘어오는 type.
export default function useMutation<Type = any>(
  url: string,
  method: "POST" | "DELETE"
): UseMutationResult<Type> {
  const [state, setState] = useState<UseMutationState<Type>>({
    loading: false,
    data: undefined,
    error: undefined,
  });
  function mutation(data: any) {
    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json().catch(() => {}))
      .then((data) => setState((prev) => ({ ...prev, data })))
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  }
  return [mutation, { ...state }];
}
