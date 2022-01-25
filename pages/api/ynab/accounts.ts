import { NextApiRequest, NextApiResponse } from 'next';
import { API, SaveTransaction, BudgetSummaryResponse } from 'ynab';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BudgetSummaryResponse>
) {
  const ynab = new API(process.env.YNAB_TOKEN ?? "");

  console.log("Ynab getting budgets", process.env.YNAB_TOKEN)

  res.status(200).json(await ynab.budgets.getBudgets());
}
