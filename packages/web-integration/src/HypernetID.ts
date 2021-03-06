import {
	ReferralLinkId,
	IdentityToken,
	MintedIdentityToken,
} from "@hypernetlabs/hypernet-id-objects";
import {
	UUID,
	EthereumAccountAddress,
	ChainId,
	AjaxError,
} from "@hypernetlabs/objects";
import { IAjaxUtils, AxiosAjaxUtils } from "@hypernetlabs/utils";
import { injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { appBaseUrl, apiBaseUrl } from "@web-integration/configuration";
import { IHypernetID } from "@web-integration/IHypernetID";

@injectable()
export class HypernetID implements IHypernetID {
	protected ajaxUtils: IAjaxUtils;
	constructor(protected customerId: UUID) {
		this.ajaxUtils = new AxiosAjaxUtils();
	}

	public getIdentityTokenForAccount(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<IdentityToken, AjaxError> {
		const requestUrl = new URL(`${apiBaseUrl}/address/${accountAddress}`);
		return this.ajaxUtils.get<IdentityToken>(requestUrl);
	}

	public getIdentityTokenForAccountOnChain(
		accountAddress: EthereumAccountAddress,
		chainId: ChainId,
	): ResultAsync<MintedIdentityToken | null, AjaxError> {
		const requestUrl = new URL(
			`${apiBaseUrl}/address/${accountAddress}/chain/${chainId}`,
		);
		return this.ajaxUtils
			.get<{
				mintedIdentityToken: MintedIdentityToken | null;
			}>(requestUrl)
			.map((result) => {
				return result.mintedIdentityToken;
			});
	}

	public getRedirectUrl(linkId: ReferralLinkId): ResultAsync<URL, never> {
		return okAsync(new URL(`${appBaseUrl}/?referralLinkId=${linkId}`));
	}
}
