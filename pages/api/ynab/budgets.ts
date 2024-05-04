import { requireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextApiRequest, NextApiResponse } from 'next';
import { BudgetSummaryResponse } from 'ynab';
import { ApiError } from '../../../lib/api.error';
import { withYnabApi } from '../../../lib/ynab';

export default requireAuth(withYnabApi(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse<BudgetSummaryResponse | ApiError>,
  ynab
) => {
  try {
    const budgets = await ynab.budgets.getBudgets();
    res.status(200).json(budgets);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}));
