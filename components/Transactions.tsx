import { Box, Table, Td, Tr, Th, Thead, ButtonGroup, Tbody, Text } from "@chakra-ui/react"
import { Form, Formik } from "formik";
import { SubmitButton } from "formik-chakra-ui";
import { useTransactions } from "../hooks/useTransactions";
import { Transaction } from '../lib/nordigen';

const TransactionLine = ({ transaction, keys }: { transaction: any; keys: string[] }) => {

  return <Tr>
    {keys.map(k => <Td key={k}>{typeof (transaction[k]) == "string" ? transaction[k] : JSON.stringify(transaction[k], undefined, 1)}</Td>)}</Tr>
}

export interface TransactionsProps {
  accountId: string;
  onSelectTransactions: (transactions: Transaction[]) => void;
  fullTable?: boolean;
}

export const Transactions = ({ fullTable = false, accountId, onSelectTransactions }: TransactionsProps) => {
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

  let table;

  if (fullTable) {
    table = <>
      <Table size="sm" fontSize="xx-small">
        <Thead>{bKeys.map(t => <Th key={t}>{t}</Th>)}</Thead>
        <Tbody>
          {transactions?.booked.map(t => <TransactionLine key={t.transactionId} transaction={t} keys={bKeys} />)}
        </Tbody>
      </Table>
      <Table>
        <Thead>{pKeys.map(t => <Th key={t}>{t}</Th>)}</Thead>
        <Tbody>
          {transactions?.pending.map((t, i) => <TransactionLine key={i} transaction={t} keys={pKeys} />)}
        </Tbody>
      </Table>
    </>
  } else {
    table = <>
      <Text>{transactions.booked.length} transactions to import</Text>
    </>
  }
  return <>
    {table}
    <Formik
      initialValues={{}}
      onSubmit={(values, actions) => {
        onSelectTransactions(transactions.booked);
        actions.setSubmitting(false);
      }}
    >
      {() => (
        <Form>
          <ButtonGroup><SubmitButton>Select for import</SubmitButton></ButtonGroup>
        </Form>
      )}
    </Formik>
  </>
}