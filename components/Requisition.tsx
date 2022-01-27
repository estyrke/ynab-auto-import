import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import { useCallback } from "react";
import { useRequisition } from '../hooks/useRequisition';



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
        if (res.status != 200) throw await res.json();
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


export const Requisition = () => {
  const { requisition, isLoading, error, mutate } = useRequisition();

  if (isLoading)
    return <Box>Loading...</Box>;

  return (<SimpleGrid columns={2} spacing={10}>
    <Box>Status:</Box><RequisitionStatus onUnlink={() => mutate(undefined)} status={requisition?.status ?? "--"} />
    <Box>Institution ID:</Box><Box>{requisition?.institution_id ?? "???"}</Box>
    {error ? <><Box>Error:</Box><Box>{JSON.stringify(error)}</Box></> : undefined}
  </SimpleGrid>)
}