import { useContract, useProvider } from "wagmi";
import { useLooksRareSDK } from "../context/LooksRareSDKProvider";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import IExecutionStrategyAbi from "@cuonghx.gu-tech/looksrare-sdk/dist/abis/IExecutionStrategy.json"

export default function (strategy?: string) {
  const sdk = useLooksRareSDK()
  const provider = useProvider()
  
  const [fee, setFee] = useState(0)

  useEffect(() => {
    const getFee = async () => {
      if (strategy) {
        const Strategy = new ethers.Contract(strategy, IExecutionStrategyAbi, provider)
        const fee = await Strategy.viewProtocolFee()
        
        setFee(fee.toNumber())
      }
    } 
    getFee()
  }, [sdk, provider])

  return fee
}
