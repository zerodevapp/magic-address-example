import {
  createMagicAddress,
  createCall,
  FLEX,
  CreateMagicAddressParams,
} from '@zerodev/magic-address'
import { erc20Abi } from 'viem'
import { base, arbitrum, mainnet, optimism } from 'viem/chains'

async function run() {
  // Replace this with an address you want to receive funds on
  const owner = '0xddED85de258cC7a33A61BC6215DD766E87a97070'

  // Source tokens (any ERC20 on arbitrum, ETH on mainnet, USDC on optimism)
  const srcTokens: CreateMagicAddressParams["srcTokens"] = [
    {
      tokenType: 'ERC20',
      chain: arbitrum,
    },
    {
      tokenType: 'NATIVE',
      chain: mainnet
    },
    {
      tokenType: 'USDC',
      chain: optimism,
      minAmount: 1000000n // min amount of USDC to deposit
    },
  ]

  const destChain = base
  const slippage = 5000

  const call = createCall({
    target: FLEX.TOKEN_ADDRESS,
    value: 0n,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [owner, 1000000n],
  })

  const { magicAddress, estimatedFees } = await createMagicAddress({
    destChain,
    owner,
    slippage,
    actions: {
      'USDC': {
        action: [call],
        fallBack: [],
      }
    },
    srcTokens,
    config: {
      baseUrl: 'https://magic-address-server.onrender.com'
    },
  })

  console.log('Estimated fee per token deposit', JSON.stringify(estimatedFees, null, 2));
  console.log('Magic address', magicAddress)
  console.log('Try sending at least 1 USDC to the magic address on any chain (say Arbitrum), and observe that the owner address receives funds on Base.')
}

run().catch((error) => console.error('Error:', error))
