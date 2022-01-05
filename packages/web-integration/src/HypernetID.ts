import {
	CustomerLinkId,
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
		const requestUrl = new URL(
			`${apiBaseUrl}/public/identitytoken?address=${accountAddress}`,
		);
		return this.ajaxUtils.get<IdentityToken>(requestUrl);
	}

	public getIdentityTokenForAccountOnChain(
		accountAddress: EthereumAccountAddress,
		chainId: ChainId,
	): ResultAsync<MintedIdentityToken | null, AjaxError> {
		const requestUrl = new URL(
			`${apiBaseUrl}/public/identitytoken?address=${accountAddress}&chainid=${chainId}`,
		);
		return this.ajaxUtils.get<MintedIdentityToken | null>(requestUrl);
	}

	public getRedirectUrl(linkId: CustomerLinkId): ResultAsync<URL, never> {
		return okAsync(new URL(`${appBaseUrl}/?campaignid=${linkId}`));
	}
}
