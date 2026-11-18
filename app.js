import { calculateProduct, calculateSummary, initialProducts, toNumber } from "./business.js";

const yen = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("ja-JP");
let products = initialProducts.map((product) => ({ ...product }));

const tableBody = document.querySelector("#product-rows");
const summary = {
  sales: document.querySelector("#total-sales"),
  grossProfit: document.querySelector("#total-gross-profit"),
  marginRate: document.querySelector("#gross-margin-rate")
};

function jerkCostEditor(product) {
  return `<div class="cost-editor">
    <div class="cost-line"><span>肉</span><strong class="meat-cost">${yen.format(product.meatCost)}</strong></div>
    <fieldset class="pack-choice"><legend class="sr-only">${product.name}の肉のパック規格</legend><label><input data-id="${product.id}" data-field="meatPieces" type="radio" name="meat-pieces-${product.id}" value="2" ${product.meatPieces === 2 ? "checked" : ""}> 2枚 <small>¥600/パック</small></label><label><input data-id="${product.id}" data-field="meatPieces" type="radio" name="meat-pieces-${product.id}" value="3" ${product.meatPieces === 3 ? "checked" : ""}> 3枚 <small>¥900/パック</small></label></fieldset>
    <label class="pack-count" for="meat-packs-${product.id}">パック数 <input id="meat-packs-${product.id}" data-id="${product.id}" data-field="meatPacks" type="number" min="0" step="1" inputmode="numeric" value="${product.meatPacks}"></label>
    <div class="cost-line other-cost"><label for="other-cost-${product.id}">米・スパイス等</label><div class="input-wrap"><span>¥</span><input id="other-cost-${product.id}" data-id="${product.id}" data-field="otherCost" type="number" min="0" step="10" inputmode="numeric" value="${product.otherCost}"></div></div>
    <div class="cost-total"><span>肉 ＋ 米・スパイス等</span><strong class="food-cost">${yen.format(product.cost)}</strong></div>
  </div>`;
}

function standardCostEditor(product) {
  return `<label class="standard-cost" for="cost-${product.id}"><span>原価</span><div class="input-wrap"><span>¥</span><input id="cost-${product.id}" data-id="${product.id}" data-field="cost" type="number" min="0" step="10" inputmode="numeric" value="${product.cost}"></div></label>`;
}

function productRow(product) {
  const calculated = calculateProduct(product);
  const costEditor = calculated.kind === "jerk" ? jerkCostEditor(calculated) : standardCostEditor(calculated);
  return `
    <tr data-id="${calculated.id}">
      <th scope="row"><span class="category">${calculated.category}</span><label class="sr-only" for="name-${calculated.id}">${calculated.category}の商品名</label><input class="name-input" id="name-${calculated.id}" data-id="${calculated.id}" data-field="name" type="text" value="${calculated.name}"></th>
      <td data-label="販売価格"><label class="sr-only" for="price-${calculated.id}">${calculated.name}の販売価格</label><div class="input-wrap"><span>¥</span><input id="price-${calculated.id}" data-id="${calculated.id}" data-field="price" type="number" min="0" step="10" inputmode="numeric" value="${calculated.price}"></div></td>
      <td data-label="原価" class="cost-cell">${costEditor}</td>
      <td data-label="販売数量"><label class="sr-only" for="quantity-${calculated.id}">${calculated.name}の販売数量</label><div class="input-wrap quantity"><input id="quantity-${calculated.id}" data-id="${calculated.id}" data-field="quantity" type="number" min="0" step="1" inputmode="numeric" value="${calculated.quantity}"><span>食</span></div></td>
      <td data-label="売上" class="amount sales">${yen.format(calculated.sales)}</td>
      <td data-label="粗利益" class="amount profit gross-profit">${yen.format(calculated.grossProfit)}</td>
    </tr>`;
}

function renderSummary() {
  const totals = calculateSummary(products);
  summary.sales.textContent = yen.format(totals.sales);
  summary.grossProfit.textContent = yen.format(totals.grossProfit);
  summary.marginRate.textContent = `${totals.marginRate.toFixed(1)}%`;
  document.querySelector("#sold-count").textContent = `${number.format(products.reduce((total, product) => total + toNumber(product.quantity), 0))} 食`;
}

function render() {
  tableBody.innerHTML = products.map(productRow).join("");
  renderSummary();
}

function updateProduct(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  const product = products.find(({ id }) => id === input.dataset.id);
  if (!product || !input.dataset.field) return;
  product[input.dataset.field] = input.dataset.field === "name" ? input.value : toNumber(input.value);
  const calculated = calculateProduct(product);
  const row = tableBody.querySelector(`tr[data-id="${product.id}"]`);
  const meatCost = row.querySelector(".meat-cost");
  const foodCost = row.querySelector(".food-cost");
  if (meatCost) meatCost.textContent = yen.format(calculated.meatCost);
  if (foodCost) foodCost.textContent = yen.format(calculated.cost);
  row.querySelector(".sales").textContent = yen.format(calculated.sales);
  row.querySelector(".gross-profit").textContent = yen.format(calculated.grossProfit);
  renderSummary();
}

tableBody.addEventListener("input", updateProduct);
tableBody.addEventListener("change", updateProduct);

document.querySelector("#reset").addEventListener("click", () => {
  products = initialProducts.map((product) => ({ ...product }));
  render();
});

render();
