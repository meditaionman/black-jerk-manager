export const initialProducts = [
  { id: "jerk-plate", name: "ジャーク プレート", category: "ジャーク", kind: "jerk", active: true, price: 1300, meatPieces: 2, meatPacks: 15, otherCost: 12600, quantity: 45 },
  { id: "jerk-half", name: "ジャーク ハーフ", category: "ジャーク", kind: "jerk", active: true, price: 800, meatPieces: 2, meatPacks: 8, otherCost: 4480, quantity: 32 },
  { id: "curry-full", name: "グリーンカレー フル", category: "グリーンカレー", kind: "standard", active: true, price: 1100, cost: 9000, quantity: 20 },
  { id: "curry-half", name: "グリーンカレー ハーフ", category: "グリーンカレー", kind: "standard", active: true, price: 700, cost: 5250, quantity: 15 },
  { id: "beer", name: "ビール", category: "ドリンク", kind: "standard", active: true, price: 700, cost: 10500, quantity: 30 },
  { id: "coffee", name: "コーヒー", category: "ドリンク", kind: "standard", active: true, price: 450, cost: 2000, quantity: 25 },
  { id: "smoothie", name: "スムージー", category: "ドリンク", kind: "standard", active: true, price: 650, cost: 5000, quantity: 20 }
];

export const meatPackPrices = { 2: 600, 3: 900 };

export function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

export function calculateProduct(product) {
  const price = toNumber(product.price);
  const quantity = toNumber(product.quantity);
  const isJerk = product.kind === "jerk";
  const active = product.active !== false;
  const meatPieces = Number(product.meatPieces) === 3 ? 3 : 2;
  const meatPacks = toNumber(product.meatPacks);
  const otherCost = toNumber(product.otherCost);
  const meatCost = isJerk ? meatPackPrices[meatPieces] * meatPacks : 0;
  const cost = isJerk ? meatCost + otherCost : toNumber(product.cost);
  const sales = active ? price * quantity : 0;
  const grossProfit = active ? sales - cost : 0;
  return { ...product, price, quantity, active, meatPieces, meatPacks, otherCost, meatCost, cost, sales, grossProfit };
}

export function calculateSummary(products) {
  const calculated = products.map(calculateProduct);
  const sales = calculated.reduce((total, product) => total + product.sales, 0);
  const grossProfit = calculated.reduce((total, product) => total + product.grossProfit, 0);
  return { sales, grossProfit, marginRate: sales === 0 ? 0 : (grossProfit / sales) * 100 };
}
