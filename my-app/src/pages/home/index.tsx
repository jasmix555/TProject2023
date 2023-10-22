import {
  Avatar,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useToast,
  Wrap,
} from '@chakra-ui/react'
import { useAuthContext } from '@/feature/auth/provider/AuthProvider'
import { FirebaseError } from '@firebase/util'
import { getAuth, signOut } from 'firebase/auth'
import { Navigate } from '@/component/Navigate/Navigate'
import { useRouter } from '@/hooks/useRouter/useRouter'

export default function Home() {
  return (
    <>
      <Wrap>
        <Flex>
          <Heading>Home Page</Heading>
        </Flex>
      </Wrap>
    </>
  )
}
