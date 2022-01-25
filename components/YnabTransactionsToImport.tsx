import { Button, Table, Tr, Td, Text, Tbody, Thead, Th } from '@chakra-ui/react';
import { YnabTransaction } from '../pages/api/ynab/createTransactions';
import { useCallback, useState } from 'react';

type YnabTransactionsToImportProps = {
  token?: string;
  budgetId?: string;
  accountId?: string;
  transactions: YnabTransaction[];
}
export const YnabTransactionsToImport = ({ token, transactions, budgetId, accountId }: YnabTransactionsToImportProps) => {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const doImport = useCallback(() => {
    setLoading(true);
    fetch(`api/ynab/createTransactions`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      method: "POST",
      body: JSON.stringify({ budgetId, accountId, transactions })
    })
      .then(async (res) => {
        setLoading(false);
        if (res.status != 200) throw new Error(await res.text())
      }).catch((e) => {
        console.log(`Error importing to account ${accountId} of budget ${budgetId}`, e)
        setError(e);
      });
  }, [budgetId, accountId, transactions])

  if (!transactions)
    return <Text>Select some transactions to import...</Text>

  return <>
    <Table>
      <Thead>
        <Tr><Th>Date</Th><Th>Payee</Th><Th>Memo</Th><Th>Amount</Th></Tr>
      </Thead>
      <Tbody>
        {transactions.map((t) => <Tr key={t.import_id}><Td>{t.date}</Td><Td>{t.payee_name}</Td><Td>{t.memo}</Td><Td>{t.amount}</Td></Tr>)}
      </Tbody>
    </Table>
    <Button disabled={isLoading || !budgetId || !accountId} onClick={doImport}>{isLoading ? "Importing..." : "Import"}</Button>
  </>;
}