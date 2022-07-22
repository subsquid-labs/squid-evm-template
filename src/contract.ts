import { Store } from "@subsquid/typeorm-store";
import { Contract } from "./model";

export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";

export const contractAddress = "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a";

export function createContractEntity(): Contract {
  return new Contract({
    id: contractAddress,
    name: "Moonsama",
    symbol: "MSAMA",
    totalSupply: 1000n,
  });
}

let contractEntity: Contract | undefined;

export async function getContractEntity(store: Store): Promise<Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(Contract, contractAddress);
    if (contractEntity == null) {
      contractEntity = createContractEntity();
      await store.insert(contractEntity);
    }
  }
  return contractEntity;
}
