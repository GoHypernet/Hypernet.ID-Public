import {
	UnixTimestamp,
	CountryCode,
	EthereumAccountAddress,
	RegistryTokenId,
	ChainId,
} from "@hypernetlabs/objects";

import { IdentityToken } from "@objects/IdentityToken";

export class MintedIdentityToken extends IdentityToken {
	public constructor(
		public tokenId: RegistryTokenId,
		public chainId: ChainId,
		ownerAddress: EthereumAccountAddress,
		timestamp: UnixTimestamp,
		countryCode: CountryCode,
		email: boolean,
		firstName: boolean,
		lastName: boolean,
		birthday: boolean,
		placeOfBirth: boolean,
		mailingAddress: boolean,
		residenceAddress: boolean,
		passport: boolean,
		drivingLicense: boolean,
		visa: boolean,
		nationalId: boolean,
		consularId: boolean,
		electoralId: boolean,
		residentPermitId: boolean,
		taxId: boolean,
		studentId: boolean,
		passportCard: boolean,
		militaryId: boolean,
		publicSafetyId: boolean,
		healthId: boolean,
		taxEssentials: boolean,
		socialSecurityNumber: boolean,
		taxNumber: boolean,
		naturalPersonsRegister: boolean, // CPF
		generalRegistrationNumber: boolean,
		voterIdNumber: boolean,
		issuingNumber: boolean,
		gender: boolean,
		nationality: boolean,
		livenessImage: boolean,
		motherName: boolean,
		fatherName: boolean,
		verifiedInvestor: boolean,
		underSanctions: boolean,
		activeScreening: boolean,
	) {
		super(
			ownerAddress,
			timestamp,
			countryCode,
			email,
			firstName,
			lastName,
			birthday,
			placeOfBirth,
			mailingAddress,
			residenceAddress,
			passport,
			drivingLicense,
			visa,
			nationalId,
			consularId,
			electoralId,
			residentPermitId,
			taxId,
			studentId,
			passportCard,
			militaryId,
			publicSafetyId,
			healthId,
			taxEssentials,
			socialSecurityNumber,
			taxNumber,
			naturalPersonsRegister,
			generalRegistrationNumber,
			voterIdNumber,
			issuingNumber,
			gender,
			nationality,
			livenessImage,
			motherName,
			fatherName,
			verifiedInvestor,
			underSanctions,
			activeScreening,
		);
	}
}