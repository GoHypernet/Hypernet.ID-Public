import { Brand, make } from "ts-brand";

export type ReferralLinkId = Brand<number, "ReferralLinkId">;
export const ReferralLinkId = make<ReferralLinkId>();
