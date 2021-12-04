import { Brand, make } from "ts-brand";

export type CustomerLinkId = Brand<number, "CustomerLinkId">;
export const CustomerLinkId = make<CustomerLinkId>();
