# Hypernet.ID NFT Specification

## High Level ID Verification Encoding Schema

Each Hypernet.ID NFT encodes the presence of PII, [country code](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes), and verification time stamp in the `tokenURI` field as follows:

```
tokenURI ->
[00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000]
 |______________________________________________________________||______________||______________________________________________|
                                ||                                      ||                             ||
                            64 PII booleans                         16 bits ISO               48 bits UNIX timestamp
                                                                   3166-1 country
                                                                        code
```

Be aware that the `tokenURI` field is a UTF-8 string, therefor this bit field is encoded as such before being written to the blockchain. 
Therefore, once you have decided on the fields you require for interaction with your protocol, you should encode them as a UTF-8 string 
and use the 
[`_fromTokenURIToBytes8`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L85) 
function to set the [`CRITERIA`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/contracts-integration/contracts/ID.sol#L10) 
variable. Check out the [contract integration](/packages/contracts-integration/README.md#usage) documentation for more details.

## PII Bit Field Allocation

The bit-level layout for the 64 PII booleans is as follows:

* Bit 1: Email
* Bit 2: First Name
* Bit 3: Last Name
* Bit 4: Date of Birth
* Bit 5: Place Of Birth
* Bit 6: Address (mailing) [Not Supported]
* Bit 7: Address (residence)
* Bit 8: Passport
* Bit 9: Driving License
* Bit 10: VISA
* Bit 11: National ID
* Bit 12: Consular ID
* Bit 13: Electoral ID
* Bit 14: Resident Permit ID
* Bit 15: Tax ID
* Bit 16: Student ID
* Bit 17: Passport Card
* Bit 18: Military ID
* Bit 19: Public Safety ID
* Bit 20: Health ID
* Bit 21: Essential Tax Information
* Bit 22: SSN (US only) 
* Bit 23: Tax number from Health ID or Tax ID document (Italy only)
* Bit 24: CPF (Brazil Only)
* Bit 25: General Registration number (Brazil only)
* Bit 26: Voter ID number (Mexico only)
* Bit 27: Issuing Number (Mexico Only)
* Bit 28: Gender
* Bit 29: Nationality (i.e. citizenship)
* Bit 30: Liveness Image
* Bit 31: Mother's Name
* Bit 32: Father's Name
* Bit 33: Verified Investor
* Bit 34: Under Sanctions
* Bit 35: Active User/Actively Screened
* Bit 36-64: Reserved for future use
