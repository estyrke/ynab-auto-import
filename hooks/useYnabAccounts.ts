import useSWR from "swr";
import { AccountsResponse } from "ynab";

export const useYnabAccounts = (budget: string) => {
  const { data, error } = useSWR<AccountsResponse>(`api/ynab/budgets/${budget}`);

  return {
    accounts: data?.data?.accounts,
    isLoading: !data && !error,
    error
  }
}