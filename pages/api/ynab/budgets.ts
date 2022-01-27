import { requireSession, WithSessionProp } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { API, BudgetSummaryResponse } from 'ynab';
import { ApiError } from '../../../lib/api.error';

export default requireSession(async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse<BudgetSummaryResponse | ApiError>
) => {
  const ynab = new API(req.headers.token?.toString() ?? "");

  console.log("Ynab getting budgets", req.headers.token)

  try {
    const budgets = await ynab.budgets.getBudgets();
    res.status(200).json(budgets);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});
