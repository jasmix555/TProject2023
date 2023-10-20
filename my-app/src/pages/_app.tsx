import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { initializeFirebaseApp } from '@/lib/firebase/firebase'
import { getApp } from 'firebase/app'
import { AuthProvider } from '@/feature/auth/provider/AuthProvider'
import { Header } from '@/component/Header/Header'

initializeFirebaseApp()

function MyApp({ Component, pageProps }: AppProps) {
  console.log(getApp())
  return (
    <ChakraProvider>
      <AuthProvider>
        <Header />
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp
