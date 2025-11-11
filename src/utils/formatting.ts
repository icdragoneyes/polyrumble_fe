import { format } from 'date-fns';

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number): string {
  return format(new Date(timestamp * 1000), 'MMM d, HH:mm');
}

/**
 * Format full date
 */
export function formatDate(timestamp: number): string {
  return format(new Date(timestamp * 1000), 'MMM d, yyyy HH:mm');
}

/**
 * Format number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K/M suffix
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}
