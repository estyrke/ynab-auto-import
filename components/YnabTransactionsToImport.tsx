import { Button, Table, Tr, Td, Text } from '@chakra-ui/react';
import { YnabTransaction } from '../pages/api/ynab/createTransactions';
import { useCallback, useState } from 'react';

type YnabTransactionsToImportProps = {
  budgetId?: string;
  accountId?: string;
  transactions: YnabTransaction[];
}
export const YnabTransactionsToImport = ({ transactions, budgetId, accountId }: YnabTransactionsToImportProps) => {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const doImport = useCallback(() => {
    setLoading(true);
    fetch(`api/ynab/createTransactions`, {
      headers: { "Content-Type": "application/json" },
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
      {transactions.map((t) => <Tr><Td>{t.date}</Td><Td>{t.payee_name}</Td><Td>{t.memo}</Td><Td>{t.amount}</Td></Tr>)}
    </Table>
    <Button disabled={isLoading || !budgetId || !accountId} onClick={doImport}>{isLoading ? "Importing..." : "Import"}</Button>
  </>;
}