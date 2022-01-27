import { Box, List, ListItem, Text } from "@chakra-ui/react";
import { useAccount } from "../hooks/useAccount";
import { useRequisition } from "../hooks/useRequisition";

type AccountSummaryProps = {
  id: string;
  selected: boolean;
  onSelect: (id: string) => void;
}
const AccountSummary = (props: AccountSummaryProps) => {
  const { account, error } = useAccount(props.id);

  if (error) {
    return <ListItem bg={props.selected ? "gray.200" : "default"} onClick={() => props.onSelect(props.id)}>Error: {JSON.stringify(error)}</ListItem>;
  }
  else if (!account) {
    return <ListItem bg={props.selected ? "gray.200" : "default"} onClick={() => props.onSelect(props.id)}>Loading...</ListItem>;
  }

  return <ListItem bg={props.selected ? "gray.200" : "default"} onClick={() => props.onSelect(props.id)}>{account.name} ({account.product})</ListItem>;
};

export type AccountsProps = {
  onSelectAccount: (id: string | undefined) => void;
  selectedAccount: string | undefined;
};

export const Accounts = ({ onSelectAccount, selectedAccount }: AccountsProps) => {
  const { requisition, error } = useRequisition();

  if (error)
    return <Box>Failed to fetch account list!</Box>;

  if (!requisition)
    return <Box>Loading...</Box>;


  return <Box>
    <Text>Accounts</Text>
    <List>{requisition.accounts.map(accountId =>
      <AccountSummary key={accountId} id={accountId} onSelect={(id) => onSelectAccount(id)} selected={selectedAccount == accountId} />)}
    </List>
  </Box>
}