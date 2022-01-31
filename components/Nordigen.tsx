import { Accordion, Box, Button, Heading, List, ListItem, useDisclosure, AccordionItem } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { RequisitionData, Transaction } from '../lib/nordigen';
import { Accounts } from "./Accounts";
import { Requisition } from "./Requisition";
import { Transactions } from "./Transactions";
import { useRequisitions } from "../hooks/useRequisitions";
import { BankSelector } from './BankSelector';
import { IncomingMessage } from 'http';


function absoluteUrl(
  req?: IncomingMessage,
  localhostAddress = 'localhost:3000'
) {
  let host =
    (req?.headers ? req.headers.host : window.location.host) || localhostAddress
  let protocol = /^localhost(:\d+)?$/.test(host) ? 'http:' : 'https:'

  if (
    req &&
    req.headers['x-forwarded-host'] &&
    typeof req.headers['x-forwarded-host'] === 'string'
  ) {
    host = req.headers['x-forwarded-host']
  }

  if (
    req &&
    req.headers['x-forwarded-proto'] &&
    typeof req.headers['x-forwarded-proto'] === 'string'
  ) {
    protocol = `${req.headers['x-forwarded-proto']}:`
  }

  return {
    protocol,
    host,
    origin: protocol + '//' + host,
  }
}

export type NordigenProps = {
  onSelectTransactions: (institutionId: string, accountId: string, transactions: Transaction[]) => void;
};

export const Nordigen = ({ onSelectTransactions }: NordigenProps) => {
  const { requisitionIds, setRequisitionIds } = useRequisitions();

  const createRequisition = useCallback((institutionId: string) => {
    const redirectUrl = window.location.href.replace(/\?.*/, '');
    fetch("api/requisitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ institutionId, redirectUrl })
    }).then(async (res) => {
      if (!res.ok) throw await res.json();
      return res.json();
    }).then((r: RequisitionData) => {
      window.location.href = r.link;
      setRequisitionIds((requisitionIds ?? []).concat([r.id]))
    }).catch((e) => console.log("Error creating requisition", e))
  }, [requisitionIds, setRequisitionIds]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return <>
    <Heading as="h1">Bank settings</Heading>
    <BankSelector isOpen={isOpen} onClose={onClose} onSelect={createRequisition} />
    <Accordion allowToggle>
      {requisitionIds?.map(r => <Requisition key={r} id={r} onSelectTransactions={onSelectTransactions} />)}
      <AccordionItem key=""><Button onClick={onOpen}>Create new bank connection</Button></AccordionItem>
    </Accordion>
  </>;
}