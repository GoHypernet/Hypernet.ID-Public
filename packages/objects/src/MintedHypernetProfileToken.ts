import {
	ChainId,
	EthereumAccountAddress,
	RegistryTokenId,
} from "@hypernetlabs/objects";

import { HypernetProfileToken } from "@objects/HypernetProfileToken";

export class MintedProfileToken extends HypernetProfileToken {
	public constructor(
		public tokenId: RegistryTokenId,
		public chainId: ChainId,
		ownerAddress: EthereumAccountAddress,
		username: string,
		content: string, // TODO: This is JSON data, we should make seperate parsed fields for this.
	) {
		super(ownerAddress, username, content);
	}
}
