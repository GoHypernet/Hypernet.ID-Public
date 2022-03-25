import {
	UUID,
	AjaxError,
	JsonWebToken,
	EmailAddressString,
	EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { IAjaxUtils, AxiosAjaxUtils } from "@hypernetlabs/utils";
import { apiBaseUrl } from "@corporate-integration/configuration";
import {
	IHypernetCorporateIntegration,
	NFTMetadata,
} from "@corporate-integration/IHypernetCorporateIntegration";

import { injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { Readable } from "stream";
import jwt_decode, { JwtPayload } from "jwt-decode";

@injectable()
export class HypernetCorporateIntegration
	implements IHypernetCorporateIntegration
{
	protected ajaxUtils: IAjaxUtils;
	protected token: string | null = null;
	protected tokenExpiration: number | undefined;

	constructor(
		protected corporateId: UUID,
		protected corporateSecret: string,
	) {
		this.ajaxUtils = new AxiosAjaxUtils();
	}

	public uploadFileToCollection(
		collectionId: UUID,
		fileContent: Buffer,
		fileName: string,
	): ResultAsync<void, AjaxError> {
		return this.setCorporateAuthenticationToken().andThen(() => {
			return this.getUploadLink(collectionId, fileName)
				.andThen((url) => {
					return this.uploadFileToBucket(url, fileContent);
				})
				.map(() => {});
		});
	}

	public createNFTInCollection(
		collectionId: UUID,
		metadata: NFTMetadata,
		identityId: UUID | null,
		emailAddress: EmailAddressString | null,
		accountAddress: EthereumAccountAddress | null,
		imageFileame: string | null,
		animationFilename: string | null,
	): ResultAsync<UUID, AjaxError> {
		return this.setCorporateAuthenticationToken().andThen(() => {
			const requestUrl = new URL(
				`${apiBaseUrl}/collections/${collectionId}/nfts`,
			);
			return this.ajaxUtils
				.post<{ nftId: UUID }>(requestUrl, {
					metadata,
					identityId,
					emailAddress,
					accountAddress,
					imageFileame,
					animationFilename,
				})
				.map((result) => {
					return result.nftId;
				});
		});
	}

	protected setCorporateAuthenticationToken(): ResultAsync<void, AjaxError> {
		if (
			this.token == null ||
			(this.token != null &&
				(this.tokenExpiration == null ||
					this.tokenExpiration < Date.now()))
		) {
			const requestUrl = new URL(`${apiBaseUrl}/token`);

			return this.ajaxUtils
				.post<{
					token: JsonWebToken;
				}>(requestUrl, {
					corporateId: this.corporateId,
					corporateSecret: this.corporateSecret,
				})
				.map((result) => {
					const token = result.token;
					const decoded = jwt_decode<JwtPayload>(token);

					this.tokenExpiration = decoded.exp;
					this.token = token;

					this.ajaxUtils.setDefaultToken(token);
				});
		}

		return okAsync(undefined);
	}

	protected getUploadLink(
		collectionId: UUID,
		fileName: string,
	): ResultAsync<string, AjaxError> {
		const requestUrl = new URL(
			`${apiBaseUrl}/collections/${collectionId}/files/upload?fileName=${fileName}`,
		);

		return this.ajaxUtils
			.post<{
				uploadUrl: string;
			}>(requestUrl, {
				fileName,
				collectionId,
			})
			.map((result) => {
				return result.uploadUrl;
			});
	}

	protected uploadFileToBucket(
		uploadUrl: string,
		fileBuffer: Buffer,
	): ResultAsync<void, AjaxError> {
		const requestUrl = new URL(uploadUrl);
		const stremReadable = Readable.from(fileBuffer);

		return this.ajaxUtils
			.put<{
				uploadUrl: string;
			}>(requestUrl, stremReadable, {
				headers: {
					"Content-Type": "application/octet-stream",
				},
			})
			.map(() => {});
	}
}
