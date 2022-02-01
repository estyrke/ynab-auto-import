import type { NextPage } from 'next'
import { Heading, Image, Text } from '@chakra-ui/react';
import { SiteContainer } from '../components/SiteContainer';
import Link from '../components/Link';


const Home: NextPage = () => (<SiteContainer>
  <Heading>Swedish bank import for YNAB</Heading>
  <Text>YNAB has automatic transaction import from many banks.
    However, no Swedish bank is supported, and in particular, my own bank (Danske Bank) is not supported in Sweden.</Text>
  <Text>This is my attempt at bridging the gap.  Mostly for my own personal use, but if you&apos;d like to try you&apos;re welcome!</Text>
  <Link href="https://youneedabudget.com/"><Image src="https://api.youneedabudget.com/papi/works_with_ynab.svg" alt="Works with YNAB" /></Link>
</SiteContainer >
)

export default Home
