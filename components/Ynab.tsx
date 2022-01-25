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
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [budgets, setBudgets] = useState<BudgetSummaryResponse | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    fetch(`api/ynab/budgets`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        setLoading(false);
        if (res.status != 200) throw new Error(await res.text())
        return res.json()
      }).then(setBudgets).catch((e) => {
        console.log("Error fetching budgets", e)
        setError(e);
      });
  }, [token]);


  return <Select onChange={(e) => {
    console.log("Selected budget", e.currentTarget.value);
    return onBudgetSelected(e.currentTarget.value);
  }}>
    <option value="">{isLoading ? "--- Loading ... ---" : "--- Select a budget ---"}</option>
    {budgets?.data.budgets.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
  </Select>
}

type YnabAccountListProps = {
  budget?: string;
  token?: string;
  onAccountSelected: (accountId: string | undefined) => void;
};

const YnabAccountList = ({ budget, token, onAccountSelected }: YnabAccountListProps) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [accounts, setAccounts] = useState<AccountsResponse | undefined>(undefined);

  useEffect(() => {
    if (!budget) return;
    setLoading(true);
    fetch(`api/ynab/budgets/${budget}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        setLoading(false);
        if (res.status != 200) throw new Error(await res.text())
        return res.json()
      }).then(setAccounts).catch(e => {
        console.log("Error fetching accounts", e);
        setError(e);
      });
  }, [budget, token]);

  return <Select onChange={(e) => {
    console.log("Selected account", e.currentTarget.value);
    return onAccountSelected(e.currentTarget.value);
  }}>
    <option value="">{isLoading ? "--- Loading ... ---" : "--- Select an account ---"}</option>
    {accounts?.data.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
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
    <YnabBudgetList token={token} onBudgetSelected={setBudget} />
    <YnabAccountList token={token} budget={budget} onAccountSelected={setAccount} />
    <Box><Text>{account}</Text></Box>
    <YnabTransactionsToImport token={token} budgetId={budget} accountId={account} transactions={props.transactionsToImport} />
  </>;

}