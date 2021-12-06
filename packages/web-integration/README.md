# web-integration

This package provides a convienient entry point for integrating with Hypernet.ID in web-based applications. It exports the HypernetID class, which you will need to instantiate with your Customer ID (don't worry, that is public information). HypernetID has a variety of useful methods on it, but the the simplest possible integration, you can make use of just a few.

## getIdentityTokenForAccount()

This method takes an ethereum account address that you have collected and returns the "hypothetical" Identity Token that Hypernet.ID would mint to any particular chain. Hypernet.ID actually may have minted it already, but this method won't tell you that.

## getIdentityTokenForAccountOnChain()

This method is similar to the above but also takes a Chain ID. It will return the actual token that was minted on the requested chain, or null if no token was minted. This is not a good way to figure out if Hypernet.ID knows anything about the account in question, though, since there is no guarantee that every Identity gets a token on every chain. Use getIdentityTokenForAccount() to verify whether or not Hypernet.ID knows about the account at all.

## getRedirectUrl()

Returns a URL object that you can direct your user to in order to complete the Hypernet.ID onboarding flow. At the completion of that flow, the user will be redirected back to your pre-configured destination.

# Publishing

Publishing is easy, just use the standard Yarn publish command.
`yarn publish`
