/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  assertNotNull,
  EvmLogHandlerContext,
  Store,
} from "@subsquid/substrate-evm-processor";
import { Owner, Token, Transfer, Contract } from "../model";
import {
  CONTRACT_INSTANCE,
  CONTRACT_NAME,
  CONTRACT_SYMBOL,
  CONTRACT_TOTAL_SUPPLY,
} from "../constants";
import * as erc721 from "../abis/erc721";

export function createContractEntity(): Contract {
  return new Contract({
    id: CONTRACT_INSTANCE.address,
    name: CONTRACT_NAME,
    symbol: CONTRACT_SYMBOL,
    totalSupply: CONTRACT_TOTAL_SUPPLY,
  });
}

let contractEntity: Contract | undefined;

export async function getContractEntity({
  store,
}: {
  store: Store;
}): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, CONTRACT_INSTANCE.address);
  }
  return assertNotNull(contractEntity);
}

export interface EvmLog {
  data: string;
  topics?: Array<string> | null;
  address: string;
}
export interface ParsedLogs {
  name: string;
  args?: any;
  topics: string;
  fragment: any;
  signature: string;
}

export async function contractLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  const transfer =
    erc721.events["Transfer(address,address,uint256)"].decode(ctx);

  let from = await ctx.store.get(Owner, transfer.from);
  if (from == null) {
    from = new Owner({ id: transfer.from, balance: 0n });
    await ctx.store.save(from);
  }

  let to = await ctx.store.get(Owner, transfer.to);
  if (to == null) {
    to = new Owner({ id: transfer.to, balance: 0n });
    await ctx.store.save(to);
  }

  let token = await ctx.store.get(Token, transfer.tokenId.toString());
  if (token == null) {
    token = new Token({
      id: transfer.tokenId.toString(),
      uri: await CONTRACT_INSTANCE.tokenURI(transfer.tokenId),
      contract: await getContractEntity(ctx),
      owner: to,
    });
    await ctx.store.save(token);
  } else {
    token.owner = to;
    await ctx.store.save(token);
  }

  await ctx.store.save(
    new Transfer({
      id: ctx.txHash,
      token,
      from,
      to,
      timestamp: BigInt(ctx.substrate.block.timestamp),
      block: ctx.substrate.block.height,
      transactionHash: ctx.txHash,
    })
  );
}
