# Smart Contract Integration

Hypernet.ID mints Non-Fungible Token assets directly to a user's account on the blockchain. This package allows 
protocol developers to gate access to their protocol by requiring that an account own a Hypernet.ID NFT and that 
it indicates the user has met certain identity check criteria. 

Currently, the Hypernet.ID smart contracts are only deployed to the Rinkeby Testnet, therefor only smart contracts
on that network can directly query a user's verification status. As Hypernet.ID deploys to other EVM-compatible 
blockchains, this package will detail how to use this smart contract library's modifiers to protect your protocols
public and external functions. 
