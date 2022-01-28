import { Select } from "@chakra-ui/react";
import { useYnabBudgets } from "../hooks/useYnabBudgets";

type YnabBudgetListProps = {
  token?: string;
  onBudgetSelected: (budgetId: string) => void;
};
export const YnabBudgetList = ({ token, onBudgetSelected }: YnabBudgetListProps) => {
  const { budgets, error } = useYnabBudgets(token);

  console.log(budgets, error);
  let defaultText = "--- Select a budget ---";
  if (error)
    defaultText = `--- ${JSON.stringify(error.info)} ---`;
  else if (!budgets)
    defaultText = "--- Loading ... ---";

  return <Select onChange={(e) => {
    console.log("Selected budget", e.currentTarget.value);
    return onBudgetSelected(e.currentTarget.value);
  }}>
    <option value="">{defaultText}</option>
    {budgets?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
  </Select>;
};
