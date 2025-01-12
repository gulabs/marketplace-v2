import { FC } from 'react'
import { Tooltip, Text } from 'components/primitives'

type Props = {
  openseaVerificationStatus: string
}

export const OpenSeaVerified: FC<Props> = ({ openseaVerificationStatus }) => {
  if (openseaVerificationStatus === 'verified')
    return (
      <Tooltip
        sideOffset={4}
        content={
          <Text style="body2" css={{ display: 'block' }}>
            Verified by OpenSea
          </Text>
        }
      >
        <img src="/icons/opensea-verified.svg" alt=''/>
      </Tooltip>
    )
  else return null
}
