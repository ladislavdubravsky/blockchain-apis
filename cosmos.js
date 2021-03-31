const ps = require("@cosmjs/proto-signing")
const sg = require("@cosmjs/stargate")
const launchpad = require("@cosmjs/launchpad")
const txStake = require("@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx")


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
    // default is a nonsense denomination "ucosm" used only in this libs tests, so we have to override
    const options = { gasPrice: launchpad.GasPrice.fromString("0.025umuon")}
    const client1 = await sg.SigningStargateClient.connectWithSigner(rpcEndpoint, wallet1, options)
    const client2 = await sg.SigningStargateClient.connectWithSigner(rpcEndpoint, wallet2, options)
    const [account1] = await wallet1.getAccounts()
    const [account2] = await wallet2.getAccounts()
    // console.log("Current height:", await client1.getHeight())
    // console.log("Original funding tx:", await client1.getTx("05F6B3C1F299C8CE5033D9B41A3F37823889AE8C01C5436C2B23F4B12568EDA3"))
    console.log("Account 1:", account1.address, await client1.getBalance(account1.address, "umuon"))
    console.log("Account 2:", account2.address, await client2.getBalance(account2.address, "umuon"))

    // fund transfer
    let msg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
            fromAddress: account1.address,
            toAddress: account2.address,
            amount: [{ denom: "umuon", amount: "10000" }]
        }
    }
    let result = await client1.signAndBroadcast(account1.address, [msg], client1.fees.send, "Memo")
    sg.assertIsBroadcastTxSuccess(result)
    console.log("Account 1:", account1.address, await client1.getBalance(account1.address, "umuon"))
    console.log("Account 2:", account2.address, await client2.getBalance(account2.address, "umuon"))

    // if we wanted to become a validator - big responsibility on security, uptime, top 125 stake
    // https://hub.cosmos.network/main/validators/validator-setup.html

    // delegate a bit of stake to a validator
    let msg = {
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: txStake.MsgDelegate.fromJSON({
            delegatorAddress: account1.address,
            validatorAddress: "cosmosvaloper105gvcjgs6s4j5ws9srckx0drt4x8cwgywplh7p",
            amount: { denom: "umuon", amount: "100000" },
        }),
    }
    let fee = {
        amount: [{ denom: "umuon", amount: "4000" }],
        gas: "180000",
    }
    let result = await client1.signAndBroadcast(account1.address, [msg], fee, "Memo")
    sg.assertIsBroadcastTxSuccess(result)
    console.log("Stake delegation successfull. See txid:", result)
}


main().catch(console.log)