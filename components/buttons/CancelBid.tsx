import { useConnectModal } from '@rainbow-me/rainbowkit'
import { FC, ReactElement, cloneElement, useContext } from 'react'
import { useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
import { ToastContext } from '../../context/ToastContextProvider'
import { useDefaultChain, useIsInTheWrongNetwork } from 'hooks'
import { CancelBidModal } from 'components/@reservoir0x/components/Modal/CancleBid/CancelBidModal'
import { CancelStep } from 'components/@reservoir0x/components/Modal/CancleBid/CancelBidModalRenderer'

type Props = {
  bidId: string
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  trigger: ReactElement
  mutate?: () => void
}

const CancelBid: FC<Props> = ({ bidId, openState, trigger, mutate }) => {
  const { addToast } = useContext(ToastContext)
  const { openConnectModal } = useConnectModal()
  const defaultChain = useDefaultChain()
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: defaultChain.id,
  })

  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()

  const isInTheWrongNetwork = useIsInTheWrongNetwork()

  if (isInTheWrongNetwork) {
    return cloneElement(trigger, {
      onClick: async () => {
        if (switchNetworkAsync && activeChain) {
          const chain = await switchNetworkAsync(defaultChain.id)
          if (chain.id !== defaultChain.id) {
            return false
          }
        }

        if (!signer) {
          openConnectModal?.()
        }
      },
    })
  }

  return (
    <CancelBidModal
      bidId={bidId}
      trigger={trigger}
      openState={openState}
      onCancelComplete={() => {
        addToast?.({
          title: 'User canceled bid',
          description: 'You have canceled the bid.',
        })
      }}
      onCancelError={(error: any) => {
        console.log('Bid Cancel Error', error)
        addToast?.({
          title: 'Could not cancel bid',
          description: 'The transaction was not completed.',
        })
      }}
      onClose={(currentStep) => {
        if (mutate && currentStep == CancelStep.Complete) mutate()
      }}
    />
  )
}

export default CancelBid
