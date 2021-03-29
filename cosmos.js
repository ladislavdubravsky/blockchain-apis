const ps = require("@cosmjs/proto-signing")
const sg = require("@cosmjs/stargate")


// https://stargate.cosmos.network/testnet
const rpcEndpoint = "http://34.71.170.158:26657"
const mnemonic1 = "erosion muffin scene impact utility seek catch female diet salute tape theory"
const mnemonic2 = "side young glass scorpion grace body hand gas govern memory wolf name"


async function main() {
    // generate account
    console.log("New wallet:", (await ps.DirectSecp256k1HdWallet.generate()).mnemonic)

    // check balances
    const wallet1 = await ps.DirectSecp256k1HdWallet.fromMnemonic(mnemonic1)
    const wallet2 = await ps.DirectSecp256k1HdWallet.fromMnemonic(mnemonic2)
    const client1 = await sg.SigningStargateClient.connectWithSigner(rpcEndpoint, wallet1)
    const client2 = await sg.SigningStargateClient.connectWithSigner(rpcEndpoint, wallet2)
    const [account1] = await wallet1.getAccounts()
    const [account2] = await wallet2.getAccounts()
    console.log("Account 1:", account1.address, await client1.getBalance(account1.address, "ucosm"))
    console.log("Account 2:", account2.address, await client2.getBalance(account2.address, "ucosm"))

    // send transaction
    const amount = {
        denom: "ucosm",
        amount: "10000",
    }
    const result = await client1.sendTokens(account1.address, account2.address, [amount], "Msg")
    sg.assertIsBroadcastTxSuccess(result)
}


main().catch(console.log)