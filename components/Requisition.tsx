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
      }).catch(console.log)
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

          onAccountsChanged(data.accounts);
        }
        setError("");
        setLoading(false);
      }).catch((e) => {
        console.log(e);
        setRequisition(null);
        if ([] != accounts) {
          setAccounts([]);
          onAccountsChanged([]);
        }
        setError(e);
        setLoading(false);
      })
  }, [accounts, onAccountsChanged, setAccounts, setError, setLoading])

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