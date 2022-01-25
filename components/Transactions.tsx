import { Box, Table, Td, Tr, Text, Th, Thead, ButtonGroup } from "@chakra-ui/react"
import { Form, Formik } from "formik";
import { InputControl, SubmitButton } from "formik-chakra-ui";
import { useEffect, useState } from "react"
import { TransactionData, Amount, Transaction } from '../lib/nordigen';

const Amount = ({ amount }: { amount: Amount }) => <Text>{amount.amount} {amount.currency}</Text>;

const TransactionLine = ({ transaction, keys }: { transaction: any; keys: string[] }) => {

  return <Tr>
    {keys.map(k => <Td key={k}>{typeof (transaction[k]) == "string" ? transaction[k] : JSON.stringify(transaction[k])}</Td>)}</Tr>
}

export type TransactionsProps = {
  accountId?: string;
  onSelectTransactions: (transactions: Transaction[]) => void;
}

export const Transactions = ({ accountId, onSelectTransactions }: TransactionsProps) => {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null)
  const [error, setError] = useState<string>("")
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (!accountId) {
      setTransactionData(null);
      setError("");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`api/transactions/${accountId}`)
      .then(async (res) => {
        if (res.status != 200) throw new Error(await res.text())
        return res.json()
      })
      .then((data: TransactionData) => {
        setTransactionData(data);
        setLoading(false);
      }).catch((e) => {
        console.log(`Error fetching transactions for ${accountId}`, e)
        setTransactionData(null);
        setError(e);
        setLoading(false);
      });
  }, [accountId])

  if (!accountId) {
    return <Box>No account selected</Box>
  }

  if (isLoading)
    return <Box>Loading...</Box>;

  if (error)
    return <Box>{JSON.stringify(error)}</Box>;

  const bHeadings = new Set<string>();
  transactionData?.booked.forEach((t) => Object.keys(t).forEach((k) => bHeadings.add(k)));
  const bKeys = Array.from(bHeadings.keys());
  const pHeadings = new Set<string>();
  transactionData?.pending.forEach((t) => Object.keys(t).forEach((k) => pHeadings.add(k)));
  const pKeys = Array.from(pHeadings.keys());
  return <>
    <Table size="sm" fontSize="xx-small">
      <Thead>Booked</Thead>
      {transactionData?.booked.map(t => <Tr key={t.transactionId}><Td>{JSON.stringify(t, undefined, 1)}</Td></Tr>)}
    </Table>
    <Table>
      <Thead>Pending</Thead>
      {transactionData?.pending.map((t, i) => <Tr key={i}><Td>{JSON.stringify(t, undefined, 1)}</Td></Tr>)}
    </Table>
    <Formik
      initialValues={{}}
      validate={() => transactionData ? {} : new Error("Must select an account first")}
      onSubmit={(values, actions) => {
        if (transactionData) {
          onSelectTransactions(transactionData.booked);
        }
        actions.setSubmitting(false);
      }}
    >
      {() => (
        <Form>
          <InputControl inputProps={{ type: "date" }} name='ynabToken' label="Personal Access Token" />
          <ButtonGroup><SubmitButton>Submit</SubmitButton></ButtonGroup>
        </Form>
      )}
    </Formik>
  </>

  return <>
    <Table size="sm" fontSize="xx-small">
      <Thead>{bKeys.map(t => <Th key={t}>{t}</Th>)}</Thead>
      {transactionData?.booked.map(t => <TransactionLine key={t.transactionId} transaction={t} keys={bKeys} />)}
    </Table>
    <Table>
      <Thead>{pKeys.map(t => <Th key={t}>{t}</Th>)}</Thead>
      {transactionData?.pending.map((t, i) => <TransactionLine key={i} transaction={t} keys={pKeys} />)}
    </Table>
  </>
}