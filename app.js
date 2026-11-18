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

function productRow(product) {
  const calculated = calculateProduct(product);
  return `
    <tr data-id="${calculated.id}">
      <th scope="row"><span class="category">${calculated.category}</span><span class="product-name">${calculated.name}</span></th>
      <td data-label="販売価格"><label class="sr-only" for="price-${calculated.id}">${calculated.name}の販売価格</label><div class="input-wrap"><span>¥</span><input id="price-${calculated.id}" data-id="${calculated.id}" data-field="price" type="number" min="0" step="10" inputmode="numeric" value="${calculated.price}"></div></td>
      <td data-label="食材原価"><label class="sr-only" for="cost-${calculated.id}">${calculated.name}の食材原価</label><div class="input-wrap"><span>¥</span><input id="cost-${calculated.id}" data-id="${calculated.id}" data-field="cost" type="number" min="0" step="10" inputmode="numeric" value="${calculated.cost}"></div></td>
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

tableBody.addEventListener("input", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  const product = products.find(({ id }) => id === input.dataset.id);
  if (!product || !input.dataset.field) return;
  product[input.dataset.field] = toNumber(input.value);
  const calculated = calculateProduct(product);
  const row = tableBody.querySelector(`tr[data-id="${product.id}"]`);
  row.querySelector(".sales").textContent = yen.format(calculated.sales);
  row.querySelector(".gross-profit").textContent = yen.format(calculated.grossProfit);
  renderSummary();
});

document.querySelector("#reset").addEventListener("click", () => {
  products = initialProducts.map((product) => ({ ...product }));
  render();
});

render();
