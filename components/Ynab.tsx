import { Box, ButtonGroup, Heading, Select, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState } from 'react';
import { InputControl, SubmitButton } from 'formik-chakra-ui';
import { YnabTransaction } from "../pages/api/ynab/createTransactions";
import { YnabTransactionsToImport } from "./YnabTransactionsToImport";
import { useYnabBudgets } from "../hooks/useYnabBudgets";
import { useYnabAccounts } from '../hooks/useYnabAccounts';

type YnabTokenProps = {
  token: string;
  onChangeToken: (token: string) => void;
};

const YnabToken = (props: YnabTokenProps) => <Formik
  initialValues={{ ynabToken: props.token }}
  onSubmit={(values, actions) => {
    props.onChangeToken(values.ynabToken);
    actions.setSubmitting(false);
  }}
>
  {() => (
    <Form>
      <InputControl name='ynabToken' label="Personal Access Token" />
      <ButtonGroup><SubmitButton>Submit</SubmitButton></ButtonGroup>
    </Form>
  )}
</Formik>

type YnabBudgetListProps = {
  token?: string;
  onBudgetSelected: (budgetId: string) => void;
};

const YnabBudgetList = ({ token, onBudgetSelected }: YnabBudgetListProps) => {
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
  </Select>
}

type YnabAccountListProps = {
  budget: string;
  token?: string;
  onAccountSelected: (accountId: string | undefined) => void;
};

const YnabAccountList = ({ budget, token, onAccountSelected }: YnabAccountListProps) => {
  const { accounts, error, isLoading } = useYnabAccounts(budget, token);

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
  </Select>
}

export type YnabProps = {
  transactionsToImport: YnabTransaction[];
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
    <YnabTransactionsToImport token={token} budgetId={budget} accountId={account} transactions={props.transactionsToImport} />
  </>;

}