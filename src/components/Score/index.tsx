import { Flex, SimpleGrid, Text } from '@mantine/core'
import classes from './Score.module.scss'

type ScoreProps = {
  score: number
  bestScore: number
}

export default function Score({ score, bestScore }: ScoreProps) {
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
