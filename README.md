# Example tbdex remittance mock PFI servers

This is an example project that mocks 5 PFI servers using the tbdex protocol.

Currently mocks five PFI servers and can be extended.

This example includes:

* A server which does a sanctions check on the customer and issues a verifiable credential only if they are not on a sanctions list.
* Five mock PFIs (participating financial institutions) that implement tbDEX.

See [main.ts](src/main.ts) for the liquidity node code (server).

NOTE: this is not using market rates, or anything sensible, and is not intended to showcase all regulatory requirements that must be fulfilled. This is for illustrative purposes only, not production use.
For a more general exemplar for a PFI liquidity node, please take a look at: https://github.com/TBD54566975/tbdex-pfi-exemplar/ (which also includes a database, this one does not).


# Development Prerequisites

## `node` and `npm`
This project is using `node v20.3.1` and `npm >=v7.0.0`. You can verify your `node` and `npm` installation via the terminal:

```
$ node --version
v20.3.1
$ npm --version
9.6.7
```

If you don't have `node` installed, feel free to choose whichever installation approach you feel the most comfortable with. If you don't have a preferred installation method, we recommend using `nvm` (aka node version manager). `nvm` allows you to install and use different versions of node. It can be installed by running `brew install nvm` (assuming that you have homebrew)

Once you have installed `nvm`, install the desired node version with `nvm install vX.Y.Z`.


## Step 0: Setup server

(you only need to do this step once).

> 💡 Make sure you have all the [prerequisites](#development-prerequisites)

Install dependencies

```npm install```

## Step 1: Run liquidity nodes (servers)

Run the servers (or restart them) in another terminal window:

`npm run server`

# Implementing a PFI

The business logic for the PFI is mainly in [main.ts](src/main.ts) and the offerings as specified in [offerings.ts](src/offerings.ts). Each server port is also set up in [config.ts](src/config.ts). Poke around!

Each interaction happens in the context of an "Exchange" which is a record of the interaction between the customer and the PFI.


# Configuration
Configuration can be set using environment variables. Defaults are set in `src/config.ts`



# Project Resources

| Resource                                   | Description                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| [CODEOWNERS](./CODEOWNERS)                 | Outlines the project lead(s)                                                   |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | Expected behavior for project contributors, promoting a welcoming environment |
| [CONTRIBUTING.md](./CONTRIBUTING.md)       | Developer guide to build, test, run, access CI, chat, discuss, file issues     |
| [GOVERNANCE.md](./GOVERNANCE.md)           | Project governance                                                             |
| [LICENSE](./LICENSE)                       | Apache License, Version 2.0                                                    |


### Provided offerings
- GHS to USDC
- NGN to KES
- KES to USD
- USD to KES
- KES to USDC
- KES to USD
- NGN to GHS
- BTC to NGN
- USD to EUR
- EUR to USD
- USD to GBP
- USD to BTC
- EUR to USD
- EUR to USDC
- USD to EUR
- EUR to GBP
- USD to AUD
- USD to GBP
- USD to KES
- USD to MX