import { USD_TO_UZS_RATE } from '../data/cars';

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatUzs(amountUsd: number, customRate = USD_TO_UZS_RATE): string {
  const uzs = Math.round(amountUsd * customRate);
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(uzs) + " so'm";
}

export function formatPriceDual(amountUsd: number, preferCurrency: 'USD' | 'UZS' = 'USD'): { primary: string; secondary: string } {
  if (preferCurrency === 'UZS') {
    return {
      primary: formatUzs(amountUsd),
      secondary: formatUsd(amountUsd)
    };
  }
  return {
    primary: formatUsd(amountUsd),
    secondary: formatUzs(amountUsd)
  };
}
