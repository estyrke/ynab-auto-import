import useSWR, { mutate } from "swr"
import { ApiError } from "../lib/api.error";

export const useRequisitions = () => {
  const { data, error, mutate } = useSWR<string[], ApiError>(`api/requisitions`);

  return {
    requisitionIds: data,
    setRequisitionIds: mutate,
    isLoading: !error && !data,
    error,
  }
}