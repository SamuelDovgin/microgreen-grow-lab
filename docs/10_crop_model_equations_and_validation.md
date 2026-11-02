# Crop model: equations, evidence classes and validation

*November 1, 2026. [Open the planner](site/dist/crops.html) · [research synthesis](07_seed_density_water_and_family_protocols.md).*

## Model endpoints

The model returns dry seed input, an assumed or measured-lot expected stand, growing dates, a root-zone storage/demand scenario, a conditional weight-based refill, and the best observed treatment for a selected objective. It does not return guaranteed yield, a disease probability, a pathogen-safe density, a crop ET prediction or a universal biological optimum.

## Evidence classes

| Layer | Class | Treatment in the app |
|---|---|---|
| Inches-to-area/volume and mass balance | Unit identities / arithmetic | Exact conversion constants; dimensional regression checks |
| Johnny’s seed and harvest records | Supplier trial | Successful baseline; no optimized-density claim |
| MGM, Jonah, Donny and On The Grow | Creator observations | Separate, attributed recipes; no cross-creator response curve |
| de Lima/Arthur density treatments | Primary experimental data | Separate study means and contexts; no reconstructed raw replicates |
| Broccoli/beet/mustard counts | Extension approximation | Lot estimate, superseded by measurement |
| Arthur herb seed weights | Primary measurement from another lot | Explicit borrowed-lot label |
| Other initial units/g | Illustrative assumption | User-editable; does not drive a mass-recipe default |
| Germination 95%, establishment 90% | Illustrative example | User replaces with lot/tray measurement |
| Substrate retention, demand and growth ramp | Illustrative assumptions | Visible explanation; no fixed irrigation doses |
| Wet/current tray weights | Measured only after replacement | Example fields clearly labeled; conditional refill arithmetic |
| Family cover windows absent from a source | Editorial synthesis | Species/source overrides and developmental cues |

## Seed density

Constants: `1 in² = 6.4516 cm² = 0.00064516 m²`; `1 in³ = 16.387064 mL`; `1 oz = 28.349523125 g`.

Reference mass: `m = m0 × A/A0 × trialFactor`.

Target emerged count: `m = A × Dlive / (q × p × e × r) × trialFactor`.

Expected emerged shoots: `N = m × q × p × e × r`.

Here `q` is planting units/g, `p` laboratory germination, `e` conditional establishment and `r` shoots per viable planting unit. Expected spacing is square-grid equivalent `10 × sqrt(Acm²/N)` mm, calculated for inspection but not presented as an actual canopy or seed diameter. A deterministic random scatter shows even sowing qualitatively; symbols are sampled and do not depict every seed, plant size or disease physics.

Mung/lentil baseline: `m = 3 × Acm²/q`, preserving seeds **sown** per cm². Source-recipe mass is deliberately independent of changed `p/e/q`, except these two count-based presets. Target-live mode explicitly depends on those terms. Zero and invalid fractions are rejected rather than divided by zero.

## Water model

Root-zone reserve: `Vwater = A × depth × 16.387064 × retention + accessibleReservoir`.

Demand: `L = input mm/day × Am² × 1000` mL/day.

Selected drawdown: `D = Vwater × depletionFraction`; central trigger time `24D/L` hours. Low/high demand are `L × (1 ± uncertainty)`. These bounds are sensitivity scenarios, not statistical confidence intervals. No temperature, humidity, seed density, leaf area or substrate calibration is fitted to ET.

Measured mode uses `Mtrigger = Mwet − measuredReserve × depletionFraction`. If current mass is at/below the trigger, `refill = max(0,Mwet−Mnow)` mL using 1 g/mL; otherwise refill is zero. It rejects reserve ≥ complete wet mass. Values are approximate because biomass, retained reservoir water and accessories can change the weighing denominator. Zero refill does not override a dry germinating seed surface or root-access problem.

The schedule’s illustrative water-loss series is 20% of late demand before light, then a linear 35→100% ramp during the lit interval. The integrated scenario totals days 0 through the day before harvest and excludes initial hydration, drainage and soaking. This is an educational budget, not a species-calibrated irrigation model. It never issues that scenario amount as an automatic daily refill.

Air vapor pressure deficit: `es = 0.6108 exp[17.27T/(T+237.3)]` kPa, `VPDair = es × (1−RH/100)`. This common saturation-pressure approximation is a diagnostic, not leaf VPD. DLI is `PPFD × lightHours × 0.0036` mol/m²/day. Changing these diagnostics does not silently change seed rate or water demand.

## Date and protocol model

Day 0 is sowing. Calendar-day offsets are calculated in UTC from an ISO date at noon, avoiding daylight-saving shifts in the generated dates. The default sow date is the user’s local calendar date. Presoaking occurs beforehand and is not counted as a sowing day. Emergence cover and optional noncontact stretch blackout are separate intervals. Their sum must be less than harvest day; an impossible schedule produces no rows. A manual source/method change can be explored but the mismatch is disclosed.

Covered time, top load and harvest dates are planning settings. The recipe’s actual developmental cues govern transitions. A dome has zero added top load by default. The 3-lb contact-cover example sits within the USU 2–5-lb guidance but is not an experimentally optimized pressure; a pounds-only input also does not model load distribution or inter-tray contact mechanics.

Source selection restores known medium category/light hours. A source, crop, substrate or physical root-zone change resets measured-water mode; the weighing target must be measured again for the revised assembly. Unknown depth, capacity and load remain scenarios rather than unreported source measurements.

## Bounded optimization

Study data remain in g seed/m², g fresh harvest/m² and days. Local saleable data are normalized to the same units. A response is not interpolated. Exact numerical ties prefer less seed. Largest-density winners are flagged as boundary winners; all-negative contribution scenarios are disclosed.

Objectives: yield/m²; harvest/seed; harvest per occupied day; contribution/m²; and contribution per occupied day. Dollar/kg inputs divide by 1,000 before multiplying by grams/m². Other cost is $/m²/crop and turnaround is days. Contribution is not net profit. Study gross mass is not assumed to have measured packout or sales. Numerical mean rankings are not claims of statistical significance; some top treatment groups overlap in the papers.

The CSV schema is `crop_id,seed_g,saleable_g,area_in2,days,substrate,lot,stage`. It accepts finite numeric values, including zero saleable yield, and simple identifiers without embedded commas. It rejects missing/blank cells, invalid units/ranges, another crop, mixed substrate/lot/stage contexts and fewer than two distinct rates. Independent trays at the same normalized rate and days are summarized by mean and sample SD. SD is not a confidence interval. Context tags cannot verify whether users actually held light, temperature, irrigation and harvest criteria constant; the accompanying instructions require that.

## Validation commands

From `research_project/17_visualizers/site/`:

```text
python3 build-crop-research.py
python3 build-crop-data.py
python3 build-crop-pages.py
node test-crops.cjs
node test-crop-interactions.cjs
python3 validate-site.py
node test-model.cjs
node test-interactions.cjs
node test-rack.cjs
node test-rack-interactions.cjs
```

The source-note builder uses the temporary downloaded captions to regenerate annotations/checksums. Existing generated JSON and notes remain usable without those working copies; normal offline use needs no Python, Node or network. The crop-data and page builders are deterministic local rebuilds.

Required invariants include the nominal 1020 conversion; half-area seed scaling; count-mode germination/seed-size behavior; source-mode independence from unsupported adjustments; sown versus live target semantics; water units and conservation; demand monotonicity; zero intrinsic reusable-medium reserve; measured trigger/refill boundaries; exact dates through daylight-saving transitions; bounded optimization, ties and negative economics; CSV context rejection and zero-saleable retention; all 54 crop presets and recipe transitions; exported source context; and valid local links/labels.

Actual visual browser rendering is a separate check. Browser control was disabled in Work settings during this task; DOM interaction regression and static responsive checks do not prove pixel layout or mobile rendering. Publication recovery also returned `Sites project not found` for the existing project identity. The completed local/portable build remains available independently of that hosting failure.

[Machine-readable QA record](data/crop-qa-report.json) records the completed checks and verification limits for this delivery.

## Follow-up: persistent grow records

[My grow log](site/dist/grow-log.html) preserves actual tray conditions and outcomes separately from the initial plan. The [logging guide](11_grow_log_and_protocol_calibration.md) defines persistence, backup/merge behavior, comparable-trial grouping and the apparent mass-loss calculation. Journal checks are `node site/test-grow-log.cjs` and `node site/test-grow-log-interactions.cjs`. Locally entered records are not automatically visible in chat or used to rewrite research defaults.
