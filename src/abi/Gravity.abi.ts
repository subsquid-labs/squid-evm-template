export const ABI_JSON = [
    {
        "type": "function",
        "name": "updateGravatarImage",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "_imageUrl"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMythicalGravatar",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getGravatar",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "owner"
            }
        ],
        "outputs": [
            {
                "type": "string"
            },
            {
                "type": "string"
            }
        ]
    },
    {
        "type": "function",
        "name": "gravatarToOwner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "ownerToGravatar",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address"
            }
        ],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "updateGravatarName",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "_displayName"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "createGravatar",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "_displayName"
            },
            {
                "type": "string",
                "name": "_imageUrl"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "gravatars",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "owner"
            },
            {
                "type": "string",
                "name": "displayName"
            },
            {
                "type": "string",
                "name": "imageUrl"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewGravatar",
        "inputs": [
            {
                "type": "uint256",
                "name": "id",
                "indexed": false
            },
            {
                "type": "address",
                "name": "owner",
                "indexed": false
            },
            {
                "type": "string",
                "name": "displayName",
                "indexed": false
            },
            {
                "type": "string",
                "name": "imageUrl",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "UpdatedGravatar",
        "inputs": [
            {
                "type": "uint256",
                "name": "id",
                "indexed": false
            },
            {
                "type": "address",
                "name": "owner",
                "indexed": false
            },
            {
                "type": "string",
                "name": "displayName",
                "indexed": false
            },
            {
                "type": "string",
                "name": "imageUrl",
                "indexed": false
            }
        ]
    }
]
