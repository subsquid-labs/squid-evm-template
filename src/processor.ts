import {EvmBatchProcessor} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'

export const processor = new EvmBatchProcessor()
    .setDataSource({
        // uncomment and set RPC_ENDPOONT to enable contract state queries.
        // Both https and wss endpoints are supported.
        // chain: process.env.RPC_ENDPOINT,

        // Change the Archive endpoints for run the squid
        // against the other EVM networks
        // For a full list of supported networks and config options
        // see https://docs.subsquid.io/develop-a-squid/evm-processor/configuration/

        archive: lookupArchive('eth-mainnet'),
        chain: 'https://rpc.ankr.com/eth'
    })
    .setFinalityConfirmation(10)
    .setFields({
        transaction: {
            from: true,
            value: true,
            hash: true,
        },
    })
    .setBlockRange({
        from: 6_000_000,
    })
    .addTransaction({
        to: ['0x0000000000000000000000000000000000000000'],
    })
