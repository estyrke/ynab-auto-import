import { NextApiRequest, NextApiResponse } from 'next';
import { API, SaveTransaction, BudgetSummaryResponse } from 'ynab';

export type YnabTransaction = {
  date: string;
  amount: number;
  payee_name?: string | null;
  memo?: string | null;
  import_id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const body = req.body;
  const transactions: YnabTransaction[] = body.transactions;
  const budgetId = body.budgetId;
  const accountId = body.accountId;

  if (!budgetId) {
    res.status(400).end("Missing budgetId");
    return;
  }

  if (!accountId) {
    res.status(400).end("Missing accountId");
    return;
  }

  if (transactions.some((t) => !t.amount || !t.date || !t.import_id)) {
    res.status(400).end("Invalid transactions!");
    return;
  }

  const ynab = new API(process.env.YNAB_TOKEN ?? "");

  await ynab.transactions.createTransactions(budgetId, {
    transactions: transactions.map((t) => ({
      ...t,
      account_id: accountId,
      cleared: SaveTransaction.ClearedEnum.Cleared
    }))
  });

  res.status(200).end();
}