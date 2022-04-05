/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Interface } from "@ethersproject/abi";
import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import erc721Json from "./ERC721.json";

const abi = new Interface(erc721Json);

export interface TransferEvent {
  from: string;
  to: string;
  tokenId: bigint;
}

const transferFragment = abi.getEvent("Transfer(address,address,uint256)");

export const events = {
  "Transfer(address,address,uint256)": {
    topic: abi.getEventTopic("Transfer(address,address,uint256)"),
    decode(data: EvmLogHandlerContext): TransferEvent {
      const result = abi.decodeEventLog(
        transferFragment,
        data.data || "",
        data.topics
      );
      return {
        from: result[0],
        to: result[1],
        tokenId: result[2].toBigInt(),
      };
    },
  },
};
