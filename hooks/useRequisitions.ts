import useSWR from "swr"
import { ApiError } from "../lib/api.error";

export const useRequisitions = () => {
  const { data, error } = useSWR<string[], ApiError>(`api/requisitions`);

  return {
    requisitionIds: data,
    isLoading: !error && !data,
    error,
  }
}