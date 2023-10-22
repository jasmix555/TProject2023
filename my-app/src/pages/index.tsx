import type { NextPage } from 'next'
import { Flex, Heading, Wrap } from '@chakra-ui/react'

const Page: NextPage = () => {
  return (
    <>
      <Wrap>
        <Heading>Main Page</Heading>
        <Flex>
          <Heading>Chat</Heading>
          <Heading>Chat</Heading>
        </Flex>
      </Wrap>
    </>
  )
}

export default Page
