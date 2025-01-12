import { useConnectModal } from '@rainbow-me/rainbowkit'
import { FC, ReactElement, useContext, cloneElement } from 'react'
import { useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
import { ToastContext } from '../../context/ToastContextProvider'
import { useDefaultChain, useIsInTheWrongNetwork } from 'hooks'
import { CancelListingModal } from 'components/@reservoir0x/components/Modal/CancelListing/CancelListingModal'
import { CancelStep } from 'components/@reservoir0x/components/Modal/CancelListing/CancelListingModalRenderer'

type Props = {
  listingId: string
  openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  trigger: ReactElement<any>
  mutate?: () => void
}

const CancelListing: FC<Props> = ({
  listingId,
  openState,
  trigger,
  mutate,
}) => {
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
    <CancelListingModal
      listingId={listingId}
      openState={openState}
      trigger={trigger}
      onCancelComplete={() => {
        addToast?.({
          title: 'User canceled listing',
          description: 'You have canceled the listing.',
        })
      }}
      onCancelError={(error: any) => {
        console.log('Listing Cancel Error', error)
        addToast?.({
          title: 'Could not cancel listing',
          description: 'The transaction was not completed.',
        })
      }}
      onClose={(currentStep) => {
        if (mutate && currentStep == CancelStep.Complete) mutate()
      }}
    />
  )
}

export default CancelListing
