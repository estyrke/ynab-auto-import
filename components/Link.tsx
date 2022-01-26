import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

// Only pick href from NextLinkProps. Add more if needed.
export type LinkProps = Pick<NextLinkProps, "href"> & ChakraLinkProps;

export const Link = ({ children, href, ...props }: LinkProps) =>
  <NextLink href={href} passHref>
    <ChakraLink {...props}>{children}</ChakraLink>
  </NextLink>;

export default Link;