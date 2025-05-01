import { GITHUB_REPO_2048 } from '@/configs'
import { Flex, Image, Text } from '@mantine/core'
import { useCallback } from 'react'

export default function Footer() {
  const handleClick = useCallback(() => {
    window.open(GITHUB_REPO_2048, '_blank')
  }, [])

  return (
    <Flex justify="space-between" align="center" w="100%" px={5}>
      <Text fw="bold">Made with ❤️ by NTH Thu Hà</Text>
      <Image
        src="/github-icon.svg"
        width={30}
        height={30}
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      />
    </Flex>
  )
}
