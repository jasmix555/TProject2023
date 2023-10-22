import { useAuthContext } from '@/feature/auth/provider/AuthProvider'
import type { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from '@/hooks/useRouter/useRouter'

type Props = {
  children: ReactNode
}

export const AuthGuard = ({ children }: Props) => {
  const { user } = useAuthContext()
  const { push } = useRouter()

  if (typeof user === 'undefined') {
    return <Box>読み込み中...</Box>
  }

  if (user === null) {
    push((path) => path.signin.$url())
    return null
  }

  return <>{children}</>
}
