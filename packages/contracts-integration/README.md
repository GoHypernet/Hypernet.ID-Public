# Smart Contract Integration

Hypernet.ID mints Non-Fungible Token assets directly to a user's account on the blockchain. This package allows 
protocol developers to gate access to their protocol by requiring that an account own a Hypernet.ID NFT and that 
it indicates the user has met certain identity check criteria. 

Currently, the Hypernet.ID smart contracts are only deployed to the Rinkeby Testnet, therefore only smart contracts
on that network can directly query a user's verification status. As Hypernet.ID deploys to other EVM-compatible 
blockchains, this package will detail how to use this smart contract library's modifiers to protect your protocol's
public and external functions. 

## Hypernet.ID Registry Chain Addresses

- Rinkeby (chainid 4): [`0x8E92D1D990E36e00Af533db811Fc5C342823C817`](https://rinkeby.etherscan.io/address/0x8E92D1D990E36e00Af533db811Fc5C342823C817)

## Installation

Hypernet.ID publishes a helper contract, 
[`ID.sol`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol), 
that you can inherit in your own smart contract to protect public and external functions from being accessed by users 
who have not undergone sufficient identity verification. This allows for id verification to be enforced at the protocol 
level so that it cannot be circumvented. To install Hypernet.ID's helper contracts in your project run:

```
npm install --sav-dev @hypernetlabs/hypernet-id-contracts-integration
```

## Usage

Protecting your smart contract's external and public functions from unverified accounts simply requries that they be 
decorated with one of the following modifiers defined in `ID.sol`.

- [`onlyVerified`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L32): Simply checks that the [`msg.sender`](https://docs.soliditylang.org/en/v0.8.10/structure-of-a-contract.html?highlight=msg.sender#function-modifiers) owns a Hypernet.ID NFT but does not check that any specific id checks were performed. This is the most gas effient modifier.
- [`onlyVerifiedWithCriteria`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L13): Checks that the `msg.sender` owns a Hypernet.ID NFT and that its owner has met the id checks specified in `CRITERIA`. This is the most gas expensive modifer.
- [`onlyVerifiedTokenWithCriteria`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L22): Checks that the `msg.sender` owns a Hypernet.ID NFT and that its owner has met the id checks specified in `CRITERIA`. This is about 12% cheaper to call than `onlyVerifiedWithCriteria` but requires than a `tokenid` be given as an argument.

You can see a simple yet complete example of how to use `ID.sol` 
[here](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/Test.sol). In order to gate on specific
id verification criteria, you must set the [`CRITERIA`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L10) 
variable appropriately. An example of how to do this can be seen in the contstructor of `Test.sol`. Additionally, since Hypernet.ID maintains id registries 
on multiple chains, you must be sure to set the [`registryAddress`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L9) 
variable to one address appropriate for your target network (i.e. Rinkeby, Mainnet, Avalanche, Polygon, etc.). 
