import { Box, Text, Heading } from '@chakra-ui/layout'
import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Box>
        <AuthGuard>
          <Heading>Team Project</Heading>
        </AuthGuard>
      </Box>
    </>
  )
}
