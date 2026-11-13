(function () {
  'use strict';
  const field = id => document.getElementById('tray-bleach-' + id);
  const model = window.HoclDilutionModel;
  const mlPerUnit = {mL:1, tsp:4.92892159375, tbsp:14.78676478125, oz:29.5735295625, L:1000, gal:3785.411784};
  const number = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2});
  const format = value => value > 0 && value < 0.01 ? value.toPrecision(2) : number.format(value);

  function render() {
    const recipe = field('recipe').value;
    field('label-ratio').hidden = recipe !== 'label';
    for (const name of ['clorox', 'vertex', 'label']) {
      field(name + '-directions').hidden = recipe !== name;
    }
    const result = model.calculateTrayBleach({
      recipe,
      finalVolume: field('volume').value,
      bleachMl: Number(field('label-stock').value) * mlPerUnit[field('stock-unit').value],
      waterMl: Number(field('label-water').value) * mlPerUnit[field('water-unit').value],
    });
    field('stock-out').textContent = result ? format(result.stockMl) + ' mL' : '—';
    field('water-out').textContent = result ? format(result.waterMl) + ' mL' : '—';
    field('status').textContent = result ? '' : 'Enter a positive batch volume and both label amounts for a custom recipe.';
  }

  field('form').addEventListener('submit', event => event.preventDefault());
  field('form').addEventListener('input', render);
  field('form').addEventListener('change', render);
  render();
})();
