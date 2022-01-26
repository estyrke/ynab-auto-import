import type { NextPage } from 'next'
import { Heading, Text, VStack } from '@chakra-ui/react';
import { SiteContainer } from '../components/SiteContainer';


const Home: NextPage = () => (<SiteContainer>
  <Heading>YNAB bank import</Heading>
  <Text>YNAB has automatic transaction import from many banks.
    However, no Swedish bank is supported, and in particular, my own bank (Danske Bank) is not supported in Sweden.</Text>
  <Text>There is also a service called Sync for YNAB, which also lacks support for Swedish banks.</Text>
  <Text>So this is my attempt at bridging the gap.  Mostly for my own personal use, but if you&apos;d like to try you&apos;re welcome!</Text>
</SiteContainer >
)

export default Home
