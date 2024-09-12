import { Nullish } from 'Types/common';

export function formatFiatPrice(price: Nullish<number>, currency = 'USD'): string {
  if (price === null || price === undefined) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}
