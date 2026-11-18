export const initialProducts = [
  { id: "plate", name: "BLACK JERK プレート", category: "プレート", price: 1300, meatPieces: 2, meatPacks: 15, otherCost: 12600, quantity: 45 },
  { id: "half", name: "BLACK JERK ハーフ", category: "ハーフ", price: 800, meatPieces: 2, meatPacks: 8, otherCost: 4480, quantity: 32 },
  { id: "drink", name: "ドリンク", category: "ドリンク", price: 450, meatPieces: 2, meatPacks: 0, otherCost: 6380, quantity: 58 }
];

export const meatPackPrices = { 2: 600, 3: 900 };

export function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

export function calculateProduct(product) {
  const price = toNumber(product.price);
  const quantity = toNumber(product.quantity);
  const meatPieces = Number(product.meatPieces) === 3 ? 3 : 2;
  const meatPacks = toNumber(product.meatPacks);
  const otherCost = toNumber(product.otherCost);
  const meatCost = meatPackPrices[meatPieces] * meatPacks;
  const cost = meatCost + otherCost;
  const sales = price * quantity;
  const grossProfit = sales - cost;
  return { ...product, price, quantity, meatPieces, meatPacks, otherCost, meatCost, cost, sales, grossProfit };
}

export function calculateSummary(products) {
  const calculated = products.map(calculateProduct);
  const sales = calculated.reduce((total, product) => total + product.sales, 0);
  const grossProfit = calculated.reduce((total, product) => total + product.grossProfit, 0);
  return { sales, grossProfit, marginRate: sales === 0 ? 0 : (grossProfit / sales) * 100 };
}
