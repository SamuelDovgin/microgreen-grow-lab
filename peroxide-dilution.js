(function () {
  'use strict';
  const get = name => document.getElementById(name);
  const field = name => get('peroxide-dilution-' + name);
  const model = window.HoclDilutionModel;
  const defaults = model.PEROXIDE_DEFAULTS;
  const number = new Intl.NumberFormat(undefined, {maximumFractionDigits: 3});
  const format = value => value > 0 && value < 0.001 ? value.toPrecision(3) : number.format(value);
  const concentrations = [50, 100, 200, 900];
  const seedBathPct = 3;
  const defaultWater = 500;
  const chemicals = ['peroxide', 'hocl', 'bleach'];
  let seedBath = false;
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
    const bathWater = field('bathWater').value;
    result = seedBath
      ? window.SeedSanitationModel.plan({chemical: 'peroxide', basis: 'mass', stock: input.stock, target: seedBathPct, water: bathWater})
      : model.calculatePeroxide(input);
    for (const concentration of concentrations) {
      field('preset-' + concentration).setAttribute('aria-pressed', String(!seedBath && Number(input.target) === concentration));
    }
    field('preset-3pct').setAttribute('aria-pressed', String(seedBath));
    field('target').readOnly = seedBath;
    field('target-label').textContent = seedBath ? 'Target H₂O₂ (% w/w)' : 'Target H₂O₂ (mg/L or ppm)';
    for (const name of ['volume-control', 'volume-help', 'spray-evidence', 'spray-extras']) field(name).hidden = seedBath;
    for (const name of ['mass-control', 'soak-evidence']) field(name).hidden = !seedBath;
    field('error').textContent = result.ok ? '' : result.reason;
    field('amounts').hidden = !result.ok;
    field('copy').disabled = !result.ok;
    field('copy-status').textContent = '';
    field('load').textContent = '—';
    field('target-pct').textContent = seedBath ? '3% w/w = 30,000 ppm by mass.' : '';
    if (!result.ok) return;

    if (seedBath) {
      field('batch').textContent = `Make ${format(result.final)} g`;
      field('direct').textContent = `${format(result.stock)} g`;
      field('water-label').textContent = 'Water · weigh';
      field('water').textContent = `${format(result.water)} g`;
      field('stock-fill').style.width = `${(result.stock / result.final) * 100}%`;
      field('ratio').textContent = `1 part stock + ${format(result.water / result.stock)} parts water by weight`;
      field('ratio-help').textContent = 'Measure the water first, then add the stock by weight.';
      field('two-step').hidden = true;
      return;
    }

    field('target-pct').textContent = `${format(result.targetMgL)} mg/L ≈ ${format(result.targetMgL / 10000)}% in dilute water.`;
    const volume = `about ${format(result.finalMl)} mL`;
    const stockFraction = result.stockGrams / result.finalMl;
    const waterParts = 1 / stockFraction - 1;
    field('batch').textContent = `Make ${volume}`;
    field('direct').textContent = `${format(result.stockGrams)} g`;
    field('water-label').textContent = 'Water · weigh first';
    field('water').textContent = `${format(result.waterGrams)} g`;
    field('stock-fill').style.width = `${stockFraction * 100}%`;
    field('ratio').textContent = Number.isFinite(waterParts)
      ? `1 part stock + ${format(waterParts)} parts water by weight · ≈${format(stockFraction * 100)}% stock`
      : '';
    field('ratio-help').textContent = 'Weigh the water first. The spray estimate assumes the finished mix weighs about 1 g/mL.';
    field('two-step').hidden = !result.twoStep;
    if (result.twoStep) {
      const {concentrateGrams, waterGrams, workingGrams} = result.twoStep;
      field('working-mix').textContent = `${format(waterGrams)} g water + ${format(concentrateGrams)} g stock`;
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
  for (const name of [...Object.keys(defaults), 'bathWater']) field(name).addEventListener('input', render);
  for (const concentration of concentrations) {
    field('preset-' + concentration).addEventListener('click', () => {
      seedBath = false;
      field('target').value = String(concentration);
      render();
    });
  }
  field('preset-3pct').addEventListener('click', () => {
    seedBath = true;
    field('target').value = String(seedBathPct);
    render();
  });
  field('reset').addEventListener('click', () => {
    seedBath = false;
    field('bathWater').value = String(defaultWater);
    for (const [name, value] of Object.entries(defaults)) field(name).value = String(value);
    render();
  });
  field('copy').addEventListener('click', async () => {
    if (!result.ok) return;
    const lines = [`H₂O₂ dilution calculation · ${format(Number(field('stock').value))}% w/w stock`];
    if (seedBath) {
      lines.push(`${field('batch').textContent} at 3% w/w H₂O₂.`, `Start with ${field('water').textContent} water and add ${field('direct').textContent} stock.`, field('ratio').textContent, 'Follow your product’s edible-seed directions for contact time and rinsing.');
    } else {
      lines.push(`${field('batch').textContent} at ${format(result.targetMgL)} mg/L H₂O₂.`, `Start with ${field('water').textContent} water and add ${field('direct').textContent} stock.`);
      if (field('ratio').textContent) lines.push(`${field('ratio').textContent} (assumes 1 g/mL finished solution).`);
      if (result.twoStep) {
        lines.push(`1% working solution: ${field('working-mix').textContent}.`, `Final batch: start with ${field('water').textContent} fresh water and add ${field('working-use').textContent}.`);
      }
      lines.push(field('load').textContent, 'Experimental calculation. Mold prevention and pathogen reduction are unverified.');
    }
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
