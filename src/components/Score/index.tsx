import { use2048Game } from '@/hooks/use2048'
import { Flex, SimpleGrid, Text } from '@mantine/core'
import classes from './Score.module.scss'

export default function Score() {
  const { score, bestScore } = use2048Game()

  return (
    <SimpleGrid cols={2} spacing="xs" w="100%" mt={-16}>
      <Item label="Score" score={score} />
      <Item label="Best" score={bestScore} />
    </SimpleGrid>
  )
}

function Item({ label, score }: { label: string; score: number }) {
  return (
    <Flex gap={0} className={classes.itemContainer}>
      <Text className={classes.label}>{label.toUpperCase()}</Text>
      <Text className={classes.score}>{score}</Text>
    </Flex>
  )
}
