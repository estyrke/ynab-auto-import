import { Button, Circle, Container, Flex, Heading, HStack, Spacer, useColorMode, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { PropsWithChildren } from "react";
import { DownloadIcon } from "@chakra-ui/icons";
import Link from "./Link";
import { UserButton } from "@clerk/nextjs";

export const SiteContainer = ({ children }: PropsWithChildren<{}>) => {
  const { toggleColorMode } = useColorMode();

  return <Container maxW="container.xl">
    <Head>
      <title>Bank Import (Sweden) for YNAB</title>
      <meta name="description" content="A tool to auto-import transactions from Danske Bank (SV) into YNAB" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Flex width="100%">
      <VStack p={5} width="100%">
        <HStack width="100%" p={2} bg="teal.300" justifyContent="space-between" alignSelf="flex-start">
          <Circle bg="white" p={2}><DownloadIcon color="teal.300" /></Circle>
          <Link href="/"><Heading>Bank Import (Sweden) for YNAB</Heading></Link>
          <Spacer />
          <Link href="/import">Import</Link><Button onClick={toggleColorMode}>Switch theme</Button>
          <UserButton />
        </HStack>
        <VStack alignItems="flex-start" dropShadow="lg" borderRadius="md">
          {children}
        </VStack>
      </VStack>
    </Flex>
  </Container >;
}