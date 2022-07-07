import { Store } from "@subsquid/typeorm-store";
import { ethers } from "ethers";
import * as erc721 from "./abi/erc721";
import { Contract } from "./model";

export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";

export const contract = new ethers.Contract(
  "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a",
  erc721.abi,
  new ethers.providers.WebSocketProvider(CHAIN_NODE)
);

export function createContractEntity(): Contract {
  return new Contract({
    id: contract.address,
    name: "Moonsama",
    symbol: "MSAMA",
    totalSupply: 1000n,
  });
}

let contractEntity: Contract | undefined;

export async function getContractEntity(store: Store): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, contract.address);
    if (contractEntity == null) {
      contractEntity = createContractEntity();
      await store.insert(contractEntity);
    }
  }
  return contractEntity;
}

export async function getTokenURI(address: string): Promise<string> {
  return retry(async () => timeout(contract.tokenURI(address)));
}

async function timeout<T>(res: Promise<T>, seconds = 30): Promise<T> {
  return new Promise((resolve, reject) => {
    let timer: any = setTimeout(() => {
      timer = undefined;
      reject(new Error(`Request timed out in ${seconds} seconds`));
    }, seconds * 1000);

    res
      .finally(() => {
        if (timer != null) {
          clearTimeout(timer);
        }
      })
      .then(resolve, reject);
  });
}

async function retry<T>(promiseFn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await promiseFn();
    } catch (e) {
      console.log(e);
    }
  }
  throw new Error(`Error after ${attempts} attempts`);
}
er