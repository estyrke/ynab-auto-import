import { Box, Heading } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from 'react';
import { Transaction } from "../lib/nordigen";
import { Accounts } from "./Accounts";
import { Requisition } from "./Requisition";
import { Transactions } from "./Transactions";
import { useRequisition } from '../hooks/useRequisition';


export type NordigenProps = {
  onInstitutionChanged: (institutionId: string | undefined) => void;
  onSelectTransactions: (transactions: Transaction[]) => void;
};

export const Nordigen = ({ onInstitutionChanged, onSelectTransactions }: NordigenProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();
  const { requisition } = useRequisition();
  const institutionId = requisition?.institution_id;

  useEffect(() => {
    onInstitutionChanged(institutionId);
  }, [institutionId, onInstitutionChanged]);

  const onSelectAccount = useCallback((id: string | undefined) => {
    setSelectedAccount(id);
  }, [setSelectedAccount]);

  return <>
    <Heading as="h1">Bank settings</Heading>
    <Requisition />
    <Accounts onSelectAccount={onSelectAccount} selectedAccount={selectedAccount} />
    {selectedAccount
      ? <Transactions accountId={selectedAccount} onSelectTransactions={onSelectTransactions} />
      : <Box>No account selected</Box>}
  </>;
}