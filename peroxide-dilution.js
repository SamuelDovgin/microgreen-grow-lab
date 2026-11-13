(function () {
  'use strict';
  const get = name => document.getElementById(name);
  const field = name => get('peroxide-dilution-' + name);
  const model = window.HoclDilutionModel;
  const defaults = model.PEROXIDE_DEFAULTS;
  const number = new Intl.NumberFormat(undefined, {maximumFractionDigits: 3});
  const format = value => value > 0 && value < 0.001 ? value.toPrecision(3) : number.format(value);
  const concentrations = [50, 100, 200];
  const chemicals = ['peroxide', 'hocl', 'bleach'];
  let result;

  function selectChemical(chemical) {
    for (const name of chemicals) {
      const selected = name === chemical;
      get('dilution-select-' + name).setAttribute('aria-pressed', String(selected));
      get('dilution-panel-' + name).hidden = !selected;
    }
  }

  function render() {
    const input = Object.fromEntries(Object.keys(defaults).map(name => [name, field(name).value]));
    result = model.calculatePeroxide(input);
    for (const concentration of concentrations) {
      field('preset-' + concentration).setAttribute('aria-pressed', String(Number(input.target) === concentration));
    }
    field('error').textContent = result.ok ? '' : result.reason;
    field('amounts').hidden = !result.ok;
    field('copy').disabled = !result.ok;
    field('copy-status').textContent = '';
    field('load').textContent = '—';
    field('target-pct').textContent = '';
    if (!result.ok) return;

    field('target-pct').textContent = `${format(result.targetMgL)} mg/L ≈ ${format(result.targetMgL / 10000)}% in dilute water.`;
    const volume = `${format(result.finalMl)} mL`;
    const stockFraction = result.stockGrams / result.finalMl;
    const waterParts = 1 / stockFraction - 1;
    field('batch').textContent = `Make ${volume}`;
    field('direct').textContent = `${format(result.stockGrams)} g`;
    field('water').textContent = volume;
    field('stock-fill').style.width = `${stockFraction * 100}%`;
    field('ratio').textContent = Number.isFinite(waterParts)
      ? `1 part stock + ${format(waterParts)} parts water by weight · ≈${format(stockFraction * 100)}% stock`
      : '';
    field('two-step').hidden = !result.twoStep;
    if (result.twoStep) {
      const {concentrateGrams, waterGrams, workingGrams} = result.twoStep;
      field('working-mix').textContent = `${format(concentrateGrams)} g stock + ${format(waterGrams)} g water`;
      field('working-use').textContent = `${format(workingGrams)} g of the 1% solution`;
    }
    field('load').textContent = result.appliedMg === null
      ? 'Enter whole-number spray and application counts.'
      : `${format(result.appliedMg)} mg H₂O₂ in ${format(result.appliedMl)} mL sprayed per tray.`;
  }

  for (const name of chemicals) {
    get('dilution-select-' + name).addEventListener('click', () => selectChemical(name));
  }
  field('form').addEventListener('submit', event => event.preventDefault());
  for (const name of Object.keys(defaults)) field(name).addEventListener('input', render);
  for (const concentration of concentrations) {
    field('preset-' + concentration).addEventListener('click', () => {
      field('target').value = String(concentration);
      render();
    });
  }
  field('reset').addEventListener('click', () => {
    for (const [name, value] of Object.entries(defaults)) field(name).value = String(value);
    render();
  });
  field('copy').addEventListener('click', async () => {
    if (!result.ok) return;
    const lines = [`H₂O₂ dilution calculation · ${format(result.stockPct)}% w/w stock`, `${field('batch').textContent} at ${format(result.targetMgL)} mg/L H₂O₂.`];
    lines.push(`Direct dilution: weigh ${field('direct').textContent} stock and add water to ${field('water').textContent} total.`);
    if (field('ratio').textContent) lines.push(`${field('ratio').textContent} (assumes 1 g/mL finished solution).`);
    if (result.twoStep) {
      lines.push(`1% working solution: ${field('working-mix').textContent}.`, `Final batch: ${field('working-use').textContent}. Add water to the final volume.`);
    }
    lines.push(field('load').textContent, 'Experimental calculation. Mold prevention and pathogen reduction are unverified.');
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      field('copy-status').textContent = 'Dilution notes copied.';
    } catch {
      field('copy-status').textContent = 'Clipboard unavailable. Copy the visible amounts.';
    }
  });
  const requested = new URLSearchParams(window.location?.search).get('dilution');
  selectChemical(chemicals.includes(requested) ? requested : 'peroxide');
  render();
})();
