import type { NextPage } from 'next'
import { useCallback, useState } from 'react'
import { Transaction } from '../lib/nordigen';
import { VStack } from '@chakra-ui/react';
import { Nordigen } from '../components/Nordigen';
import { Ynab } from '../components/Ynab';
import { YnabTransaction } from './api/ynab/createTransactions';
import { transforms } from '../lib/transaction.transform';
import { SiteContainer } from '../components/SiteContainer';


const Import: NextPage = () => {
  const [originalTransactions, setOriginalTransactions] = useState<Transaction[]>([]);
  const [transactions, setTransactions] = useState<YnabTransaction[]>([]);
  const [institutionId, setInstitutionId] = useState<string | undefined>(undefined);

  const onSelectTransactions = useCallback((institutionId: string, accountId: string, selectedTransactions: Transaction[]) => {
    console.log(`Selected ${selectedTransactions.length} transactions from ${institutionId}`)
    setOriginalTransactions(selectedTransactions);
    if (institutionId) {
      setTransactions(selectedTransactions.map((t) => transforms[institutionId](t)));
    } else {
      setTransactions([]);
    }
  }, [])

  return (<SiteContainer>
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start" >
      <Nordigen onSelectTransactions={onSelectTransactions} />
    </VStack>
    <VStack VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start" >
      <Ynab transactionsToImport={transactions} originalTransactions={originalTransactions} />
    </VStack>
  </SiteContainer>);
}

export default Import;
