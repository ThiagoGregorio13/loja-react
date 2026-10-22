// Store rules for the "extra" price info shown on the cards and on the product page.
export const INSTALLMENTS = 10; // "or 10x $12.99 interest-free"
export const FREE_SHIPPING_FROM = 100; // orders from this price ship for free

// the API sends the price ALREADY discounted, plus the discount percentage.
// So the price before the discount is: price / (1 - discount / 100)
// e.g. $80 with 20% off → 80 / 0.8 = $100
export function originalPrice(price: number, discountPercentage: number) {
  return price / (1 - discountPercentage / 100);
}

export function installmentPrice(price: number) {
  return price / INSTALLMENTS;
}
