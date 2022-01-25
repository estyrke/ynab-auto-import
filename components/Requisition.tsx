import { Box, Button, propNames, SimpleGrid } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { json } from "stream/consumers";
import { RequisitionData } from "../lib/nordigen";



const LinkButton = () => {
  const linkAccount = useCallback(() => {
    fetch('api/link')
      .then(async (res) => {
        return res.json()
      })
      .then((data) => {
        if (data) window.location.assign(data.link)
      }).catch(console.log)
  }, [])
  return <Button onClick={linkAccount}>Link to your bank</Button>
}

type UnlinkButtonProps = {
  onUnlink: () => void;
};

const UnlinkButton = (props: UnlinkButtonProps) => {
  const unlinkAccount = useCallback(() => {
    fetch('api/unlink')
      .then(async (res) => {
        return res.json()
      })
      .then((data) => {
        console.log("Bank unlinked successfully");
        props.onUnlink();
      }).catch(console.log)
  }, [])
  return <Button onClick={unlinkAccount}>Remove bank link</Button>
}

type RequisitionStatusProps = {
  status: string;
  onUnlink: () => void;
};

const RequisitionStatus = ({ onUnlink, status }: RequisitionStatusProps) =>
  <Box>{status} {status == "LN" ? <UnlinkButton onUnlink={onUnlink} /> : <LinkButton />}</Box>;

type RequisitionProps = {
  onInstitutionChanged: (institutionId: string | undefined) => void;
  onAccountsChanged: (accountIds: string[]) => void;
};

export const Requisition = (props: RequisitionProps) => {
  const [requisition, setRequisition] = useState<RequisitionData | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    setLoading(true);
    fetch('api/requisition')
      .then(async (res) => {
        if (res.status != 200) throw new Error(await res.text())

        return res.json()
      })
      .then((data: RequisitionData) => {
        setRequisition(data);
        if (data.accounts != accounts) {
          setAccounts(data.accounts);

          props.onAccountsChanged(data.accounts);
        }
        setError("");
        setLoading(false);
      }).catch((e) => {
        console.log(e);
        setRequisition(null);
        if ([] != accounts) {
          setAccounts([]);
          props.onAccountsChanged([]);
        }
        setError(e);
        setLoading(false);
      })
  }, [])

  useEffect(() => {
    props.onInstitutionChanged(requisition?.institution_id);
  }, [requisition])

  if (isLoading)
    return <Box>Loading...</Box>;

  return (<SimpleGrid columns={2} spacing={10}>
    <Box>Status:</Box><RequisitionStatus onUnlink={() => setRequisition(null)} status={requisition?.status ?? "--"} />
    <Box>Institution ID:</Box><Box>{requisition?.institution_id ?? "???"}</Box>
    {error ? <><Box>Error:</Box><Box>{JSON.stringify(error)}</Box></> : undefined}
  </SimpleGrid>)
}