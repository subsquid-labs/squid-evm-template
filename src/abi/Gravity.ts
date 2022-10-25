import * as ethers from "ethers";
import assert from "assert";

export const abi = new ethers.utils.Interface(getJsonAbi());

export type NewGravatar0Event = ([id: ethers.BigNumber, owner: string, displayName: string, imageUrl: string] & {id: ethers.BigNumber, owner: string, displayName: string, imageUrl: string})

export type UpdatedGravatar0Event = ([id: ethers.BigNumber, owner: string, displayName: string, imageUrl: string] & {id: ethers.BigNumber, owner: string, displayName: string, imageUrl: string})

export interface EvmLog {
  data: string;
  topics: string[];
}

function decodeEvent(signature: string, data: EvmLog): any {
  return abi.decodeEventLog(
    abi.getEvent(signature),
    data.data || "",
    data.topics
  );
}

export const events = {
  "NewGravatar(uint256,address,string,string)": {
    topic: abi.getEventTopic("NewGravatar(uint256,address,string,string)"),
    decode(data: EvmLog): NewGravatar0Event {
      return decodeEvent("NewGravatar(uint256,address,string,string)", data)
    }
  }
  ,
  "UpdatedGravatar(uint256,address,string,string)": {
    topic: abi.getEventTopic("UpdatedGravatar(uint256,address,string,string)"),
    decode(data: EvmLog): UpdatedGravatar0Event {
      return decodeEvent("UpdatedGravatar(uint256,address,string,string)", data)
    }
  }
  ,
}

export type UpdateGravatarImage0Function = ([_imageUrl: string] & {_imageUrl: string})

export type UpdateGravatarName0Function = ([_displayName: string] & {_displayName: string})

export type CreateGravatar0Function = ([_displayName: string, _imageUrl: string] & {_displayName: string, _imageUrl: string})


function decodeFunction(data: string): any {
  return abi.decodeFunctionData(data.slice(0, 10), data)
}

export const functions = {
  "updateGravatarImage(string)": {
    sighash: abi.getSighash("updateGravatarImage(string)"),
    decode(input: string): UpdateGravatarImage0Function {
      return decodeFunction(input)
    }
  }
  ,
  "setMythicalGravatar()": {
    sighash: abi.getSighash("setMythicalGravatar()"),
  }
  ,
  "updateGravatarName(string)": {
    sighash: abi.getSighash("updateGravatarName(string)"),
    decode(input: string): UpdateGravatarName0Function {
      return decodeFunction(input)
    }
  }
  ,
  "createGravatar(string,string)": {
    sighash: abi.getSighash("createGravatar(string,string)"),
    decode(input: string): CreateGravatar0Function {
      return decodeFunction(input)
    }
  }
  ,
}

interface ChainContext  {
  _chain: Chain
}

interface BlockContext  {
  _chain: Chain
  block: Block
}

interface Block  {
  height: number
}

interface Chain  {
  client:  {
    call: <T=any>(method: string, params?: unknown[]) => Promise<T>
  }
}

export class Contract  {
  private readonly _chain: Chain
  private readonly blockHeight: number
  readonly address: string

  constructor(ctx: BlockContext, address: string)
  constructor(ctx: ChainContext, block: Block, address: string)
  constructor(ctx: BlockContext, blockOrAddress: Block | string, address?: string) {
    this._chain = ctx._chain
    if (typeof blockOrAddress === 'string')  {
      this.blockHeight = ctx.block.height
      this.address = ethers.utils.getAddress(blockOrAddress)
    }
    else  {
      assert(address != null)
      this.blockHeight = blockOrAddress.height
      this.address = ethers.utils.getAddress(address)
    }
  }

  async getGravatar(owner: string): Promise<[string, string]> {
    return this.call("getGravatar", [owner])
  }

  async gravatarToOwner(arg0: ethers.BigNumber): Promise<string> {
    return this.call("gravatarToOwner", [arg0])
  }

  async ownerToGravatar(arg0: string): Promise<ethers.BigNumber> {
    return this.call("ownerToGravatar", [arg0])
  }

  async gravatars(arg0: ethers.BigNumber): Promise<([owner: string, displayName: string, imageUrl: string] & {owner: string, displayName: string, imageUrl: string})> {
    return this.call("gravatars", [arg0])
  }

  private async call(name: string, args: any[]) : Promise<any> {
    const fragment = abi.getFunction(name)
    const data = abi.encodeFunctionData(fragment, args)
    const result = await this._chain.client.call('eth_call', [{to: this.address, data}, this.blockHeight])
    const decoded = abi.decodeFunctionResult(fragment, result)
    return decoded.length > 1 ? decoded : decoded[0]
  }
}

function getJsonAbi(): any {
  return [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_imageUrl",
          "type": "string"
        }
      ],
      "name": "updateGravatarImage",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "setMythicalGravatar",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getGravatar",
      "outputs": [
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "gravatarToOwner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "ownerToGravatar",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_displayName",
          "type": "string"
        }
      ],
      "name": "updateGravatarName",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_displayName",
          "type": "string"
        },
        {
          "name": "_imageUrl",
          "type": "string"
        }
      ],
      "name": "createGravatar",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "gravatars",
      "outputs": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "displayName",
          "type": "string"
        },
        {
          "name": "imageUrl",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "displayName",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "imageUrl",
          "type": "string"
        }
      ],
      "name": "NewGravatar",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "displayName",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "imageUrl",
          "type": "string"
        }
      ],
      "name": "UpdatedGravatar",
      "type": "event"
    }
  ]
}
