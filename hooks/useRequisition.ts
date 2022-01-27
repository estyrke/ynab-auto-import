import useSWR from "swr"
import { ApiError } from "../lib/api.error";
import { RequisitionData } from "../lib/nordigen";


export const useRequisition = () => {
  const { data, error, mutate } = useSWR<RequisitionData, ApiError>("api/requisition");

  return {
    requisition: data,
    isLoading: !error && !data,
    error,
    mutate
  }
}