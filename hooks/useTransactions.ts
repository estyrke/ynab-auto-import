import useSWR from "swr"
import { FetchError } from "../lib/fetcher";
import { TransactionData } from "../lib/nordigen";

export const useTransactions = (accountId: string) => {
  const { data, error } = useSWR<TransactionData, FetchError>(`api/transactions/${accountId}`);

  return { transactions: data, error };
}