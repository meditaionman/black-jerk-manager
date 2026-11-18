export const initialProducts = [
  { id: "plate", name: "BLACK JERK プレート", category: "プレート", price: 1300, cost: 480, quantity: 45 },
  { id: "half", name: "BLACK JERK ハーフ", category: "ハーフ", price: 800, cost: 290, quantity: 32 },
  { id: "drink", name: "ドリンク", category: "ドリンク", price: 450, cost: 110, quantity: 58 }
];

export function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

export function calculateProduct(product) {
  const price = toNumber(product.price);
  const cost = toNumber(product.cost);
  const quantity = toNumber(product.quantity);
  const sales = price * quantity;
  const grossProfit = (price - cost) * quantity;
  return { ...product, price, cost, quantity, sales, grossProfit };
}

export function calculateSummary(products) {
  const calculated = products.map(calculateProduct);
  const sales = calculated.reduce((total, product) => total + product.sales, 0);
  const grossProfit = calculated.reduce((total, product) => total + product.grossProfit, 0);
  return { sales, grossProfit, marginRate: sales === 0 ? 0 : (grossProfit / sales) * 100 };
}
