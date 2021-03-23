# Blockchain APIs

Proof of concept for wallet-like interactions with various blockchains.

To run examples:

1. `npm install`
2. `node <blockchain>.js`

## Algorand

Obtain an API key at [Pure Stake](https://www.purestake.com/technology/algorand-api/) and put it as `ALGORAND_API_KEY` in `.env` file.

## Bitcoin

We use [Blockbook](https://github.com/trezor/blockbook/) as indexer and [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) for transaction building.