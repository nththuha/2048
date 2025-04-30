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
export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--primary-background': '#FAF8EF',
    '--secondary-background': '#BBAC9F',
    '--cell-background': '#CDBFB3',
    '--secondary-text-color': '#FEF1E8',
    '--label-color': '#EEE3DA',
    '--tile-size': '80px',
    '--tile-gap': '10px',
  },
  light: {
    '--text-color': theme.colors.primary[9],
  },
  dark: {
    '--text-color': theme.colors.primary[9],
  },
})
