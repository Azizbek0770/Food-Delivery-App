export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}; 