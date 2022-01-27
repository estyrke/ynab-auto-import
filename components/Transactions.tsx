import { Box, Table, Td, Tr, Th, Thead, ButtonGroup, Tbody } from "@chakra-ui/react"
import { Form, Formik } from "formik";
import { InputControl, SubmitButton } from "formik-chakra-ui";
import { useTransactions } from "../hooks/useTransactions";
import { Transaction } from '../lib/nordigen';

const TransactionLine = ({ transaction, keys }: { transaction: any; keys: string[] }) => {

  return <Tr>
    {keys.map(k => <Td key={k}>{typeof (transaction[k]) == "string" ? transaction[k] : JSON.stringify(transaction[k])}</Td>)}</Tr>
}

export type TransactionsProps = {
  accountId: string;
  onSelectTransactions: (transactions: Transaction[]) => void;
}

export const Transactions = ({ accountId, onSelectTransactions }: TransactionsProps) => {
  const { transactions, error } = useTransactions(accountId);

  if (error)
    return <Box>{JSON.stringify(error)}</Box>;

  if (!transactions)
    return <Box>Loading...</Box>;

  const bHeadings = new Set<string>();
  transactions.booked.forEach((t) => Object.keys(t).forEach((k) => bHeadings.add(k)));
  const bKeys = Array.from(bHeadings.keys());
  const pHeadings = new Set<string>();
  transactions.pending.forEach((t) => Object.keys(t).forEach((k) => pHeadings.add(k)));
  const pKeys = Array.from(pHeadings.keys());
  return <>
    <Table size="sm" fontSize="xx-small">
      <Thead><Tr><Th>Booked</Th></Tr></Thead>
      <Tbody>
        {transactions.booked.map(t => <Tr key={t.transactionId}><Td>{JSON.stringify(t, undefined, 1)}</Td></Tr>)}
      </Tbody>
    </Table>
    <Table>
      <Thead><Tr><Th>Pending</Th></Tr></Thead>
      <Tbody>
        {transactions.pending.map((t, i) => <Tr key={i}><Td>{JSON.stringify(t, undefined, 1)}</Td></Tr>)}
      </Tbody>
    </Table>
    <Formik
      initialValues={{}}
      onSubmit={(values, actions) => {
        onSelectTransactions(transactions.booked);
        actions.setSubmitting(false);
      }}
    >
      {() => (
        <Form>
          <InputControl inputProps={{ type: "date" }} name='ynabToken' label="Start Date" />
          <ButtonGroup><SubmitButton>Submit</SubmitButton></ButtonGroup>
        </Form>
      )}
    </Formik>
  </>

  return <>
    <Table size="sm" fontSize="xx-small">
      <Thead>{bKeys.map(t => <Th key={t}>{t}</Th>)}</Thead>
      {transactions?.booked.map(t => <TransactionLine key={t.transactionId} transaction={t} keys={bKeys} />)}
    </Table>
    <Table>
      <Thead>{pKeys.map(t => <Th key={t}>{t}</Th>)}</Thead>
      {transactions?.pending.map((t, i) => <TransactionLine key={i} transaction={t} keys={pKeys} />)}
    </Table>
  </>
}