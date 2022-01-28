import { Box, Heading, Text } from "@chakra-ui/react";
import { useState } from 'react';
import { YnabTransaction } from "../pages/api/ynab/createTransactions";
import { YnabTransactionsToImport } from "./YnabTransactionsToImport";
import { YnabToken } from "./YnabToken";
import { YnabBudgetList } from "./YnabBudgetList";
import { YnabAccountList } from "./YnabAccountList";

export type YnabProps = {
  transactionsToImport: YnabTransaction[];
  originalTransactions: object[];
}

export const Ynab = (props: YnabProps) => {
  const [token, setToken] = useState("");
  const [budget, setBudget] = useState<string | undefined>(undefined);
  const [account, setAccount] = useState<string | undefined>(undefined);


  return <>
    <Heading as="h1">YNAB Settings</Heading>
    <YnabToken token={token} onChangeToken={setToken} />
    {token ? <YnabBudgetList token={token} onBudgetSelected={setBudget} /> : undefined}
    {budget ? <YnabAccountList token={token} budget={budget} onAccountSelected={setAccount} /> : undefined}
    <Box><Text>{account}</Text></Box>
    <YnabTransactionsToImport token={token} budgetId={budget} accountId={account} transactions={props.transactionsToImport} transactionTooltips={props.originalTransactions.map((t) => JSON.stringify(t, undefined, 1))} />
  </>;

}