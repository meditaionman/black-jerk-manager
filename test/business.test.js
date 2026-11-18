import test from "node:test";
import assert from "node:assert/strict";
import { calculateProduct, calculateSummary, toNumber } from "../business.js";

test("商品ごとの売上と粗利益を計算できる", () => {
  assert.deepEqual(calculateProduct({ price: 1300, cost: 480, quantity: 45 }), { price: 1300, cost: 480, quantity: 45, sales: 58500, grossProfit: 36900 });
});

test("全商品の合計と粗利益率を計算できる", () => {
  const totals = calculateSummary([{ price: 1000, cost: 400, quantity: 2 }, { price: 500, cost: 100, quantity: 4 }]);
  assert.deepEqual(totals, { sales: 4000, grossProfit: 2800, marginRate: 70 });
});

test("不正な入力値はゼロとして扱う", () => {
  assert.equal(toNumber(-1), 0);
  assert.equal(toNumber("abc"), 0);
  assert.equal(calculateSummary([]).marginRate, 0);
});
