import { SubstrateEvmProcessor } from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { CHAIN_NODE, BATCH_SIZE, CONTRACT_ADDRESS } from "./constants";
import { contractLogsHandler, createContractEntity } from "./helpers/events";
import { events } from "./abis/erc721";

const processor = new SubstrateEvmProcessor("moonriver-substrate");

processor.setBatchSize(BATCH_SIZE);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("moonriver")[0].url,
});

processor.setTypesBundle("moonbeam");

processor.addPreHook({ range: { from: 0, to: 0 } }, async (ctx) => {
  await ctx.store.save(createContractEntity());
});

processor.addEvmLogHandler(
  CONTRACT_ADDRESS,
  {
    filter: [events["Transfer(address,address,uint256)"].topic],
  },
  contractLogsHandler
);

processor.run();
