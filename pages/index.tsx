import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { RequisitionData, AccountDetails, Transaction } from '../lib/nordigen';
import styles from '../styles/Home.module.css'
import { Requisition } from '../components/Requisition';
import { Accounts } from '../components/Accounts'
import { Button, Container, Flex, Select, VStack } from '@chakra-ui/react';
import { Nordigen } from '../components/Nordigen';
import { Ynab } from '../components/Ynab';
import { YnabTransaction } from './api/ynab/createTransactions';
import { transforms } from '../lib/transaction.transform';

type TokenResponse = {
  "access": string,
  "access_expires": number,
  "refresh": string,
  "refresh_expires": number
};


const Home: NextPage = () => {
  const [transactions, setTransactions] = useState<YnabTransaction[]>([]);
  const [institutionId, setInstitutionId] = useState<string | undefined>(undefined);

  const onSelectTransactions = useCallback((selectedTransactions: Transaction[]) => {
    console.log(`Selected ${selectedTransactions.length} transactions from ${institutionId}`)
    if (institutionId) {
      setTransactions(selectedTransactions.map((t) => transforms[institutionId](t)));
    } else {
      setTransactions([]);
    }
  }, [setTransactions, institutionId])

  return (<Container maxW="container.xl">
    <Head>
      <title>Danske Bank (SE) to YNAB</title>
      <meta name="description" content="A tool to auto-import transactions from Danske Bank (SV) into YNAB" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Flex>
      <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start"><Nordigen onInstitutionChanged={setInstitutionId} onSelectTransactions={onSelectTransactions} />
      </VStack>
      <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start"><Ynab transactionsToImport={transactions} /></VStack>
    </Flex>
  </Container>
  );
}

export default Home
