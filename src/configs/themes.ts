import { Button, createTheme, CSSVariablesResolver, MantineThemeOverride } from '@mantine/core'

export const theme: MantineThemeOverride = createTheme({
  primaryColor: 'primary',
  components: {
    Button: Button.extend({
      styles: {
        root: { borderRadius: '12px' },
      },
    }),
  },
  colors: {
    primary: [
      '#fcf4eb',
      '#ede7e1',
      '#d6cdc5',
      '#beb2a6',
      '#aa9b8b',
      '#9e8c7a',
      '#998470',
      '#85715e',
      '#776451',
      '#6a5641',
    ],
  },
})

// https://mantine.dev/styles/css-variables/#css-variables-resolver
export const resolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {},
  dark: {},
})
