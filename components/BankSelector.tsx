import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Image, Input, InputGroup, InputLeftElement, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from 'react';
import useSWRImmutable from "swr/immutable";
import { InstitutionData } from "../lib/nordigen";


type SearchBoxProps = {
  onUpdate: (filter: string) => void;
}
const SearchBox = ({ onUpdate }: SearchBoxProps) => {
  useEffect(() => {
    onUpdate("");
  }, [onUpdate]);

  return <InputGroup>
    <InputLeftElement pointerEvents="none">
      <SearchIcon />
    </InputLeftElement>
    <Input placeholder="Search..." onKeyUp={(e) => onUpdate(e.currentTarget.value)} />
  </InputGroup>
};

type InstitutionProps = {
  name: string;
  logo: string;
  onSelect?: () => void;
}
const Institution = (props: InstitutionProps) => {
  return <Box onClick={props.onSelect} paddingRight="2.5rem"
    display="flex"
    flexDirection="row"
    alignItems="center"
    textDecoration="none"
    _hover={{ backgroundColor: "#F1F1F1" }}>
    <Image alt={`Logo for ${props.name}`} width="100%" maxWidth="3.5rem" height="3.5rem" borderRadius="6px" src={props.logo} />
    <Text marginLeft="1.5rem"
      fontSize="1.5rem"
      fontWeight={600}
      color="#1B2021">{props.name}</Text>
  </Box>
}

export type BankSelectorProps = {
  onSelect?: (institution: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

export const BankSelector = (props: BankSelectorProps) => {
  const { data: institutions, error } = useSWRImmutable<InstitutionData[]>("api/institutions");
  const [filteredInstitutions, setFilteredInstitutions] = useState<InstitutionData[]>(institutions ?? []);

  const setSearchFilter = useCallback((filter) => {
    console.log("filter", filter)
    if (!institutions) {
      setFilteredInstitutions([]);
    } else {
      setFilteredInstitutions(institutions.filter((i) => i.name.toUpperCase().includes(filter.toUpperCase())));
    }
  }, [institutions])

  return <Modal isOpen={props.isOpen} onClose={props.onClose} scrollBehavior="inside">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Select bank</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <SearchBox onUpdate={setSearchFilter} />
        <List padding="14px 0">
          {filteredInstitutions.map((i) => <ListItem key={i.id}>
            <Institution name={i.name} logo={i.logo} onSelect={() => props.onSelect ? props.onSelect(i.id) : undefined} />
          </ListItem>)}
        </List>
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal >
};
