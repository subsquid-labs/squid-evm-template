import { TypeormDatabase } from "@subsquid/typeorm-store";
import {EvmBatchProcessor} from '@subsquid/evm-processor'

const processor = new EvmBatchProcessor()
  .setDataSource({
    // uncomment and set RPC_ENDPOONT to enable contract state queries. 
    // Both https and wss endpoints are supported. 
    // chain: process.env.RPC_ENDPOINT,

    // Change the Archive endpoints for run the squid 
    // against the other EVM networks
    // For a full list of supported networks and config options
    // see https://docs.subsquid.io/develop-a-squid/evm-processor/configuration/

    archive: 'https://eth.archive.subsquid.io',
  })
  .addTransaction([
    '0x0000000000000000000000000000000000000000'
  ], {
    range: {
      from: 6_000_000
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

