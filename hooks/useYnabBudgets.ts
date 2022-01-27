import useSWR from "swr";
import { BudgetSummaryResponse } from "ynab";
import { FetchError } from "../lib/fetcher";


export const useYnabBudgets = (token?: string) => {
  const init = token ? { headers: { token } } : undefined;
  const { data, error } = useSWR<BudgetSummaryResponse, FetchError, [string, RequestInit?]>(["api/ynab/budgets", init]);

  return { budgets: data?.data?.budgets, error }
}