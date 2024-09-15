import { randomBytes } from 'crypto'
import { BearerDid } from '@web5/dids'
import { PresentationExchange } from '@web5/credentials'
import { OfferingsApi, Offering, OfferingData } from '@tbdex/http-server'
import { issuerDid } from './credential-issuer.js'
import { config } from './config.js'

// load issuer's did from a file called issuer-did.txt
const issuer = issuerDid


export const offeringDataKESToBTC: OfferingData = {
  description: `Exchange your Kenya Shillings for Bitcoin (in sats)`,
  payoutUnitsPerPayinUnit: '11.6799',
  payout: {
    currencyCode: 'BTC',
    methods: [
      {
        kind: 'BTC_WALLET_ADDRESS',
        estimatedSettlementTime: 300, // 5 minutes in seconds
        requiredPaymentDetails: {
          '$schema': 'http://json-schema.org/draft-07/schema#',
          'title': 'BTC Required Payment Details',
          'type': 'object',
          'required': [
            'address',
          ],
          'additionalProperties': false,
          'properties': {
            'address': {
              'title': 'BTC Wallet Address',
              'description': 'Wallet address to pay out BTC to',
              'type': 'string'
            },
          }
        }
      },
    ],
  },
  payin: {
    currencyCode: 'KES',
    methods: [
      {
        kind: 'KES_MOBILE_MONEY',
        requiredPaymentDetails: {
          '$schema': 'http://json-schema.org/draft-07/schema#',
          'title': 'KES Mobile Money Payment Details',
          'type': 'object',
          'required': ['phoneNumber', 'networkProvider'],
          'additionalProperties': false,
          'properties': {
            'phoneNumber': {
              'title': 'Mobile Phone Number',
              'description': 'Mobile number registered with mobile money to pay out KES',
              'type': 'string'
            },
            'networkProvider': {
              'title': 'Mobile Money Provider',
              'description': 'Mobile money service provider for the transaction',
              'type': 'string'
            },
          }
        }
      },
    ],
  },
  requiredClaims: {
    id: '1d68ec1c-7a18-43e3-9a15-e211c8fe8346',
    format: {
      jwt_vc: {
        alg: ['ES256K', 'EdDSA']
      }
    },
    input_descriptors: [
      {
        id: 'efcd9b7c-1134-4f46-b63b-590bada959e0',
        constraints: {
          fields: [
            {
              path: ['$.type[*]'],
              filter: {
                type: 'string',
                const: 'KnownCustomerCredential',
              },
            },
            {
              path: ['$.issuer'],
              filter: {
                type: 'string',
                const: issuer,
              },
            },
          ],
        },
      },
    ],
  },
}

export const offeringDataBTCToKES: OfferingData = {
  description: `Exchange your Bitcoin (in sats) for Kenya Shillings`,
  payoutUnitsPerPayinUnit: '0.085617171',
  payout: {
    currencyCode: 'KES',
    methods: [
      {
        kind: 'KES_MOBILE_MONEY',
        estimatedSettlementTime: 300, // 5 minutes in seconds
        requiredPaymentDetails: {
          '$schema': 'http://json-schema.org/draft-07/schema#',
          'title': 'KES Mobile Money Payment Details',
          'type': 'object',
          'required': ['phoneNumber', 'networkProvider'],
          'additionalProperties': false,
          'properties': {
            'phoneNumber': {
              'title': 'Mobile Phone Number',
              'description': 'Mobile number registered with mobile money to pay out KES',
              'type': 'string'
            },
            'networkProvider': {
              'title': 'Mobile Money Provider',
              'description': 'Mobile money service provider for the transaction',
              'type': 'string'
            },
          }
        }
      },
    ],
  },
  payin: {
    currencyCode: 'BTC',
    methods: [
      {
        kind: 'BTC_LIGHTNING_ADDRESS',
        requiredPaymentDetails: {},
      },
    ],
  },
  requiredClaims: {
    id: '9ce4004c-3c38-4853-968b-e411bafcd966',
    format: {
      jwt_vc: {
        alg: ['ES256K', 'EdDSA']
      }
    },
    input_descriptors: [
      {
        id: 'ccdb9b7c-5754-4f46-b63b-590bada959e2',
        constraints: {
          fields: [
            {
              path: ['$.type[*]'],
              filter: {
                type: 'string',
                const: 'KnownCustomerCredential',
              },
            },
            {
              path: ['$.issuer'],
              filter: {
                type: 'string',
                const: issuer,
              },
            },
          ],
        },
      },
    ],
  },
}

const customOfferings = [
  { data: { ...offeringDataKESToBTC } },
  { data: { ...offeringDataBTCToKES } },
]

// Function to create a randomized offering
async function createRandomOffering(index: number): Promise<Offering> {

  const customPFIIndex = index % 5 // 5 is number of hardcoded PFI DIDs
  const offering = Offering.create({
    metadata: {
      from: config.pfiDid[customPFIIndex].uri,  // Alternates between two URIs
      protocol: '1.0'
    },
    data: customOfferings[index].data //chooseRandomOfferingData(customPFIIndex),
  })

  try {
    await offering.sign(config.pfiDid[customPFIIndex])
    // console.log('Offering signed')
  }
  catch (e) {
    console.log('error', e)
  }
  // offering.sign(config.pfiDid[index % 5])  // Sign with alternating URI

  offering.validate()
  PresentationExchange.validateDefinition({
    presentationDefinition: offering.data.requiredClaims
  })

  // console.log(`Offering ${index + 1} created and validated`)
  return offering
}

// Initialize an array of hardcoded offerings
const hardcodedOfferings: Offering[] = await Promise.all(Array.from({ length: 2 }, (_, i) => createRandomOffering(i)))

export class HardcodedOfferingRepository implements OfferingsApi {
  pfi: BearerDid
  pfiHardcodedOfferings: Offering[]

  constructor(pfi: BearerDid) {
    this.pfi = pfi
    this.pfiHardcodedOfferings = hardcodedOfferings.filter((offering) => offering.metadata.from === pfi.uri)
  }

  // Retrieve a single offering if found
  async getOffering(opts: { id: string }): Promise<Offering | undefined> {
    console.log('call for offerings')
    return this.pfiHardcodedOfferings.find((offering) => offering.id === opts.id)
  }

  // Retrieve a list of offerings
  async getOfferings(): Promise<Offering[] | undefined> {
    console.log('get PFI offerings')
    return this.pfiHardcodedOfferings
  }
}
