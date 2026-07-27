import {run} from '@subsquid/batch-processor'
import {augmentBlock} from '@subsquid/evm-objects'
import {DataSourceBuilder} from '@subsquid/evm-stream'
import {createLogger} from '@subsquid/logger'
import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Burn} from './model'

// A DataSourceBuilder defines where to get the data and what data to fetch.
const dataSource = new DataSourceBuilder()
    // The SQD Network Portal is the primary source of blockchain data: it is public,
    // needs no API key, and streams pre-filtered data — including real-time unfinalized
    // blocks — far faster than a plain RPC endpoint.
    // Browse the available datasets at https://docs.sqd.ai/subsquid-network/reference/networks/
    .setPortal('https://portal.sqd.dev/datasets/ethereum-mainnet')
    // To use a private or rate-limit-lifted Portal, supply an API key
    // through the HTTP client headers (create a key at https://portal.sqd.dev/app):
    // .setPortal({
    //     url: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    //     http: {
    //         headers: {'x-api-key': process.env.SQD_API_KEY},
    //     },
    // })
    .setBlockRange({from: 0})
    // Field selection is explicit: there are no default optional fields, so list every
    // field the handler reads. See
    // https://docs.sqd.ai/en/sdk/squid-sdk/reference/evm-stream/field-selection
    .setFields({
        transaction: {
            from: true,
            value: true,
            hash: true,
        },
    })
    // .addTransaction()/.addLog()/.addTrace()/.addStateDiff() request data items.
    // Here we ask for all transactions sent to the zero address (ETH burns).
    .addTransaction({
        where: {
            to: ['0x0000000000000000000000000000000000000000'],
        },
    })
    .build()

// TypeormDatabase stores the data to Postgres and handles hot-block rollbacks on forks.
const database = new TypeormDatabase({supportHotBlocks: true})

// createLogger() gives the mapping code a logger: the Portal-native handler context
// exposes {store, blocks, isHead} and does not inject `ctx.log`.
const log = createLogger('sqd:processor')

// run() drives the processing loop, passing each batch of data to the handler.
// Reading on-chain contract state (token balances, totalSupply, prices, …) during indexing
// means constructing an RpcClient and calling the squid-evm-typegen Contract classes — the
// Portal handler has no built-in chain access. How-to:
// https://docs.sqd.dev/en/sdk/squid-sdk/evm/reference/evm-typegen/direct-rpc-queries
run(dataSource, database, async (ctx) => {
    // augmentBlock() enriches raw block items with ids and navigation helpers.
    const blocks = ctx.blocks.map(augmentBlock)
    const burns: Burn[] = []
    for (let block of blocks) {
        for (let tx of block.transactions) {
            // decode and normalize the tx data
            burns.push(
                new Burn({
                    id: tx.id,
                    block: block.header.number,
                    address: tx.from,
                    value: tx.value,
                    txHash: tx.hash,
                })
            )
        }
    }
    // apply vectorized transformations and aggregations
    const burned = burns.reduce((acc, b) => acc + b.value, 0n) / 1_000_000_000n
    const startBlock = blocks.at(0)?.header.number
    const endBlock = blocks.at(-1)?.header.number
    log.info(`Burned ${burned} Gwei from ${startBlock} to ${endBlock}`)

    // upsert batches of entities with batch-optimized ctx.store.insert()/upsert()
    await ctx.store.insert(burns)
})
