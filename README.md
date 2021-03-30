# Blockchain APIs

Proof of concept for wallet-like interactions with various blockchains.

To run examples:

1. `npm install`
2. `node <blockchain>.js`

## Algorand

### Pure Stake provider

Obtain an API key at [Pure Stake](https://www.purestake.com/technology/algorand-api/) and provide configuration in `.env` file:

```
ALGO_PURESTAKE_API=true

ALGO_API_KEY=<your-api-key>
ALGO_ALGODV2="https://testnet-algorand.api.purestake.io/ps2"
ALGO_ALGODV2_PORT=""
ALGO_IDXV2="https://testnet-algorand.api.purestake.io/idx2"
ALGO_IDXV2_PORT=""
```

### Local private network

Pure Stake doesn't offer API for participation in consensus - this doesn't matter at all currently, since offline accounts gather participation rewards at the same rate as online accounts (the only condition is balance at least 1 ALGO).

Follow the [sandbox](https://github.com/algorand/sandbox) instructions to spin up a local private network. Provide configuration in `.env` file:

```
ALGO_PURESTAKE_API=false

ALGO_API_KEY="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
ALGO_ALGODV2="http://localhost"
ALGO_ALGODV2_PORT="4001"
ALGO_IDXV2="http://localhost"
ALGO_IDXV2_PORT="8980"
```

## Bitcoin

We use [Blockbook](https://github.com/trezor/blockbook/) as indexer and [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) for transaction building.

## Cosmos

The landscape is extremely volatile. Current latest testnet: https://stargate.cosmos.network/testnet. No faucet seems available at this moment. Follow this invite to [Cosmos discord](https://discord.gg/HbvhWZw), join the Stargate testnet channel and politely ask for funds there. Keep an eye on [CosmJS](https://github.com/cosmos/cosmjs) library for developments and documentation updates.