import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Attribute } from '__generated__/graphql'
import { Box, Flex, Switch, Text } from 'components/primitives'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { addParam, hasParam, removeParam } from 'utils/router'

type Props = {
  attribute: Attribute
  scrollToTop: () => void
}

export const AttributeSelector: FC<Props> = ({ attribute, scrollToTop }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <Box
      css={{
        pt: '$3',
        px: '$4',
        borderBottom: '1px solid $gray7',
        cursor: 'pointer',
        '@md': { px: '0' },
      }}
    >
      <Flex
        align="center"
        justify="between"
        css={{ mb: '$3', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <Text as="h5" style="subtitle1" ellipsify>
          {attribute.key}
        </Text>
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: '.3s',
          }}
          width={16}
          height={16}
        />
      </Flex>
      <Box
        css={{
          transition: 'max-height .3s ease-in-out',
          maxHeight: open ? 300 : 0,
          overflow: 'auto',
          pb: open ? '$2' : '',
        }}
      >
        {attribute.values &&
          [...attribute.values]
            .sort((a, b) => {
              if (!a.tokenCount || !b.tokenCount) {
                return 0
              } else {
                return b.tokenCount - a.tokenCount
              }
            })
            .map((value) => (
              <Flex
                key={value.value}
                css={{ mb: '$3', gap: '$3' }}
                align="center"
                onClick={() => {
                  if (
                    hasParam(
                      router,
                      `attributes[${attribute.key}]`,
                      value.value
                    )
                  ) {
                    removeParam(
                      router,
                      `attributes[${attribute.key}]`,
                      value.value
                    )
                  } else {
                    addParam(
                      router,
                      `attributes[${attribute.key}]`,
                      value.value
                    )
                  }
                }}
              >
                <Text
                  style="body1"
                  css={{
                    color: '$gray11',
                    flex: 1,
                    whiteSpace: 'pre',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {value.value}
                </Text>

                <Text style="body2" css={{ color: '$gray11' }}>
                  {value.tokenCount}
                </Text>
                <Flex align="center">
                  <Switch
                    checked={hasParam(
                      router,
                      `attributes[${attribute.key}]`,
                      value.value
                    )}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addParam(
                          router,
                          `attributes[${attribute.key}]`,
                          value.value
                        )
                      } else {
                        removeParam(
                          router,
                          `attributes[${attribute.key}]`,
                          value.value
                        )
                      }
                      scrollToTop()
                    }}
                  />
                </Flex>
              </Flex>
            ))}
      </Box>
    </Box>
  )
}
