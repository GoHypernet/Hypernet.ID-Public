import { Readable } from "stream";

import {
	UUID,
	AjaxError,
	JsonWebToken,
	EmailAddressString,
	EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { IAjaxUtils, AxiosAjaxUtils } from "@hypernetlabs/utils";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { okAsync, ResultAsync } from "neverthrow";

import { defaultApiBaseUrl } from "@corporate-integration/configuration";
import {
	IHypernetCorporateIntegration,
	IHypernetCorporateIntegrationConfig,
	NFTMetadata,
} from "@corporate-integration/IHypernetCorporateIntegration";

export class HypernetCorporateIntegration
	implements IHypernetCorporateIntegration
{
	protected ajaxUtils: IAjaxUtils;
	protected apiBaseUrl = defaultApiBaseUrl;
	protected token: JsonWebToken | null = null;
	protected tokenExpiration = 0;

	constructor(
		protected corporateId: UUID,
		protected corporateSecret: string,
		protected config?: IHypernetCorporateIntegrationConfig,
	) {
		this.ajaxUtils = new AxiosAjaxUtils();

		if (config?.apiBaseUrl != null) {
			this.apiBaseUrl = config.apiBaseUrl;
		}
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
		imageFileName: string | null,
		animationFileName: string | null,
	): ResultAsync<UUID, AjaxError> {
		return this.setCorporateAuthenticationToken().andThen(() => {
			const requestUrl = new URL(
				`${this.apiBaseUrl}/collections/${collectionId}/nfts`,
			);
			return this.ajaxUtils
				.post<{ nftId: UUID }>(requestUrl, {
					metadata,
					identityId,
					emailAddress,
					accountAddress,
					imageFileName,
					animationFileName,
				})
				.map((result) => {
					return result.nftId;
				});
		});
	}

	protected setCorporateAuthenticationToken(): ResultAsync<void, AjaxError> {
		if (this.getTokenRequired()) {
			const requestUrl = new URL(`${this.apiBaseUrl}/token`);

			return this.ajaxUtils
				.post<{
					token: JsonWebToken;
				}>(requestUrl, {
					corporateId: this.corporateId,
					corporateSecret: this.corporateSecret,
				})
				.map((result) => {
					this.token = result.token;
					const decoded = jwt_decode<JwtPayload>(this.token);
					this.tokenExpiration = decoded.exp as number;
					this.ajaxUtils.setDefaultToken(this.token);
				});
		}

		return okAsync(undefined);
	}

	protected getUploadLink(
		collectionId: UUID,
		fileName: string,
	): ResultAsync<string, AjaxError> {
		const requestUrl = new URL(
			`${this.apiBaseUrl}/collections/${collectionId}/files/upload?fileName=${fileName}`,
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

	protected getTokenRequired() {
		// tokenExpiration - 10 Minutes < Now
		return (
			this.token == null ||
			(this.token != null && this.tokenExpiration - 600000 < Date.now())
		);
	}
}
