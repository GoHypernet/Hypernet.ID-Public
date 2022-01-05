import { EthereumAccountAddress } from "@hypernetlabs/objects";

export class HypernetProfileToken {
	public constructor(
		public ownerAddress: EthereumAccountAddress,
		public username: string,
		public content: string, // TODO: This is JSON data, we should make seperate parsed fields for this.
	) {}
}
