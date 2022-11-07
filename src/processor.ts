import { TypeormDatabase } from "@subsquid/typeorm-store";
import {EvmBatchProcessor} from '@subsquid/evm-processor'

const processor = new EvmBatchProcessor()
  .setDataSource({
    chain: process.env.ETHEREUM_MAINNET_WSS,
    archive: 'https://eth.archive.subsquid.io',
  })
  .addTransaction([
    '0x0000000000000000000000000000000000000000'
  ], {
    range: {
      from: 10_000_000
    },
    data: {
      transaction: {
        from: true,
        input: true,
        to: true
      }
    }
  });


processor.run(new TypeormDatabase(), async (ctx) => {
  for (let c of ctx.blocks) {
    for (let i of c.items) {
      // apply arbitrary data transformation logic here
      // use ctx.store to persist the data
      ctx.log.info(i, "Next item:")
    }
  }
});

