import useSWR from "swr"
import { ApiError } from "../lib/api.error";
import { AccountDetails } from '../lib/nordigen';


export const useAccount = (id: string) => {
  const { data, error } = useSWR<AccountDetails, ApiError>(`api/accounts/${id}`);

  return {
    account: data,
    isLoading: !error && !data,
    error
  }
}