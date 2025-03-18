import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  colors: {
    brand: {
      50: '#e5f5ff',
      100: '#b8e3ff',
      200: '#8ad1ff',
      300: '#5cbfff',
      400: '#2eadff',
      500: '#1493e6',
      600: '#0073b4',
      700: '#005382',
      800: '#003351',
      900: '#001321',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
) 