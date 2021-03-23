const algosdk = require("algosdk")
require("dotenv").config()


// https://developer.algorand.org/tutorials/creating-javascript-transaction-purestake-api/
const PURESTAKE_API = true
const token = PURESTAKE_API ? { "X-API-Key": process.env.ALGORAND_API_KEY } : process.env.ALGORAND_API_KEY

const client = new algosdk.Algodv2(token, "https://testnet-algorand.api.purestake.io/ps2", "")
const indexer =  new algosdk.Indexer(token, "https://testnet-algorand.api.purestake.io/idx2", "")
// const kmd = new algosdk.Kmd(API_KEY, "http://localhost") // not available on purestake node
const mnemonic1 = "cheap elevator resource claw gas census giant hero beauty series brown will impulse canyon husband stuff panda viable iron inch when screen rapid able law"
const mnemonic2 = "abandon arrow round rebel glory truly jungle tide find napkin left rough expose vivid shallow few need switch purchase snack hazard swing car able catch"


async function waitForConfirmation(txid) {
    let lastround = (await client.status().do())["last-round"]
    while (true) {
        const pendingInfo = await client.pendingTransactionInformation(txid).do()
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
            console.log(`Transaction confirmed in round ${pendingInfo["confirmed-round"]}`)
            break
        }
        lastround++;
        await client.statusAfterBlock(lastround).do()
     }
 }


async function main() {
    // new account
    // console.log(algosdk.secretKeyToMnemonic(algosdk.generateAccount().sk))

    // console.log("Client status:", await client.status().do())
    // console.log("Some block info:", await indexer.lookupBlock(100).do())
    
    // check balances
    const account1 = algosdk.mnemonicToSecretKey(mnemonic1)
    const account2 = algosdk.mnemonicToSecretKey(mnemonic2)
    let info1 = await client.accountInformation(account1.addr).do()
    let info2 = await client.accountInformation(account2.addr).do()
    console.log("Account 1:", account1.addr, info1.amount)
    console.log("Account 2:", account2.addr, info2.amount)
    if (info1.amount < 10000)
        console.log(`Please fund ${account1.addr} from faucet https://bank.testnet.algorand.network/`)
    
    // construct transaction
    let params = await client.getTransactionParams().do()
    console.log("Suggested tx params:", params)
    let note = algosdk.encodeObj("From Vacublus to Vacublus")
    let tx = algosdk.makePaymentTxnWithSuggestedParams(account1.addr, account2.addr, 100000, undefined, note, params)
    // console.log("Prepared transaction:", tx)

    // sign transaction
    const signedTx = algosdk.signTransaction(tx, account1.sk)

    // send and wait for confirmation
    const sendTx = await client.sendRawTransaction(signedTx.blob).do()
    console.log("Sent transaction id:", sendTx.txId);
    await waitForConfirmation(sendTx.txId)
    console.log("Account 1:", account1.addr, (await client.accountInformation(account1.addr).do()).amount)
    console.log("Account 2:", account2.addr, (await client.accountInformation(account2.addr).do()).amount)
}


main().catch(console.log);