# Lighting model: equations, assumptions and validation

*October 30, 2026. This is an uncalibrated geometry and lamp-output estimate with median-canopy DLI, plus fixed/custom measured overrides. See [specific guide](01_specific_lighting_guide.md) and [source log](source_docs/research_resource_log_2026-10-30.txt).*

## Evidence ladder

| Layer | Basis | Classification |
|---|---|---|
| 16 h on/8 h off | User request; MGM practice [L03,L05] | Explicit schedule |
| DLI conversion | PPFD × hours × 0.0036 [L02] | Unit identity |
| 9–12 / broader 9–16 DLI | Virginia Tech DLI Table 3 / microgreen production guide [L02,L01] | Extension trial references |
| 2 × 22 W, 5 lit shelves, 10 in pitch | MGM sources, counts reconciled [L03–L06,L08,L14] | Attributed practice |
| 3 × 20 W, 4 trays, 24 in depth | On The Grow professional build [L09] | Attributed practice |
| 46.1 in fixture length | Hykolity/Barrina pages [L07,L11] | Manufacturer body dimension, provisional emitter length |
| Shelf width 48 in; 18/24 in depth | Starter/build source families | Nominal geometry; actual clear dimensions unknown |
| Outer tray 10.75 × 21.25 in, canopy 10 × 20 in, 0.5 in gap | Representative layout selected by author | Illustrative; measure real trays |
| Fixture drop 1.5 in; medium elevation 1.5 in | Selected author values | Illustrative; adjustable |
| Equal downward Lambertian emitters, no reflection | Deliberately simplified optical field | Uncalibrated illustration |
| MGM front/rear placement | Rack video chapter visually checked [L22]; model uses centers 2 and 16 in on 18 in depth | Video-informed reconstruction, not measured coordinates |
| Approximate PPF | 100 lm/W from Hykolity L11; rough /60 photon conversion from Iowa State L28 | Manufacturer rating plus approximate borrowed conversion; not measured PPF |
| Exact installed PPF/optical profile | No calibrated installed grid | Unknown |
| Entered PPFD | User measurement or explicit example | Declared basis; not independently verified |

## Governing equations

For LED face to canopy height `h`, lateral displacement `dx,dy`, and `r² = h²+dx²+dy²`, a downward Lambertian point emitter with unit downward flux has plane density proportional to:

`h² / (π r⁴)`

The cosine emission term and horizontal-plane incidence each contribute `h/r`; geometric dilution contributes `1/r²`. The plane density integrates to unit flux over an infinite unobstructed plane, and is evaluated in inches. For automatic absolute estimates, the per-bar kernel sum is multiplied by `PPF_per_bar / 0.0254²`, converting inverse square inches to inverse square meters. No additional capture factor is applied: spill is already accounted for by the finite canopy area.

Each finite bar contains **48 midpoint segments** with equal contributions `1/48`. Bars are centered along the nominal 48-inch shelf. Front-to-back centers are symmetric around shelf midpoint with adjustable spacing. The summed field is normalized by a regular **16 × 8 grid in each occupied canopy**. Reported synthetic minimum/mean and maximum/mean come from these sampled centers; the true continuous extrema may be more extreme.

The displayed heatmap uses exactly the same 16 × 8 sample cells per tray as the median calculation (512 equal-area samples for four trays; 256 for two). The caption supplies the estimated absolute median and sampled minimum/maximum. The color ramp clips at 0.3–1.7 × mean **for display only**; numerical ratios are not clamped. This visualization is not an absolute intensity comparison between configurations: every map's occupied-area mean is normalized to 100%.

There is no solar input, spectral weighting, measured angular profile, side/back reflection, light interception by leaves, interreflections between bars, nonuniform diode output or temperature-dependent driver output. The Lambertian assumption does not reproduce the manufacturer’s stated 270° beam or a fluorescent reflector. Manufacturer lumens plus the stated approximate spectrum conversion supply an estimated scale, not a photon calibration.

## Clearance and physical boundaries

`h = shelf pitch − fixture drop − medium-top elevation − shoot height`

The MGM preset was revised from an 8-inch bar separation to a 2-inch inset at each depth edge (14-inch separation on its 18-inch shelf). The footage supports edge placement; it cannot supply calibrated dimensions. The older article’s edge/gap statements are retained as inconsistent source wording.

At `h ≤ 0`, the map is suspended, an explicit intersection message appears, and synthetic uniformity is omitted. Finite field output at positive `h` is a mathematical result, not evidence that close mounting is appropriate. The 4-inch and 6–10-inch UI notices are editorial planning flags, not thermal-injury or crop-success thresholds. Observe product instructions and measure the actual crop.

Bar spacing is bounded so outer centers can move to approximately **0.5 inch inside the shelf edges**, using `(depth − 1) / (bar count − 1)` rounded down to the nearest 0.5 inch. This replaces the previous 2-inch-inset restriction; creator presets retain their original assumed placements. For three bars the maximum adjacent spacing is 8.5 inches on an 18-inch shelf and 11.5 inches on a 24-inch shelf. The half-inch inset is a geometric planning limit based on the narrow reference fixture body, not a verified mounting clearance for all products. A single bar disables spacing because it sits at the center. This bound is a UI geometry constraint, not an optimized mounting solution.

Four trays orient their short dimensions along shelf width. Two trays orient their long dimensions along width. Overhang is computed with **outer** rims, whereas the light field is sampled over **inner nominal canopy** rectangles. No structural load or support calculation is performed.

## Automatic, fixed and measured daily/period dose

`DLI (mol/m²/day) = selected PPFD (µmol/m²/s) × selected hours/day × 0.0036`

`period exposure (mol/m²) = DLI × selected lit days`

`period reference (mol/m²) = [9, selected upper reference] × lit days`

Defaults are 16 h/day and 7 lit days. Choose 9–12 DLI (Virginia Tech Table 3) or the broader 9–16 DLI (production guide). The displayed **below / within / above** result compares daily DLI with that daily reference, equivalently period exposure against the same band multiplied by the same days. Inclusive limits use a 1e−9 numerical tolerance to avoid floating-point boundary errors. This arithmetic does **not** validate a whole-crop exposure target or permit an excess on one day to compensate for a deficit on another.

The default dropdown mode is **Auto · estimated canopy median**. The estimate uses the selected lumens/W (137.5 for the purchased T8, 100 for other presets) and 60 lm per µmol/s, then multiplies the existing spatial field by per-bar estimated PPF and the square-inch-to-square-meter conversion. The sorted middle two equal-area samples are averaged to obtain the median. No min/max midpoint or clipped display color is used. Fixed 100/150/200/250/300 examples and a custom assumed/measured value are retained as overrides. Auto updates with physical parameters and watts; fixed examples remain fixed. Measured custom readings are cleared when the physical configuration changes. Daily schedule, rate and lit-shelf count do not change the estimate for one shelf. Reset returns to Auto. Changing a layout preset restores 16 hours/day; days and reference remain user controlled.

Iowa State’s approximate conversion-factor range of 40–80 gives median sensitivity `[central × 0.75, central × 1.5]`, with the central factor 60. This range accounts only for that chosen conversion variation, not uncertainty in output efficacy, angular distribution, reflections or the crop. It is not a confidence interval. All fixture flux is assumed to enter the downward Lambertian distribution. No extra generic utilization factor is applied, avoiding double-counting spill. Efficacy stays at the Hykolity-derived 100 lm/W for all presets, explicitly a borrowed assumption for other lamps.

The automatic median represents a typical modeled planted location. Area-average DLI is generally used for shelf comparisons, so this requested median-based status must not be interpreted as verifying the entire shelf. The displayed min/max helps expose weak edges. Both the estimated median and any custom value are held constant over the selected lit days; crop growth is not integrated.

Custom input accepts 0–2000 PPFD; Auto uses its finite nonnegative model estimate without that manual-entry cap. The schedule accepts 0–24 h/day in half-hour increments and 1–60 whole lit days. These are input bounds, not crop recommendations. Invalid/blank inputs clear results and range status. Zero PPFD or zero light hours yields zero dose and a below-reference result. A model helper accepts any positive integer days; the UI limits the displayed period to 60 days for practical chart readability.

The chart plots end-of-day cumulative dose (a line for constant PPFD/schedule) and a shaded daily-band-times-days wedge. It does not simulate a changing canopy reading, varying daily weather, leaf shading or intra-day dark hours. No partial photoperiod-to-yield equivalence or universal optimum is asserted. All plotted quantities use total mol/m², while the separate daily metric retains mol/m²/day.

## Electrical arithmetic

`W/shelf = bar count × actual W/bar`

`W/tray allocation = W/shelf ÷ occupied trays`

`W/rack = W/shelf × lit shelf count`

`kWh/period = W/rack ÷ 1000 × selected hours/day × selected days`

The monthly comparison uses 30 days; the selected-period comparison uses the same day count as the dose calculation.

`cost = kWh × entered tariff`

A rack total multiplies identical lit shelves, not a three-dimensional optical calculation. No purchasing, cooling, fans, labor or covered-stage energy is included. Use actual lit days and occupancy for batch allocation. The default $0.15/kWh is illustrative.

## Validation and reusable self-test

Run from the project root:

```sh
node research_project/17_visualizers/site/test-model.cjs
node research_project/17_visualizers/site/test-interactions.cjs
python3 research_project/17_visualizers/site/validate-site.py
```

Meaningful model checks include exact DLI identities; MGM rack energy; positive finite fields over supported geometry; left/right and front/back symmetry; bar count additivity for equal coincident emitters; electrical wattage independence of relative optics; midpoint-segment convergence (48 vs 192); the zero-clearance boundary; and outer tray overhang. Optical values are not a calibrated benchmark reproduction because none is available.

The non-browser interaction harness executes the actual UI script with a minimal DOM to check event-driven displayed totals, range statuses, hourly cost changes, preset spacing and reading reset/retention. It does not verify layout, native input behavior or a browser download.

Browser QA additionally covers desktop and mobile overflow, SVG text bounds, preset values, the 200 → 11.52 calculation, measurement invalidation after a geometry change, preservation after a tariff change, and plan download. Results and limits are recorded in [QA notes](03_qa_and_change_notes.md).

## What would permit a stronger model?

A measured canopy grid at several heights with a recorded exact SKU, actual wall draw, bar positions, sensor, spectrum, room surfaces and crop plane would permit a comparison. Fitting one center value would not validate the spatial field or predict crop outcomes. Until then, no uncertainty interval with a statistical interpretation is available.

## Detailed manufacturer-based rack extension

The [TRINITY rack model](05_trinity_rack_geometry.md) computes all six shelf-deck elevations from a chosen lower datum plus five independent whole-inch pitches. The 72/77-inch feet/wheels extents and one-inch adjustment increment are manufacturer data. The initial 8-inch lower-deck datum is an assumption. Moving all shelves by the same floor/base offset leaves canopy clearance invariant.

Grid mounting uses `wire-deck depth + mounting gap + fixture height`; rail mounting uses `rail depth + suspension gap + fixture height`. A measured drop replaces either component sum. Medium elevation uses `2 × base-wall proxy + nesting separation + fill`; a measured elevation replaces that sum. Rail depth does not enter the grid-mount lamp drop, avoiding double subtraction. See the dimension evidence page for each value's class.

The selected bay’s gap feeds the existing finite-bar optical illustration through a precision-preserving transfer link. No optical calibration is added. Suggested integer pitch uses `ceil(drop + medium elevation + shoots + desired gap)`; the requested gap is a user planning choice, not a crop threshold.

Validation adds `test-rack.cjs` and `test-rack-interactions.cjs`: caster/translation invariance, five independent bay pitches, grid/rail differences, measured overrides, nested tray calculations, invalid/fill/frame boundaries, selected-bay transfer and the older unlit germination layout. The main interaction test also verifies imported offset precision. Browser visual QA remains separately limited.

## No-overhang planning default

The detailed rack page retains a 24-inch default footprint. The lighting planner opens with two purchased Barrina T8 shop lights on the retained 18-inch layout. A separate Microgreen Manager original preset uses the 18-inch source rack, two 22 W bars, five lit shelves and 14-inch assumed bar separation. It is a reference reconstruction and displays the tray-fit warning; the MGM-method adaptation remains 24 inches deep. The 18-inch source rack remains labeled as a reference. The rack model tests its 21-inch manufacturer tray length against shelf depth; the 18-inch reference has 1.5-inch overhang per side and cannot transfer as a no-overhang plan. The main light-spread illustration retains its separately disclosed 21.25-inch example rim, which also fits the 24-inch default. Default MGM-method bar positions are adapted to 2-inch insets on 24-inch depth (20-inch separation); original 18-inch reference positions remain historical reconstruction.


### Current default layout and height

Opening the lighting planner selects `barrinaT8` (2 × 40 W, 137.5 lm/W from the user-supplied B07G2Q4VZN listing) and initializes every layout control from that preset, plus 16 hours/day. Shoot height uses one slider, defaulting to **1.5 inches above medium** across all lighting presets and the detailed rack page. This is an editorial mid-growth planning example, not a measured average across crops or a documented MGM height. There are no first-light, harvest-height or stage controls.

The mounted light-face gap at that height is `10 − 1.78 − 1.275 − 1.5 = 5.445 in`. Editing the height updates clearance and relative spread and retains the existing measured-PPFD invalidation rule. A transferred rack bay keeps its supplied height; export records the displayed height in `layout.growth`.

### Height and time-average exposure

The optical model is nonlinear with distance. A representative height does not establish time-average PPFD. The automatic estimate has no calibrated stage-specific PPFD or measured growth trajectory, so dose continues to use `PPFD × hours × 0.0036 × lit days` for the separately selected constant-light scenario. Crop-specific readings remain the way to replace that assumption.


## Absolute estimate equations and validation

`PPF_per_bar (µmol/s) ≈ watts_per_bar × selected_lumens_per_watt (lm/W) / 60 (lm per µmol/s)`

`PPFD(x,y) ≈ field_in_inches(x,y) × PPF_per_bar / (0.0254 m/in)²`

`median_PPFD = average of sorted samples N/2−1 and N/2` (even sample count).

For the retained MGM comparison preset the result is 80.9714 median PPFD, 4.66395 DLI at 16 hours and 32.64767 mol/m² over seven days. Sampled minimum/maximum are 33.8767 / 115.2513 PPFD. These figures reproduce the model, not an installed-system benchmark.

Additional tests check true median versus range midpoint, square-inch conversion through the default numeric benchmark, linearity with wattage, finite zero output, invalid geometry, sensitivity to placement/height/length, independence from rack count/tariff, and the photon budget collected by the canopy. Numerical integration of a single emitter over a disk reproduces the analytical `R² / (R²+h²)` flux fraction. UI tests exercise automatic default, live watts/geometry updates, reference-status changes, manual overrides, measured invalidation and exported assumptions. Normalized relative geometry remains independent of watts; its absolute scale now changes with the assumed output.

Source: [Iowa State Extension L28](https://yardandgarden.extension.iastate.edu/how-to/how-determine-how-much-supplemental-light-provide-indoor-plants); [Hykolity L11](https://www.hykolity.com/products/led-shop-light-4ft-t5-integrated-single-fixture-22w-2200lm-6500k). These support rough inputs, not the actual MGM canopy reading.


## November 2, 2026 — purchased T8 default

The supplied [Barrina B07G2Q4VZN listing](https://www.amazon.com/dp/B07G2Q4VZN) states 40 W, 5,500 lm and 5000 K per nominal four-foot fixture, six per pack. The default uses two per shelf (80 W), with 137.5 lm/W. All other geometry and the 16-hour schedule are retained; 46.1-inch length and 1.78-inch mounted drop are provisional carried-over assumptions, not T8 measurements. The default model gives 202.4285 median PPFD, 11.6599 DLI and 81.6192 mol/m² over seven days. The V-shaped fixture’s actual angular output is not reproduced by the downward Lambertian assumption. Six fixtures cover three shelves, while the retained five-lit-shelf rack scenario requires ten. Rack transfer uses the T8 lamp settings with the supplied bay geometry. Tests check the selected default, switching presets, editable efficacy, output/export consistency, power totals and legacy comparison behavior.
