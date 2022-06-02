# Corporate Integration

This package provides an SDK for corporates of Hypernet.Mint to upload their NFT assets and create the NFTs on the system, so that they could be minted later. 

### Installation

install via yarn
`yarn add @hypernetlabs/hypernet-id-corporate-integration`

install via npm
`npm install @hypernetlabs/hypernet-id-corporate-integration`

### How to integrate

1. First, create an instance of HypernetCorporateIntegration

```js
import { HypernetCorporateIntegration } from "@hypernetlabs/hypernet-id-corporate-integration";

const corporateId = "YOUR_CORPORATE_ID";
const corporateSecret = "YOUR_CORPORATE_SECRET";

const hypernetCorporateIntegration = new HypernetCorporateIntegration(
  corporateId,
  corporateSecret
);
```

2. Then, upload an image. We will pin that image to IPFS.

```js
const collectionId = "YOUR_COLLECTION_ID";
const image = "BUFFER_TO_UPLOAD"

await hypernetCorporateIntegration.uploadFileToCollection(
  collectionId,
  image,
  "image_file_name.jpg"
);
```

3. Create an NFT as shown. Your NFT should have a unique file name in a collection, and the NFT will be linked to the pinned image by the given file name.
    - If identity is provided, NFT will be minted to the account address of the identity.
    - An identity could be linked to multiple account addresses. Provided account address will be used for minting, otherwise the first found identity's accound address will be used.
    - Identity and account address could be null in that step. In that case email adress should be provided. An email will be sent to that address, which will redirects users to Hypernet.Mint to claim their created NFTs.

```js
const collectionId = "YOUR_COLLECTION_ID";
const identityId = "RECEIVER_IDENTITY_ID" | null;
const emailAddress = "RECEIVER_EMAIL_ADDRESS" | null;
const accountAddress = "RECEIVER_ACCOUNT_ADDRESS" | null;
const metadata = { key: "value" };

await hypernetCorporateIntegration.createNFTInCollection(
  collectionId,
  metadata,
  identityId,
  emailAddress,
  accountAddress,
  "image_file_name.jpg",
  null
);
```
