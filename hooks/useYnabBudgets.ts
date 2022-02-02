import useSWR from "swr";
import { BudgetSummaryResponse } from "ynab";
import { FetchError } from "../lib/fetcher";


export const useYnabBudgets = () => {
  const { data, error } = useSWR<BudgetSummaryResponse, FetchError>("api/ynab/budgets");

  return { budgets: data?.data?.budgets, error }
}