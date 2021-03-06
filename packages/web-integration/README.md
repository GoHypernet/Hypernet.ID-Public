# Web Integration

## How It Works
This package provides a convienient entry point for integrating with Hypernet.ID in web-based applications (like a 
dApp or traditional webapp). It exports the HypernetID class, which you will need to instantiate with your Customer 
ID (don't worry, that is public information). Hypernet.ID has a variety of useful methods available, but for the simplest 
possible integration, you can make use of just a few.

## Installation

In order to use Hypernet.ID's web integration package, add it to your project's dependency list:

```
npm install @hypernetlabs/hypernet-id-web-integration
```

## Useful API calls

The Hypernet.ID npm package is a ultra-lightweight convenience layer for interfacing the the Hypernet.ID service. 
Below are function calls for performing the most important tasks when attesting a user's identity and determining 
if they need to be sent to Hypernet.ID for identity verification.

### [`getIdentityTokenForAccount()`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/web-integration/src/IHypernetID.ts#L22)

This method takes an ethereum account address that you have collected and returns the "hypothetical" Identity 
Token that Hypernet.ID would mint to any particular chain. Hypernet.ID actually may have minted it already, 
but this method won't tell you that.

### [`getIdentityTokenForAccountOnChain()`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/web-integration/src/IHypernetID.ts#L37)

This method is similar to the above but also takes a Chain ID. It will return the actual token that was minted 
on the requested chain, or null if no token was minted. This is not a good way to figure out if Hypernet.ID knows 
anything about the account in question, though, since there is no guarantee that every Identity gets a token on 
every chain. Use getIdentityTokenForAccount() to verify whether or not Hypernet.ID knows about the account at all.

### [`getRedirectUrl()`](https://github.com/GoHypernet/Hypernet.ID-Public/blob/develop/packages/web-integration/src/IHypernetID.ts#L52)

Returns a URL object that you can direct your user to in order to complete the Hypernet.ID onboarding flow. At 
the completion of that flow, the user will be redirected back to your pre-configured destination.
