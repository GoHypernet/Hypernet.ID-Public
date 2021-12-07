# What is a crypto wallet?

A crypto wallet (also commonly referred to as a digital wallet), is a piece of software that lets you interact with your digital assets on the blockchain. The wallet does this through the use of public-key cryptography technology to generate account addresses.

Nearly all consumer crypto wallets on the market today are Heirarchical Deterministic (HD) wallets. This means that when you set up a new crypto wallet, it produces, in a mathematically secure fashion, a human-readable secret recovery phrase (also known as a mnemonic or seed phrase) that itself is then used to algorithmically generate a deterministic sequence of account addresses, each account having its own public-private key pair. It is these addresses themselves (along with signatures generated from their private keys) that are used to prove ownership of digital assets on the blockchain. Your secret recovery phrase can be used to regenerate your accounts and the accounts’ public-private key pairs by importing the seed into a new wallet software application.

**WARNING**: Store your seed phrase somewhere secure to recover your accounts in case of an emergency and keep the private keys it generates **private**; Hypernet.ID will **never** ask you for your private keys or seed phrase and you should **never** reveal them to any third party, **ever**.

Cypto wallets currently take two main form-factors: browser extensions and mobile apps.

Browser-based wallets are distributed as browser extensions and are usually compatible with most popular web browsers (i.e. Chrome, Firefox, Edge, etc). These wallets are installed in your browser environment; they are not native applications and they cannot access your computer’s underlying operating system. Some of the more popular browser extension wallets include:

* [Metamask](https://metamask.io)
* [Coinbase Wallet](https://wallet.coinbase.com)

![](https://paper-attachments.dropbox.com/s\_AEFE60B34D5410D0B0116C7A25499E964588F53C8AC0F54224AF5B2651B003D4\_1637454054285\_Hypernet-ID-Install-Metamask.gif)

A mobile-based wallet is installed on your smart phone as a native app. Mobile wallets are popular due to their portability and due to the fact that they can still be used with web-based dApps, typically by scanning a QR-code displayed on screen. Some of the most popular and trusted mobile wallets include:

* Metamask
* [Trust Wallet](https://trustwallet.com)
* Coinbase Wallet

![](https://paper-attachments.dropbox.com/s\_AEFE60B34D5410D0B0116C7A25499E964588F53C8AC0F54224AF5B2651B003D4\_1637455824072\_Hypernet-ID-web-browser-wallet-connect.gif)

![](https://paper-attachments.dropbox.com/s\_AEFE60B34D5410D0B0116C7A25499E964588F53C8AC0F54224AF5B2651B003D4\_1637460973079\_Hypernet-ID-wallet-connect.gif)

**Why does Hypernet.ID ask me account to** **“sign”** **something through my wallet?**

![](https://paper-attachments.dropbox.com/s\_AEFE60B34D5410D0B0116C7A25499E964588F53C8AC0F54224AF5B2651B003D4\_1637445802173\_image.png)

Hypernet.ID requires that you prove that you hold the private keys belonging to the account you are connecting. This proof is done by having your wallet software digitally sign our message with your account’s private key; you never reveal your private key, only the signature it produces. Your account’s digital signature is practically impossible to fake and can be cryptographically linked to your publicly known account address.
