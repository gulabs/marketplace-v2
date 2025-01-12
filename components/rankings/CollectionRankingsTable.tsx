import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Collection } from '__generated__/graphql'
import { NAVBAR_HEIGHT } from 'components/navbar'
import {
  Box,
  Flex,
  FormatCryptoCurrency,
  HeaderRow,
  TableCell,
  TableRow,
  Text,
} from 'components/primitives'
import Img from 'components/primitives/Img'
import Link from 'next/link'
import { ComponentPropsWithoutRef, FC, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

type Props = {
  collections: Collection[]
  loading?: boolean
  volumeKey: 'day1Volume' | 'day7Volume' | 'monthVolume' | 'totalVolume'
}

const desktopTemplateColumns = '1.5fr 1.7fr repeat(3, 0.6fr)'

export const CollectionRankingsTable: FC<Props> = ({
  collections,
  loading,
  volumeKey,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  return (
    <>
      {!loading && collections.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          css={{ py: '$6', gap: '$4', width: '100%' }}
        >
          <Text css={{ color: '$gray11' }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="2xl" />
          </Text>
          <Text css={{ color: '$gray11' }}>No collections found</Text>
        </Flex>
      ) : (
        <Flex direction="column" css={{ width: '100%', pb: '$2' }}>
          {isSmallDevice ? (
            <Flex
              justify="between"
              css={{ mb: '$4', '@md': { display: 'none' } }}
            >
              <Text style="subtitle3" color="subtle">
                Collection
              </Text>
              <Text style="subtitle3" color="subtle">
                Volume
              </Text>
            </Flex>
          ) : (
            <TableHeading />
          )}
          <Flex direction="column" css={{ position: 'relative' }}>
            {collections.map((collection, i) => {
              return (
                <RankingsTableRow
                  key={collection.id}
                  collection={collection}
                  rank={i + 1}
                  volumeKey={volumeKey}
                />
              )
            })}
          </Flex>
        </Flex>
      )}
    </>
  )
}

type RankingsTableRowProps = {
  collection?: Collection
  rank: number
  volumeKey: ComponentPropsWithoutRef<
    typeof CollectionRankingsTable
  >['volumeKey']
}

const RankingsTableRow: FC<RankingsTableRowProps> = ({
  collection,
  rank,
  volumeKey,
}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 900 })

  if (isSmallDevice) {
    return (
      <Link
        href={`/collection/${collection?.id}`}
        style={{ display: 'inline-block', minWidth: 0, marginBottom: 24 }}
        key={collection?.id}
      >
        <Flex align="center" css={{ cursor: 'pointer' }}>
          <Text css={{ mr: '$4', width: 15 }} style="subtitle3">
            {rank}
          </Text>
          <Img
            src={collection?.image as string}
            css={{ borderRadius: 8, width: 48, height: 48, objectFit: 'cover' }}
            alt="Collection Image"
            width={48}
            height={48}
            unoptimized
          />
          <Box css={{ ml: '$4', width: '100%', minWidth: 0 }}>
            <Flex align="center" css={{ gap: '$2', mb: 4, maxWidth: '80%' }}>
              <Text
                css={{
                  display: 'inline-block',
                }}
                style="subtitle1"
                ellipsify
              >
                {collection?.name}
              </Text>
            </Flex>
            <Flex align="center">
              <Text css={{ mr: '$1', color: '$gray11' }} style="body2">
                Floor
              </Text>
              <FormatCryptoCurrency
                amount={collection?.floor?.floorPrice}
                logoHeight={16}
                maximumFractionDigits={2}
                textStyle="subtitle2"
              />
            </Flex>
          </Box>

          <Flex direction="column" align="end" css={{ gap: '$1' }}>
            <FormatCryptoCurrency
              amount={collection?.volume?.[volumeKey]}
              maximumFractionDigits={1}
              logoHeight={16}
              textStyle="subtitle1"
            />
          </Flex>
        </Flex>
      </Link>
    )
  } else {
    return (
      <TableRow
        key={collection?.id}
        css={{
          gridTemplateColumns: desktopTemplateColumns,
        }}
      >
        <TableCell css={{ minWidth: 0 }}>
          <Link
            href={`/collection/${collection?.id}`}
            style={{ display: 'inline-block', width: '100%', minWidth: 0 }}
          >
            <Flex
              align="center"
              css={{
                gap: '$2',
                cursor: 'pointer',
                minWidth: 0,
                overflow: 'hidden',
                width: '100$',
              }}
            >
              <Text css={{ mr: '$2', width: 15 }} style="subtitle3">
                {rank}
              </Text>
              <Img
                src={collection?.image as string}
                css={{
                  borderRadius: 8,
                  width: 56,
                  height: 56,
                  objectFit: 'cover',
                }}
                alt="Collection Image"
                width={56}
                height={56}
                unoptimized
              />

              <Text
                css={{
                  display: 'inline-block',
                  minWidth: 0,
                }}
                style="subtitle1"
                ellipsify
              >
                {collection?.name}
              </Text>
            </Flex>
          </Link>
        </TableCell>
        <TableCell>
          <Flex
            css={{
              gap: '$3',
              minWidth: 0,
            }}
          >
          </Flex>
        </TableCell>
        <TableCell>
          <Flex
            direction="column"
            align="start"
            justify="start"
            css={{ height: '100%' }}
          >
            <FormatCryptoCurrency
              amount={collection?.volume?.[volumeKey]}
              textStyle="subtitle2"
              logoHeight={14}
            />
          </Flex>
        </TableCell>
        <TableCell>
          <Flex
            direction="column"
            align="start"
            justify="start"
            css={{ height: '100%' }}
          >
            <FormatCryptoCurrency
              amount={collection?.floor?.floorPrice}
              textStyle="subtitle2"
              logoHeight={14}
            />
          </Flex>
        </TableCell>
        <TableCell>
        </TableCell>
      </TableRow>
    )
  }
}

const headings = ['Collection', '', 'Volume', 'Floor Price']

const TableHeading = () => (
  <HeaderRow
    css={{
      display: 'none',
      '@md': { display: 'grid' },
      gridTemplateColumns: desktopTemplateColumns,
      position: 'sticky',
      top: NAVBAR_HEIGHT,
      backgroundColor: '$neutralBg',
      zIndex: 1,
    }}
  >
    {headings.map((heading) => (
      <TableCell key={heading}>
        <Text style="subtitle3" color="subtle">
          {heading}
        </Text>
      </TableCell>
    ))}
  </HeaderRow>
)
