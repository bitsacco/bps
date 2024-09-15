import { OfferingData } from '@tbdex/http-server';

interface Weights {
  exchangeRate: number;
  spread: number;
  estimatedSettlement: number;
  historicalSettlement: number;
}

export function rankOfferings(offerings: OfferingData[]): [OfferingData, number][] {
  const weights: Weights = {
    exchangeRate: 0.3,
    spread: 0.3,
    estimatedSettlement: 0.2,
    historicalSettlement: 0.2
  };


  const scoredOfferings: [OfferingData, number][] = offerings.map(offering => {
    const baselineRate = mockBaselineFxRate(parseFloat(offering.payoutUnitsPerPayinUnit));

    return [
      offering,
      calculateScore(offering, baselineRate, weights)
    ];
  });

  return scoredOfferings.sort((a, b) => b[1] - a[1]);
}

function calculateScore(offering: OfferingData, baselineRate: number, weights: Weights): number {
  const exchangeRate = parseFloat(offering.payoutUnitsPerPayinUnit);
  const spread = Math.abs(exchangeRate - baselineRate) / baselineRate;
  const estimatedSettlement = offering.payout.methods[0].estimatedSettlementTime || Number.POSITIVE_INFINITY;

  const historicalSettlement = mockHistoricalTimeToSettle();

  const normalizedRate = normalizeFxRate(exchangeRate);
  const normalizedSpread = normalizeSpread(spread);
  const normalizedEstimated = normalizeSettlementTime(estimatedSettlement);
  const normalizedHistorical = normalizeSettlementTime(historicalSettlement);

  return (
    weights.exchangeRate * normalizedRate +
    weights.spread * (1 - normalizedSpread) + // Lower spread is better
    weights.estimatedSettlement * (1 - normalizedEstimated) + // Lower time is better
    weights.historicalSettlement * (1 - normalizedHistorical) // Lower time is better
  );
}

function normalizeFxRate(rate: number): number {
  if (rate > 1) {
    // For rates typically between 0 and 100
    return Math.min(rate / 100, 1);
  } else {
    // For rates typically between 0 and 1
    return rate;
  }
}

export function mockBaselineFxRate(rate: number): number {
  if (rate > 1) {
    // For rates typically between 0 and 100
    return 11.6799;
  } else {
    // For rates typically between 0 and 1
    return 0.085617171;
  }
}

function normalizeSpread(spread: number): number {
  return Math.min(spread, 1); // Cap at 1 for spreads >= 100%
}

function normalizeSettlementTime(time: number): number {
  return Math.min(time / 3600, 1); // Normalize to 0-1 range, capping at 1 hour
}

function mockHistoricalTimeToSettle(): number {
  // Implement logic to retrieve historical settlement time
  // This is a placeholder implementation
  return Math.random() * 600; // Return a random time up to 10 mins
}
