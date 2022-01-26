import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs'
import { useRouter } from 'next/router';
import theme from './theme';

//  List pages you want to be publicly accessible, or leave empty if
//  every page requires authentication. Use this naming strategy:
//   "/"              for pages/index.js
//   "/foo"           for pages/foo/index.js
//   "/foo/bar"       for pages/foo/bar.js
//   "/foo/[...bar]"  for pages/foo/[...bar].js
const publicPages: string[] = ["/"];

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

  return (
    <ChakraProvider theme={theme}>
      <ClerkProvider>
        {isPublicPage ? (
          <Component {...pageProps} />
        ) : (
          <>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        )}
      </ClerkProvider>
    </ChakraProvider>)
}

export default MyApp
