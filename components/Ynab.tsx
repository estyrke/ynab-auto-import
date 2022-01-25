import { Box, ButtonGroup, Heading, Select, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState, useEffect } from 'react';
import { InputControl, SubmitButton } from 'formik-chakra-ui';
import { AccountsResponse, BudgetSummaryResponse, AccountResponse } from 'ynab';
import { YnabTransaction } from "../pages/api/ynab/createTransactions";
import { YnabTransactionsToImport } from "./YnabTransactionsToImport";

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
  {(props) => (
    <Form>
      <InputControl name='ynabToken' label="Personal Access Token" />
      <ButtonGroup><SubmitButton>Submit</SubmitButton></ButtonGroup>
    </Form>
  )}
</Formik>

type YnabBudgetListProps = {
  budgets?: BudgetSummaryResponse;
  selectedBudget?: string;
  onBudgetSelected: (budgetId: string) => void;
};

const YnabBudgetList = (props: YnabBudgetListProps) => {
  return <Select value={props.selectedBudget} onChange={(e) => {
    console.log("Selected budget", e.currentTarget.value);
    return props.onBudgetSelected(e.currentTarget.value);
  }}>
    <option>--- Select a budget ---</option>
    {props.budgets?.data.budgets.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
  </Select>
}

type YnabAccountListProps = {
  accounts?: AccountsResponse;
  selectedAccount?: string;
  onAccountSelected: (accountId: string) => void;
};

const YnabAccountList = (props: YnabAccountListProps) => {
  return <Select value={props.selectedAccount ?? "x"} onChange={(e) => {
    console.log("Selected account", e.currentTarget.value);
    return props.onAccountSelected(e.currentTarget.value);
  }}>
    <option value="x">--- Select an account ---</option>
    {props.accounts?.data.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
  </Select>
}

export type YnabProps = {
  transactionsToImport: YnabTransaction[];
}
export const Ynab = (props: YnabProps) => {
  const [isLoading, setLoading] = useState(false)
  const [token, setToken] = useState("");
  const [budgets, setBudgets] = useState<BudgetSummaryResponse | undefined>(undefined);
  const [budget, setBudget] = useState<string | undefined>(undefined);
  const [accounts, setAccounts] = useState<AccountsResponse | undefined>(undefined);
  const [account, setAccount] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    fetch(`api/ynab/budgets`)
      .then(async (res) => {
        if (res.status != 200) throw new Error(await res.text())
        return res.json()
      }).then(setBudgets);
  }, [token]);

  useEffect(() => {
    if (!budget) return;
    setLoading(true);
    fetch(`api/ynab/budgets/${budget}`)
      .then(async (res) => {
        if (res.status != 200) throw new Error(await res.text())
        return res.json()
      }).then(setAccounts);
  }, [budget]);

  return <>
    <Heading as="h1">YNAB Settings</Heading>
    <YnabToken token={token} onChangeToken={setToken} />
    <YnabBudgetList budgets={budgets} selectedBudget={budget} onBudgetSelected={setBudget} />
    <YnabAccountList accounts={accounts} selectedAccount={account} onAccountSelected={setAccount} />
    <Box><Text>{account}</Text></Box>
    <YnabTransactionsToImport budgetId={budget} accountId={account} transactions={props.transactionsToImport} />
  </>;

}