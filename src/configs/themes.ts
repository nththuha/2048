import { Button, createTheme, CSSVariablesResolver, MantineThemeOverride } from '@mantine/core'
import { GAP, WIDTH } from './constant'

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
    '--primary-bg': '#FAF8EF',
    '--secondary-bg': '#BBAC9F',
    '--cell-bg': '#CDBFB3',
    '--secondary-text': '#FEF1E8',
    '--label': '#EEE3DA',
    '--score': 'white',
    '--tile-size': `${WIDTH}px`,
    '--tile-gap': `${GAP}px`,
  },
  light: {
    '--text-color': theme.colors.primary[9],
  },
  dark: {
    '--text-color': theme.colors.primary[9],
  },
})
