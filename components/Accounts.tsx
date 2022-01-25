import { Box, List, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AccountDetails } from '../lib/nordigen';

type AccountSummaryProps = {
  id: string;
  name: string;
  type: string;
  selected: boolean;
  onSelect: (id: string) => void;
}
const AccountSummary = (props: AccountSummaryProps) => <ListItem bg={props.selected ? "gray.200" : "default"} onClick={() => props.onSelect(props.id)}>{props.name} ({props.type})</ListItem>;

export type AccountsProps = {
  accountIds: string[];
  onSelectAccount: (id: string | undefined) => void;
  selectedAccount: string | undefined;
};

export const Accounts = ({ onSelectAccount, accountIds, selectedAccount }: AccountsProps) => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails[]>([])
  const [error, setError] = useState<string>("")
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);
    Promise.all(accountIds.map(id =>
      fetch(`api/accounts/${id}`)
        .then(async (res) => {
          onSelectAccount(undefined);
          if (res.status != 200) throw new Error(await res.text())
          return res.json()
        })))
      .then((data: AccountDetails[]) => {
        setLoading(false);
        setAccountDetails(data);
      }).catch((e) => {
        setLoading(false);
        console.log("Error fetching accounts", e)
        setAccountDetails([]);
        setError(e);
      });
  }, [accountIds, onSelectAccount])

  if (isLoading)
    return <Box>Loading...</Box>;

  if (error)
    return <Box>{JSON.stringify(error)}</Box>;

  return <Box>
    <Text>Accounts</Text>
    <List>{accountDetails.map(d =>
      <AccountSummary key={d.id} id={d.id} name={d.name} type={d.bban} onSelect={(id) => onSelectAccount(id)} selected={selectedAccount == d.id} />)}
    </List>
  </Box>
}