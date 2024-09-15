import axios from 'axios';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { OfferingData } from '@tbdex/http-server';
import { rankOfferings } from './bitsacco.js';

enum PFIs {
  'AquaFinance Capital',
  'SwiftLiquidity Solutions',
  'Flowback Financial',
  'Vertex Liquid Assets',
  'Titanium Trust',
}

export const pfiUrls = [
  'http://localhost:4000',
  'http://localhost:5000',
  'http://localhost:8000',
  'http://localhost:8080',
  'http://localhost:9000'
];

export async function fetchPfiOfferings(baseUrl: string): Promise<OfferingData[]> {
  try {
    const response = await axios.get(`${baseUrl}/offerings`);
    return response.data as OfferingData[];
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return [];
  }
}

export async function fetchAllPfiOfferings(): Promise<OfferingData[]> {
  const allOfferings = await Promise.all(pfiUrls.map(fetchPfiOfferings));
  return allOfferings.flat();
}

// CLI logic
yargs(hideBin(process.argv))
  .command('offerings', 'Fetch and display offerings', (yargs) => {
    return yargs.option('pfi', {
      describe: 'number selector of the pfi',
      choices: Object.keys(PFIs),
      demandOption: false,
    }).option('ranked', {
      alias: 'r',
      describe: 'rank the offerings',
      type: 'boolean',
      default: false
    });
  }, async (argv) => {
    console.log(argv);

    let offerings = [];

    if (argv.pfi) {
      const pfiIndex = Object.keys(PFIs).indexOf(argv.pfi);
      const pfiUrl = pfiUrls[pfiIndex];
      offerings = await fetchPfiOfferings(pfiUrl);
    } else {
      offerings = await fetchAllPfiOfferings();
    }

    if (argv.ranked) {
      const ranked = rankOfferings(offerings);
      console.log('Ranked Offerings');
      console.table(ranked);
    } else {
      // console.log('Fetched Offerings:', JSON.stringify(offerings, null, 2));
      console.log('Fetched Offerings:');
      console.table(offerings);
    }
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv;
