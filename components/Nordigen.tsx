import { Heading } from "@chakra-ui/react";
import { useCallback, useState } from 'react';
import { Transaction } from "../lib/nordigen";
import { Accounts } from "./Accounts";
import { Requisition } from "./Requisition";
import { Transactions } from "./Transactions";


export type NordigenProps = {
  onInstitutionChanged: (institutionId: string | undefined) => void;
  onSelectTransactions: (transactions: Transaction[]) => void;
};

export const Nordigen = (props: NordigenProps) => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");

  const onAccountsChanged = useCallback((accountIds: string[]) => {
    console.log("Got accounts", accountIds);
    return setAccounts(accountIds);
  }, [setAccounts]);
  const onSelectAccount = useCallback((id: string) => {
    setSelectedAccount(id);
  }, [setSelectedAccount]);

  return <>
    <Heading as="h1">Bank settings</Heading>
    <Requisition onInstitutionChanged={props.onInstitutionChanged} onAccountsChanged={onAccountsChanged} />
    <Accounts accountIds={accounts} onSelectAccount={onSelectAccount} selectedAccount={selectedAccount} />
    <Transactions accountId={selectedAccount} onSelectTransactions={props.onSelectTransactions} />
  </>;
}