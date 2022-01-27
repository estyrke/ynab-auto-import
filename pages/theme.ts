import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools"

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: false,
}


const theme = extendTheme({
  components: {
    Container: {
      baseStyle: (props: StyleFunctionProps) => ({
        bg: mode("white", "gray.800")(props),

      })
    }
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode("gray.100", "gray.900")(props),
      }
    }),
  },
  config
});

export default theme