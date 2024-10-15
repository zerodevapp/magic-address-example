import {
  createMagicAddress,
  createCall,
  ActionType,
  FLEX,
  CreateMagicAddressParams,
  TOKEN_ADDRESSES,
} from '@zerodev/magic-address'
import { erc20Abi } from 'viem'
import { base, arbitrum, mainnet, optimism } from 'viem/chains'

async function run() {
  // Replace this with an address you want to receive funds on
  const owner = '0xddED85de258cC7a33A61BC6215DD766E87a97070'

  // Source tokens (any ERC20 from arbitrum, ETH from mainnet, USDC from optimism)
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
      chain: optimism
    },
  ]

  const executionChain = base
  const slippage = 5000
  const tokenAddress = TOKEN_ADDRESSES[base.id]["USDC"]

  if (!tokenAddress) {
    throw new Error('Token address not found')
  }

  const to = tokenAddress
  const call = createCall({
    target: to,
    value: 0n,
    // data
    abi: erc20Abi,
    functionName: 'transfer',
    args: [owner, FLEX.FLEX_AMOUNT],
    // call type
    actionType: ActionType.CALL,
  })

  const { magicAddress } = await createMagicAddress({
    executionChain,
    owner,
    slippage,
    tokens:
    {
      'USDC': {
        calls: [call],
        fallBack: [],
      }
    },
    srcTokens,
    config: {
      baseUrl: 'https://magic-address-server.onrender.com',
    },
  })
  console.log('magicAddress', magicAddress)
}

run().catch((error) => console.error('Error:', error))