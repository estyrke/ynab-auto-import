import { NextApiRequest, NextApiResponse } from 'next';
import { API, BudgetSummaryResponse } from 'ynab';
import { ApiError } from '../../../lib/api.error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BudgetSummaryResponse | ApiError>
) {
  const ynab = new API(req.headers.authorization?.split(" ")[1] ?? "");

  console.log("Ynab getting budgets", req.headers.authorization?.split(" ")[1])

  try {
    const budgets = await ynab.budgets.getBudgets();
    res.status(200).json(budgets);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
