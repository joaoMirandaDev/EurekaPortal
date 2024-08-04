import { HoverCard, Text } from '@mantine/core'

interface Props {
  text?: string
  maxWidth: number
}

export const CellHoverCard = ({ text, maxWidth }: Props) => {
  return (
    <HoverCard width={280} shadow="md" openDelay={300} position={'left'}>
      <HoverCard.Target>
        <Text
          sx={{
            whiteSpace: 'nowrap',
            maxWidth: maxWidth,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          {text}
        </Text>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text
          size="sm"
          sx={{
            whiteSpace: 'pre-wrap',
          }}
        >
          {text}
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}
