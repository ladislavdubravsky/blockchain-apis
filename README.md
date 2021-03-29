# Blockchain APIs

Proof of concept for wallet-like interactions with various blockchains.

To run examples:

1. `npm install`
2. `node <blockchain>.js`

## Algorand

Obtain an API key at [Pure Stake](https://www.purestake.com/technology/algorand-api/) and put it as `ALGORAND_API_KEY` in `.env` file.

## Bitcoin

We use [Blockbook](https://github.com/trezor/blockbook/) as indexer and [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) for transaction building.

### Cosmos

The landscape is extremely volatile. Current latest testnet: https://stargate.cosmos.network/testnet. No faucet seems available at this moment. Follow this invite to [Cosmos discord](https://discord.gg/HbvhWZw), join the Stargate testnet channel and politely ask for funds there. Keep an eye on [CosmJS](https://github.com/cosmos/cosmjs) library developments and documentation updates.