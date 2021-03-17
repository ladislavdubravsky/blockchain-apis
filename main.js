const bitcoin = require('bitcoinjs-lib')
const { Blockbook } = require('blockbook-client')


const network = bitcoin.networks.testnet
const senderWIF = "cPeW9DkEzKTGk9NmcjaFMo3ikKogNp75cKEPB8a1yrHCQK2sJw4f"
const receiverWIF = "cRsxvECqmwqsLF5nEauRbBwurrcrVkiguiqLxCV5Kwevr1vN4WcR"
const blockbook = new Blockbook({
  nodes: ['tbtc1.trezor.io', 'tbtc2.trezor.io'],
  disableTypeValidation: true, // Turns off runtime type validation
})


const bitcoinTest = async () => {
  // generate keypair
  console.log(bitcoin.ECPair.makeRandom({network: network}).toWIF())

  // import pre-funded address
  const senderKeyPair = bitcoin.ECPair.fromWIF(senderWIF, network)
  const senderAddress = bitcoin.payments.p2pkh({ pubkey: senderKeyPair.publicKey, network: network }).address
  const receiverKeyPair = bitcoin.ECPair.fromWIF(receiverWIF, network)
  const receiverAddress = bitcoin.payments.p2pkh({ pubkey: receiverKeyPair.publicKey, network: network }).address
  
  // check our balance
  const state = await blockbook.getAddressDetails(senderAddress)
  console.log(`Sender: ${senderAddress} balance: ${state.balance}`)
  if (parseInt(state.balance) < 10000) {
    console.log(`Balance too low, fund with faucet!`)
    return
  }

  // check our notes
  const utxos = await blockbook.getUtxosForAddress(senderAddress)
  console.log("UTXOs:", utxos)

  // build a transaction
  const txb = new bitcoin.TransactionBuilder(network)
  const amount = 30000
  const fee = 20000
  txb.addInput(utxos[0].txid, utxos[0].vout)
  txb.addOutput(receiverAddress, 30000)
  txb.addOutput(senderAddress, parseInt(utxos[0].value) - amount - fee) // change
  txb.sign(0, senderKeyPair)
  console.log("Raw tx:", txb.build().toHex())

  // send via blockbook
  const txid = await blockbook.sendTx(txb.build().toHex())
  console.log("Sent transaction id:", txid)
}


const main = async () => {
  await bitcoinTest()
}


main()