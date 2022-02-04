# Smart Contract Integration

## How It Works
[Hypernet.ID](https://hypernet.id/) mints Non-Fungible Token assets directly to a user's account on the blockchain. 
This package allows protocol developers to gate access to their protocol by requiring that an account own a Hypernet.ID 
NFT and that it indicates the user has met certain identity check criteria. 

The `tokenURI` field of each Hypernet.ID NFT contains a bit field that indicates what Personally Identifying Information (PII) 
the user presented during their identity verification screening, what country code they were verified under, and the timestamp
of when they passed the screening. This bitmap only indicates the PII was presented and passed verification checks; no PII is 
actually written to the blockchain. See the full [NFT specification](/packages/developer-docs/token-specification.md) for details.

**NOTE**: In order to adhere to the specification of the [EIP721](https://eips.ethereum.org/EIPS/eip-721) standard, the Hypernet.ID 
bit field is encoded as a UTF-8 string. The smart contract integration package handles conversion from UTF-8 to bits for you.

## Hypernet.ID Registry Chain Addresses
Currently, the Hypernet.ID smart contract registries are only deployed to testnet environments. Therefor, only smart contracts
on these networks can directly query a user's verification status. As Hypernet.ID deploys to other 
[EVM-compatible](https://ethereum.org/en/developers/docs/evm/) blockchains, this section will list the offical contract 
addresses that Hypernet.ID administers. 

### Rinkeby (chainid: 4)
[`0x8E92D1D990E36e00Af533db811Fc5C342823C817`](https://rinkeby.etherscan.io/address/0x8E92D1D990E36e00Af533db811Fc5C342823C817)

### Polygon Mainnet (chainid: 137)

[`0x267F7bE23760743f0e415A28f56dA5129EA11AA9`](https://polygonscan.com/address/0x267F7bE23760743f0e415A28f56dA5129EA11AA9)

### Mumbai (chainid: 80001)
[`0x398c52D8599B78bB1CeAe56532DDBf683433EC3f`](https://mumbai.polygonscan.com/address/0x398c52D8599B78bB1CeAe56532DDBf683433EC3f)

### Avalanche Mainnet (chainid: 43114)

[`0x70f622E02b96c498c6266eA6C96327160A21263b`](https://snowtrace.io/address/0x70f622E02b96c498c6266eA6C96327160A21263b)

### Fuji (chainid: 43113)
[`0x70f622E02b96c498c6266eA6C96327160A21263b`](https://testnet.avascan.info/blockchain/c/address/0x70f622E02b96c498c6266eA6C96327160A21263b)

## Installation
Hypernet.ID publishes a helper contract, 
[`ID.sol`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol), 
as an [NPM](https://www.npmjs.com/package/@hypernetlabs/hypernet-id-contracts-integration) package that you can inherit in your 
own smart contract to protect public and external functions from being accessed by users who have not undergone sufficient identity 
verification. This allows for id verification to be enforced at the protocol level so that it cannot be circumvented. To install 
Hypernet.ID's helper contracts in your project run:

```
npm install --sav-dev @hypernetlabs/hypernet-id-contracts-integration
```

## Usage
Protecting your smart contract's external and public functions from unverified accounts simply requries that they be 
decorated with one of the following modifiers defined in `ID.sol`.

- [`onlyVerified`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L32): Simply checks that the [`msg.sender`](https://docs.soliditylang.org/en/v0.8.10/structure-of-a-contract.html?highlight=msg.sender#function-modifiers) owns a Hypernet.ID NFT but does not check that any specific id checks were performed. This is the most gas effient modifier.
- [`onlyVerifiedWithCriteria`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L13): Checks that the `msg.sender` owns a Hypernet.ID NFT and that its owner has met the id checks specified in `CRITERIA`. This is the most gas expensive modifer.
- [`onlyVerifiedTokenWithCriteria`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L22): Checks that the `msg.sender` owns a Hypernet.ID NFT and that its owner has met the id checks specified in `CRITERIA`. This is about 12% cheaper to call than `onlyVerifiedWithCriteria` but requires that a `tokenid` be given as an argument.

You can see a simple yet complete example of how to use `ID.sol` 
[here](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/Test.sol). In order to gate on specific
id verification criteria, you must set the [`CRITERIA`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L10) 
variable appropriately. An example of how to do this can be seen in the [constructor of `Test.sol`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/Test.sol#L15). 
Additionally, since Hypernet.ID maintains id registries on multiple chains, you must be sure to set the 
[`registryAddress`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L9) 
variable to the requisite address for your target network (i.e. Rinkeby, Mainnet, Avalanche, Polygon, etc.). 
