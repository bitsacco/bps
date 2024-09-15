# Bitsacco PFI selector

This is a proof of concept for selection patterns between several mock PFIs offering similar onramp/offramp swaps for Bitsacco.
Fork of [tbdex-mock-pfis](https://github.com/bitsacco/tbdex-mock-pfis.git)

## Bitsacco use case

At Bitsacco, we are interested on BTC/KES liquidity pairings offered by a selected set of diverse PFIs. Having multiple PFI is a good way to scale for our client liquidity needs. It also enables redundancy and resilience in swap channels.

## Run the Server

Install and run the server

```npm install && npm run server```

## Use the CLI Wallet

We've built a simple command line wallet to interact with the server.
With a running server, you can test the api from the command line.

```npm run cli```

## Considerations

In order of priority, our design considerations were the following:

- **Optionality**: Bitsacco should connect to one or more PFIs offering BTC/KES liquidity swaps.
- **Efficiency**: Bitsacco should select PFI and execute a swap with any PFI offering the best swap with considerations for:
  - **Price**: Price should be the best price offered by the PFI.
  - **Liquidity**: Liquidity should be the best liquidity offered by the PFI.
  - **Time**: Time should be the best time offered by the PFI.
- **Resiliency**: Bitsacco should handle failures in the PFI network.

Additional considerations were:

- **CustomerManagement**: Bitsacco should be able to manage customer accounts.
- **CustomerSatisfaction**: Bitsacco should be able to provide customer satisfaction.
