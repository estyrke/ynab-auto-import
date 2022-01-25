import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
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

const UnlinkButton = ({ onUnlink }: UnlinkButtonProps) => {
  const unlinkAccount = useCallback(() => {
    fetch('api/unlink')
      .then(async (res) => {
        return res.json()
      })
      .then((data) => {
        console.log("Bank unlinked successfully");
        onUnlink();
      }).catch((e) => console.log("Error unlinking bank", e))
  }, [onUnlink])
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

export const Requisition = ({ onAccountsChanged, onInstitutionChanged }: RequisitionProps) => {
  const [requisition, setRequisition] = useState<RequisitionData | null>(null);
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    setLoading(true);
    fetch('api/requisition')
      .then(async (res) => {
        setLoading(false);
        if (res.status != 200) throw new Error(await res.text())

        return res.json()
      })
      .then((data: RequisitionData) => {
        setRequisition(data);
        onAccountsChanged(data.accounts);
        setError("");
      }).catch((e) => {
        console.log("Error fetching requisition", e);
        setRequisition(null);
        onAccountsChanged([]);
        setError(e);
      })
  }, [onAccountsChanged])

  useEffect(() => {
    onInstitutionChanged(requisition?.institution_id);
  }, [onInstitutionChanged, requisition])

  if (isLoading)
    return <Box>Loading...</Box>;

  return (<SimpleGrid columns={2} spacing={10}>
    <Box>Status:</Box><RequisitionStatus onUnlink={() => setRequisition(null)} status={requisition?.status ?? "--"} />
    <Box>Institution ID:</Box><Box>{requisition?.institution_id ?? "???"}</Box>
    {error ? <><Box>Error:</Box><Box>{JSON.stringify(error)}</Box></> : undefined}
  </SimpleGrid>)
}