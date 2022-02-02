import { Select } from "@chakra-ui/react";
import { useYnabAccounts } from '../hooks/useYnabAccounts';

type YnabAccountListProps = {
  budget: string;
  onAccountSelected: (accountId: string | undefined) => void;
};
export const YnabAccountList = ({ budget, onAccountSelected }: YnabAccountListProps) => {
  const { accounts, error, isLoading } = useYnabAccounts(budget);

  let defaultText = "--- Select an account ---";
  if (error)
    defaultText = `--- ${JSON.stringify(error.info)} ---`;
  else if (isLoading)
    defaultText = "--- Loading ... ---";

  return <Select onChange={(e) => {
    console.log("Selected account", e.currentTarget.value);
    return onAccountSelected(e.currentTarget.value);
  }}>
    <option value="">{defaultText}</option>
    {accounts?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
  </Select>;
};
