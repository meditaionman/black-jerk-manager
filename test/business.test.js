import test from "node:test";
import assert from "node:assert/strict";
import { calculateProduct, calculateSummary, meatPackPrices, toNumber } from "../business.js";

test("肉と米・スパイス等の内訳から食材原価、売上、粗利益を計算できる", () => {
  const product = calculateProduct({ kind: "jerk", price: 1300, meatPieces: 2, meatPacks: 15, otherCost: 12600, quantity: 45 });
  assert.equal(product.meatCost, 9000);
  assert.equal(product.cost, 21600);
  assert.equal(product.sales, 58500);
  assert.equal(product.grossProfit, 36900);
});

test("全商品の合計と粗利益率を計算できる", () => {
  const totals = calculateSummary([{ kind: "jerk", price: 1000, meatPieces: 2, meatPacks: 1, otherCost: 400, quantity: 2 }, { kind: "jerk", price: 500, meatPieces: 3, meatPacks: 1, otherCost: 100, quantity: 4 }]);
  assert.deepEqual(totals, { sales: 4000, grossProfit: 2000, marginRate: 50 });
});

test("3枚パックは900円で肉原価に反映される", () => {
  assert.equal(meatPackPrices[3], 900);
  assert.equal(calculateProduct({ kind: "jerk", price: 0, meatPieces: 3, meatPacks: 2, otherCost: 0, quantity: 0 }).meatCost, 1800);
});

test("ジャーク以外は入力した原価をそのまま使い、肉原価は加算しない", () => {
  const product = calculateProduct({ kind: "standard", price: 700, cost: 10500, meatPieces: 3, meatPacks: 10, quantity: 30 });
  assert.equal(product.meatCost, 0);
  assert.equal(product.cost, 10500);
  assert.equal(product.grossProfit, 10500);
});

test("その日やらない商品は売上と粗利益の計算対象外になる", () => {
  const product = calculateProduct({ kind: "standard", active: false, price: 700, cost: 10500, quantity: 30 });
  assert.equal(product.sales, 0);
  assert.equal(product.grossProfit, 0);
  assert.deepEqual(calculateSummary([product]), { sales: 0, grossProfit: 0, marginRate: 0 });
});

test("不正な入力値はゼロとして扱う", () => {
  assert.equal(toNumber(-1), 0);
  assert.equal(toNumber("abc"), 0);
  assert.equal(calculateSummary([]).marginRate, 0);
});
