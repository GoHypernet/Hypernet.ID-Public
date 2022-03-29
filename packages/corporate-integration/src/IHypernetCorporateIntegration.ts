import {
	AjaxError,
	UUID,
	EmailAddressString,
	EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface NFTMetadata {
	[x: string]: string;
}

export interface IHypernetCorporateIntegration {
	/**
	 * This method uploads a file to a collection.
	 * @param collectionId
	 * @param fileBuffer
	 * @param fileName
	 */
	uploadFileToCollection(
		collectionId: UUID,
		fileBuffer: Buffer,
		fileName: string,
	): ResultAsync<void, AjaxError>;

	/**
	 * This method is used to create an NFT on a particular collection.
	 * @param collectionId
	 * @param nft
	 * @returns NFT ID.
	 */
	createNFTInCollection(
		collectionId: UUID,
		metadata: NFTMetadata,
		identityId: UUID | null,
		emailAddress: EmailAddressString | null,
		accountAddress: EthereumAccountAddress | null,
		imageFileame: string | null,
		animationFilename: string | null,
	): ResultAsync<UUID, AjaxError>;
}
