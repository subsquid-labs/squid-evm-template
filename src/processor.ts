import { TypeormDatabase } from "@subsquid/typeorm-store";
import {decodeHex, EvmBatchProcessor} from '@subsquid/evm-processor'
import { events } from "./abi/Gravity";
import { ethers } from "ethers";
import { Gravatar } from "./model/generated/gravatar.model";

const processor = new EvmBatchProcessor()
  .setDataSource({
    // uncomment and set RPC_ENDPOONT to enable contract state queries. 
    // Both https and wss endpoints are supported. 
    // chain: process.env.RPC_ENDPOINT,

    // Change the Archive endpoints for run the squid 
    // against the other  EVM networks:
    // Polygon: https://polygon.archive.subsquid.io
    // Goerli: https://goerli.archive.subsquid.io

    archive: 'https://eth.archive.subsquid.io',
  })
<<<<<<< HEAD
  .setBlockRange({ from: 6175243 })
  .addLog('0x2E645469f354BB4F5c8a05B3b30A929361cf77eC', {
    filter: [[
      events['NewGravatar(uint256,address,string,string)'].topic,
      events['UpdatedGravatar(uint256,address,string,string)'].topic,
   ]],
=======
  .addTransaction([
    '0x0000000000000000000000000000000000000000'
  ], {
    range: {
      from: 6_000_000
    },
>>>>>>> c13fa44 (update libs)
    data: {
        evmLog: {
            topics: true,
            data: true,
        },
    } as const,
});


processor.run(new TypeormDatabase(), async (ctx) => {
    const gravatars: Map<string, Gravatar> = new Map();
    for (const c of ctx.blocks) {
      for (const e of c.items) {
        if(e.kind !== "evmLog") {
          continue
        }
        const { id, owner, displayName, imageUrl } = extractData(e.evmLog)
        gravatars.set(id.toHexString(), new Gravatar({
          id: id.toHexString(),
          owner: decodeHex(owner),
          displayName,
          imageUrl
        })) 
      }
    }
    await ctx.store.save([...gravatars.values()])
});


function extractData(evmLog: any): { id: ethers.BigNumber, owner: string, displayName: string, imageUrl: string} {
  if (evmLog.topics[0] === events['NewGravatar(uint256,address,string,string)'].topic) {
    return events['NewGravatar(uint256,address,string,string)'].decode(evmLog)
  }
  if (evmLog.topics[0] === events['UpdatedGravatar(uint256,address,string,string)'].topic) {
    return events['UpdatedGravatar(uint256,address,string,string)'].decode(evmLog)
  }
  throw new Error('Unsupported topic')
}