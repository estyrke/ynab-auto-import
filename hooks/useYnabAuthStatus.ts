import useSWR from "swr";
import { AuthorizationStatus } from '../pages/api/ynab/authorizationStatus';

export const useYnabAuthStatus = () => {
  const { data, error } = useSWR<AuthorizationStatus>(`api/ynab/authorizationStatus`);

  return {
    status: data,
    isLoading: !data && !error,
    error
  }
}