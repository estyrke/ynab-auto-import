import { Select } from "@chakra-ui/react";
import { useYnabBudgets } from "../hooks/useYnabBudgets";

type YnabBudgetListProps = {
  onBudgetSelected: (budgetId: string) => void;
};
export const YnabBudgetList = ({ onBudgetSelected }: YnabBudgetListProps) => {
  const { budgets, error } = useYnabBudgets();

  console.log(budgets, error);
  let defaultText = "--- default ---";
  if (error)
    defaultText = `--- ${JSON.stringify(error.info)} ---`;
  else if (!budgets)
    defaultText = "--- Loading ... ---";

  return <Select onChange={(e) => {
    console.log("Selected budget", e.currentTarget.value);
    return onBudgetSelected(e.currentTarget.value);
  }}>
    <option value="default">{defaultText}</option>
    {budgets?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
  </Select>;
};
