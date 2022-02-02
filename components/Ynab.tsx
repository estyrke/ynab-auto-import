import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useState } from 'react';
import { YnabTransaction } from "../pages/api/ynab/createTransactions";
import { YnabTransactionsToImport } from "./YnabTransactionsToImport";
import { YnabBudgetList } from "./YnabBudgetList";
import { YnabAccountList } from "./YnabAccountList";
import { useYnabAuthStatus } from "../hooks/useYnabAuthStatus";

export type YnabProps = {
  transactionsToImport: YnabTransaction[];
  originalTransactions: object[];
}

export const Ynab = (props: YnabProps) => {
  const [budget, setBudget] = useState<string | undefined>("default");
  const [account, setAccount] = useState<string | undefined>(undefined);
  const { status, error } = useYnabAuthStatus();

  return <>
    <Heading as="h1">YNAB Settings</Heading>
    {status?.valid_token ? <Text>Authorized</Text> : <Button onClick={() =>
      window.location.href = `https://app.youneedabudget.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_YNAB_CLIENT_ID}&redirect_uri=${window.location.origin}/api/ynab/authorize&response_type=code`
    } enabled={status?.valid_token === false}>Authorize</Button>}
    <YnabBudgetList onBudgetSelected={setBudget} />
    {budget ? <YnabAccountList budget={budget} onAccountSelected={setAccount} /> : undefined}
    <Box><Text>{account}</Text></Box>
    <YnabTransactionsToImport budgetId={budget} accountId={account} transactions={props.transactionsToImport} transactionTooltips={props.originalTransactions.map((t) => JSON.stringify(t, undefined, 1))} />
  </>;

}