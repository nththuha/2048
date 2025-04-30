import { Text } from '@mantine/core'

export default function Instruction() {
  return (
    <Text>
      <BoldText>HOW TO PLAY:</BoldText> Use <BoldText>arrow keys</BoldText> (desktop) or{' '}
      <BoldText>swipe</BoldText> (mobile) to move tiles. Same numbers{' '}
      <BoldText>merge into one!</BoldText>
    </Text>
  )
}

function BoldText({ children }: { children: React.ReactNode }) {
  return (
    <Text fw="bold" span>
      {children}
    </Text>
  )
}
