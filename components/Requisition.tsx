import { Box, Button, Image, Tooltip, HStack, Spacer, AccordionItem, AccordionButton, AccordionPanel, Text } from '@chakra-ui/react';
import { useCallback, useState } from "react";
import { useRequisition } from '../hooks/useRequisition';
import { useInstitution } from '../hooks/useInstitution';
import { RequisitionData, requisitionStatus, RequisitionStatusData, Transaction } from '../lib/nordigen';
import { Accounts } from './Accounts';
import { Transactions } from './Transactions';


type LinkButtonProps = {
  linkUrl: string;
}

const LinkButton = (props: LinkButtonProps) => {
  const linkAccount = useCallback(() => {
    window.location.assign(props.linkUrl)
  }, [props.linkUrl])
  return <Button onClick={linkAccount}>Link</Button>
}

type UnlinkButtonProps = {
  id: string;
  onUnlink: () => void;
};

const UnlinkButton = ({ onUnlink, id }: UnlinkButtonProps) => {
  const unlinkAccount = useCallback(() => {
    fetch(`api/requisitions/${id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) throw await res.json();
        console.log("Bank unlinked successfully");
        onUnlink();
      }).catch((e) => console.log("Error unlinking bank", e))
  }, [id, onUnlink])
  return <Button onClick={unlinkAccount}>Delete</Button>
}

type RequisitionStatusProps = {
  requisition: RequisitionData;
  onUnlink: () => void;
};

const RequisitionStatus = ({ onUnlink, requisition }: RequisitionStatusProps) => {
  const status = requisitionStatus(requisition.status);

  return <HStack>
    <Tooltip label={status?.description}>
      <Text>{status?.long ?? "unknown"}</Text>
    </Tooltip>;
    <Spacer />
    {status?.short != "LN" ? <LinkButton linkUrl={requisition.link} /> : undefined}
    <UnlinkButton id={requisition.id} onUnlink={onUnlink} />
  </HStack>;
};

export type RequisitionProps = {
  id: string;
  onSelectTransactions: (institutionId: string, accountId: string, transactions: Transaction[]) => void;
}

export const Requisition = ({ id, onSelectTransactions }: RequisitionProps) => {
  const { requisition, isLoading, error, mutate } = useRequisition(id);
  const { institution } = useInstitution(requisition?.institution_id);
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();

  const onSelectAccount = useCallback((aid: string | undefined) => {
    setSelectedAccount(aid);
  }, [setSelectedAccount]);

  if (isLoading)
    return <Box>Loading...</Box>;


  return (
    <AccordionItem>
      <AccordionButton>
        <HStack>
          <Image width="100%" maxWidth="2rem" height="2rem" borderRadius="6px" alt="Logo" src={institution?.logo} />
          <Tooltip label={requisition?.institution_id}><Box fontSize="md">{institution?.name ?? requisition?.institution_id}</Box></Tooltip>
          <Spacer />
        </HStack>
      </AccordionButton>
      <AccordionPanel>
        {requisition ? <RequisitionStatus requisition={requisition} onUnlink={() => mutate(undefined)} /> : undefined}
        {error ? <><Box>Error:</Box><Box>{JSON.stringify(error)}</Box></> : undefined}
        {requisition ? <Accounts requisitionId={requisition.id} onSelectAccount={onSelectAccount} selectedAccount={selectedAccount} /> : undefined}
        {requisition && selectedAccount
          ? <Transactions accountId={selectedAccount} onSelectTransactions={(ts) => onSelectTransactions(requisition?.institution_id, selectedAccount, ts)} />
          : <Box>No account selected</Box>}
      </AccordionPanel>
    </AccordionItem>
  )
}