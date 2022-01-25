import { Box, List, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
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
  onSelectAccount: (id: string) => void;
  selectedAccount: string;
};

export const Accounts = (props: AccountsProps) => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails[]>([])
  const [error, setError] = useState<string>("")
  const [isLoading, setLoading] = useState(false)
  const accounts = useMemo(() => props.accountIds, [props.accountIds]);

  useEffect(() => {
    setLoading(true);
    Promise.all(accounts.map(id =>
      fetch(`api/accounts/${id}`)
        .then(async (res) => {
          if (res.status != 200) throw new Error(await res.text())
          return res.json()
        })))
      .then((data: AccountDetails[]) => {
        setAccountDetails(data);
        setLoading(false);
      }).catch((e) => {
        console.log("Error fetching accounts", e)
        setAccountDetails([]);
        setError(e);
        setLoading(false);
      });
  }, [accounts])

  if (isLoading)
    return <Box>Loading...</Box>;

  if (error)
    return <Box>{JSON.stringify(error)}</Box>;

  return <Box>
    <Text>Accounts</Text>
    <List>{accountDetails.map(d =>
      <AccountSummary key={d.id} id={d.id} name={d.name} type={d.bban} onSelect={(id) => props.onSelectAccount(id)} selected={props.selectedAccount == d.id} />)}
    </List>
  </Box>
}