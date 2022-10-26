import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {EvmBatchProcessor} from '@subsquid/evm-processor'

const processor = new EvmBatchProcessor()
  .setDataSource({
    chain: process.env.ETHEREUM_MAINNET_WSS,
    archive: 'https://ethereum-mainnet-beta.archive.subsquid.io',
  })
  .addLog('0x0000000000000000000000000000000000000000', {
    filter: [[ ]],
    data: {
        evmLog: {
            topics: true,
            data: true,
        },
    } as const,
});


processor.run(new TypeormDatabase(), async (ctx) => {
    ctx.log.info(ctx.blocks, "Got blocks")
});

