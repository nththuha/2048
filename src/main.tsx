import { resolver, theme } from '@/configs/themes'
import '@/styles/globals.scss'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

const root = document.getElementById('root')
root &&
  ReactDOM.createRoot(root).render(
    <React.Suspense>
      <BrowserRouter>
        <MantineProvider theme={theme} cssVariablesResolver={resolver}>
          2048
        </MantineProvider>
      </BrowserRouter>
    </React.Suspense>,
  )
