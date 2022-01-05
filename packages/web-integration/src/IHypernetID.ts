import {
	CustomerLinkId,
	IdentityToken,
	MintedIdentityToken,
} from "@hypernetlabs/hypernet-id-objects";
import {
	EthereumAccountAddress,
	ChainId,
	AjaxError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IHypernetID {
	/**
	 * Returns the IdentityToken that would be published by the system on any chain.
	 * This is chain agnostic, but does not guarantee that the identity token actually
	 * exists on any particular chain. It is most useful for getting an easy summary of
	 * what Hypernet.ID knows about the account, and not where this summary is available
	 * for use by any particular DApp.
	 * @param accountAddress
	 * @returns An IdentityToken object. It may be completely blank if Hypernet.ID has not interacted with that account previously.
	 */
	getIdentityTokenForAccount(
		accountAddress: EthereumAccountAddress,
	): ResultAsync<IdentityToken, AjaxError>;

	/**
	 * This method is used to verify the presence of an identity token for an account address
	 * on a particular chain. This is most useful for verifying if your DApp will be
	 * able to use the token for the account on whatever chain you are deploying to.
	 * It does provide any assurances about whether or not Hypernet.ID knows anything about
	 * the requested account, only whether or not a token has been minted on chain for the account.
	 * If you just want to know if Hypernet.ID knows about the account, use getIdentityTokenForAccount.
	 * @param accountAddress
	 * @param chainId
	 * @returns An IdentityToken object or null, if the token has not been minted on the requested chain.
	 */
	getIdentityTokenForAccountOnChain(
		accountAddress: EthereumAccountAddress,
		chainId: ChainId,
	): ResultAsync<MintedIdentityToken | null, AjaxError>;

	/**
	 * Returns a URL object that will send the user through the Hypernet.ID flow.
	 * You can either have the user click on the URL or issue a redirect. Hypernet.ID
	 * will redirect the user back to the configured destination at the end of the
	 * flow. Of course, if the user has already completed the flow, they will be
	 * redirected immediately. You can prevent this by using getIdentityTokenForAccount()
	 * first, to see if Hypernet.ID has already interacted with the user.
	 * @param linkId Also called the Campaign ID.
	 * @returns a URL object with the redirect URL for your link.
	 */
	getRedirectUrl(linkId: CustomerLinkId): ResultAsync<URL, never>;
}
