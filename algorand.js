const algosdk = require("algosdk")
require("dotenv").config()


// https://developer.algorand.org/tutorials/creating-javascript-transaction-purestake-api/
const purestake = process.env.ALGO_PURESTAKE_API.toLowerCase() === "true"
const token = purestake ? { "X-API-Key": process.env.ALGO_API_KEY } : process.env.ALGO_API_KEY

const client = new algosdk.Algodv2(token, process.env.ALGO_ALGODV2, process.env.ALGO_ALGODV2_PORT)
const indexer =  new algosdk.Indexer(token, process.env.ALGO_IDXV2, process.env.ALGO_IDXV2_PORT)
// const kmd = new algosdk.Kmd(token, "http://localhost", "4002")  // not available on purestake node
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
        lastround++
        await client.statusAfterBlock(lastround).do()
    }
}


async function fundTransferTransaction(account1, account2, amount) {
    // construct transaction
    let params = await client.getTransactionParams().do()
    console.log("Suggested tx params:", params)
    let note = algosdk.encodeObj("From Vacublus to Vacublus")
    let tx = algosdk.makePaymentTxnWithSuggestedParams(account1.addr, account2.addr, amount, undefined, note, params)
    // console.log("Prepared transaction:", tx)

    // sign transaction
    const signedTx = algosdk.signTransaction(tx, account1.sk)

    // send and wait for confirmation
    const sendTx = await client.sendRawTransaction(signedTx.blob).do()
    console.log("Sent transaction id:", sendTx.txId, "waiting for confirmation...")
    await waitForConfirmation(sendTx.txId)
    console.log("Account 1:", account1.addr, (await client.accountInformation(account1.addr).do()).amount)
    console.log("Account 2:", account2.addr, (await client.accountInformation(account2.addr).do()).amount)
}


async function participationTransaction(account1) {
    // construct transaction
    let params = await client.getTransactionParams().do()
    console.log("Suggested tx params:", params)
    let tx = algosdk.makeKeyRegistrationTxnWithSuggestedParams(account1.addr, account2.addr, amount, undefined, note, params)

    // sign transaction
    const signedTx = algosdk.signTransaction(tx, account1.sk)

    // send and wait for confirmation
    const sendTx = await client.sendRawTransaction(signedTx.blob).do()
    console.log("Sent transaction id:", sendTx.txId, "waiting for confirmation...")
    await waitForConfirmation(sendTx.txId)
}


async function main() {
    // new account
    console.log(algosdk.secretKeyToMnemonic(algosdk.generateAccount().sk))

    // console.log("Client status:", await client.status().do())
    // console.log("Some block info:", await indexer.lookupBlock(100).do())
    
    // check balances
    const account1 = algosdk.mnemonicToSecretKey(mnemonic1)
    const account2 = algosdk.mnemonicToSecretKey(mnemonic2)
    let info1 = await client.accountInformation(account1.addr).do()
    let info2 = await client.accountInformation(account2.addr).do()
    console.log("Account 1:", account1.addr, info1.amount)
    console.log("Account 2:", account2.addr, info2.amount)
    if (info1.amount < 10000) {
        let fundMsg = purestake ? "from faucet https://bank.testnet.algorand.network/"
                                : "using goal: \n ./sandbox goal account list"
                                  + `\n ./sandbox goal clerk send -a 10000000 -f <from> -t ${account1.addr}`
        console.log(`Please fund ${account1.addr} ${fundMsg}`)
        return
    }
    
    // fund transfer example
    await fundTransferTransaction(account1, account2, 100000)

    // consensus participation
    // TODO: only do this once there are any upsides to being online in consensus
    // (https://algorand.foundation/faq#participation-rewards-)
    // Step 1.: generating partkey has to be done through goal - no endpoint currently
    // (https://github.com/algorand/go-algorand/issues/864)
    // Step 2.: algosdk.makeKeyRegistrationTxnWithSuggestedParams
    console.log(await indexer.lookupAccountByID(account1.addr).do())
}


main().catch(console.log)