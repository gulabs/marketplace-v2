import React, { FC, useEffect, useState, useCallback, ReactNode } from 'react'
import { useNetwork } from 'wagmi'
import { Token, Order, Collection } from '__generated__/graphql'
import { useQuery } from '@apollo/client'
import { GET_ORDER_BY_HASH } from 'graphql/queries/orders'
import { useSdk } from 'context/SDKProvider'
import { useCurrency } from 'hooks'
import { Currency } from 'types/currency'
import { GET_TOKEN } from 'graphql/queries/tokens'
import { GET_COLLECTION } from 'graphql/queries/collections'

export enum CancelStep {
  Cancel,
  Approving,
  Complete,
}

type ChildrenProps = {
  loading: boolean
  listing?: Order
  token?: Token
  cancelStep: CancelStep
  transactionError?: Error | null
  totalUsd: number
  blockExplorerBaseUrl: string
  txHash: string | null
  setCancelStep: React.Dispatch<React.SetStateAction<CancelStep>>
  cancelOrder: () => void
  currency?: Currency,
  collection?: Collection
}

type Props = {
  open: boolean
  listingId?: string
  children: (props: ChildrenProps) => ReactNode
}

export const CancelListingModalRenderer: FC<Props> = ({
  open,
  listingId,
  children,
}) => {
  const [cancelStep, setCancelStep] = useState<CancelStep>(CancelStep.Cancel)
  const [transactionError, setTransactionError] = useState<Error | null>()
  const [txHash, setTxHash] = useState<string|null>(null)
  const { chain: activeChain } = useNetwork()
  const blockExplorerBaseUrl =
    activeChain?.blockExplorers?.default.url || 'https://etherscan.io'

  const sdk = useSdk()
  const { data, loading } = useQuery(GET_ORDER_BY_HASH, {
    variables: { hash: listingId as string },
    skip: !listingId
  })

  const listing = data?.order as Order

  const currency = useCurrency(listing?.currencyAddress)

  const { data: tokenData } = useQuery(GET_TOKEN, {
    variables: { id: `${listing?.collectionAddress}-${listing?.tokenId}` },
    skip: !listing?.collectionAddress || !listing?.tokenId
  })

  const { data: collectionData } = useQuery(GET_COLLECTION, {
    variables: { id: listing?.collectionAddress as string },
    skip: !listing?.collectionAddress
  })

  const token = tokenData?.token as Token
  const collection = collectionData?.collection

  const cancelOrder = useCallback(async () => {
    try {
      if (!sdk.signer) {
        const error = new Error('Missing a signer')
        setTransactionError(error)
        throw error
      }
  
      if (!listing) {
        const error = new Error('Missing list id to cancel')
        setTransactionError(error)
        throw error
      }

      setCancelStep(CancelStep.Approving)

      const tx = await sdk.cancelMultipleMakerOrders([listing?.nonce]).call()
      setTxHash(tx.hash);
      await tx.wait()
  
      setCancelStep(CancelStep.Complete)
    } catch (error: any) {
        const errorStatus = (error)?.statusCode
        let message = 'Oops, something went wrong. Please try again.'
        if (errorStatus >= 400 && errorStatus < 500) {
          message = error.message
        }
        //@ts-ignore: Should be fixed in an update to typescript
        const transactionError = new Error(message, {
          cause: error,
        })
        setTransactionError(transactionError)
        setCancelStep(CancelStep.Cancel)
        setTxHash(null);
    }
  }, [listing, sdk])

  useEffect(() => {
    if (!open) {
      setCancelStep(CancelStep.Cancel)
      setTransactionError(null)
      setTxHash(null)
    }
  }, [open])


  return (
    <>
      {children({
        loading,
        listing,
        cancelStep,
        transactionError,
        blockExplorerBaseUrl,
        setCancelStep,
        cancelOrder,
        txHash,
        token,
        totalUsd: 0,
        currency,
        collection
      })}
    </>
  )
}
