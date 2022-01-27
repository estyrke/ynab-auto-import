import { requireSession, WithSessionProp } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { API, SaveTransaction } from 'ynab';
import { ApiError } from '../../../lib/api.error';

export type YnabTransaction = {
  date: string;
  amount: number;
  payee_name?: string | null;
  memo?: string | null;
  import_id: string;
}

export default requireSession(async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse<void | ApiError>
) => {
  const body = req.body;
  const transactions: YnabTransaction[] = body.transactions;
  const budgetId = body.budgetId;
  const accountId = body.accountId;

  if (!budgetId) {
    res.status(400).json({ error: "Missing budgetId" });
    return;
  }

  if (!accountId) {
    res.status(400).json({ error: "Missing accountId" });
    return;
  }

  if (transactions.some((t) => !t.amount || !t.date || !t.import_id)) {
    res.status(400).json({ error: "Invalid transactions!" });
    return;
  }

  const ynab = new API(req.headers.token?.toString() ?? "");

  try {
    await ynab.transactions.createTransactions(budgetId, {
      transactions: transactions.map((t) => ({
        ...t,
        account_id: accountId,
        cleared: SaveTransaction.ClearedEnum.Cleared
      }))
    });

    res.status(200).end();
  } catch (e) {
    res.status(400).json({ error: e });

  }
});