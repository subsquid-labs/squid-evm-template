import { ethers } from "ethers";
import ABI from "./abis/ERC721.json";

export const CONTRACT_ADDRESS = "0xb654611f84a8dc429ba3cb4fda9fad236c505a1a";

// API constants
export const CHAIN_NODE = "wss://wss.api.moonriver.moonbeam.network";
export const ARCHIVE =
  "https://moonriver-beta.indexer.gc.subsquid.io/v4/graphql";
export const BATCH_SIZE = 500;
export const API_RETRIES = 5;

// From contract
export const CONTRACT_NAME = "Moonsama";
export const CONTRACT_SYMBOL = "MSAMA";
export const CONTRACT_TOTAL_SUPPLY = 1000n;

// ethers contract
export const PROVIDER = new ethers.providers.WebSocketProvider(CHAIN_NODE);
export const CONTRACT_INSTANCE = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  PROVIDER
);
