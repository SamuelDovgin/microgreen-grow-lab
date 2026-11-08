# MaxiGro for coco-coir microgreens: grams, dilution and practice

Researched November 8, 2026. [Open the mixing visualizer](site/dist/nutrients.html) · [Source notebook](source_docs/nutrients/research_resource_log_2026-11-08.txt).

## Start with a measured comparison

Your selected product is **General Hydroponics MaxiGro 10-5-14 dry fertilizer, 2.2 lb**. The default calculator recipe is **1.00 g MaxiGro plus 2,000 g fresh water** (about 2 L): 0.50 g/L product and approximately 50 mg/L added nitrogen. This is a **project trial starting point**, calculated from the product's 10% nitrogen and the lower end of Penn State's general 50–100 mg/L N microgreen guidance. It is not a manufacturer-prescribed microgreen rate or a demonstrated optimum for your crops. Read your bag's directions before use; formulations/instructions can change. [N01–N03]

Use plain water through germination. For unfertilized coco coir, trial feed when seedlings go under lights and bottom-watering begins. Keep a plain-water comparison; extra nutrients are not automatically useful in a fertilized potting mix. [N02,N04]

**Finding:** extension guidance supports a modest nutrient trial; brand-specific superiority and your best concentration remain unmeasured. Test the same crop, seed lot and coir at water-only, 0.50 and 1.00 g/L over repeated trays before increasing strength. Record actual applied water, saleable harvest, color, tip condition and loss. [N02,N03; project trial design]

## Simple weighing cards

Tare a clean container, weigh the **water first**, then add the separately weighed powder. These are grams of water **before** fertilizer; do not subtract fertilizer from the water weight.

| Water to weigh | Starter: 0.50 g/L | Comparison: 1.00 g/L | Label metric low-end reference: 1.25 g/L |
|---:|---:|---:|---:|
| 500 g | 0.25 g | 0.50 g | 0.625 g |
| 1,000 g | 0.50 g | 1.00 g | 1.25 g |
| 2,000 g | 1.00 g | 2.00 g | 2.50 g |
| 4,000 g | 2.00 g | 4.00 g | 5.00 g |
| 10,000 g | 5.00 g | 10.00 g | 12.50 g |

Use a scale with 0.01 g readability for small mixes. If yours reads whole grams, prepare 2,000 g water + 1 g powder at the starter rate rather than trying to weigh 0.25 g. Readability is not accuracy: check repeatability and calibration. The calculator displays rounding error and advises a larger batch when it exceeds 10%; that cutoff is a project weighing rule, not a plant-tolerance boundary.

### Which rate has which evidence?

- **0 g/L:** water-only control, and default for germination or nutrient-bearing mix.
- **0.50 g/L:** 50 mg/L added N; conservative project adaptation of extension guidance.
- **1.00 g/L:** 100 mg/L added N; upper end of that general guidance, offered as a comparison.
- **1.25 g/L:** 125 mg/L added N; derived from the older manufacturer label's metric low end, 5 g per 4 L. Not the opening recommendation. [N01,N02,N05]

On The Grow reports using one teaspoon of MaxiGro per US gallon. A teaspoon of powder is not an exact mass. Also, **4 L and one US gallon (3.785411784 L) differ**: 5 g/4 L is 1.25 g/L; 5 g/US gal is about 1.321 g/L. The calculator never treats them as equal. The old label PDF is search-index accessible but its live URL now returns 404; the reference remains explicitly historical. [N04,N05]

## OceanSolution: what the popular ratio means

You likely mean **OceanSolution 2-0-3**, a formulated sea-mineral liquid with added nitrogen and potassium, rather than raw seawater or OceanSolution PURE. The manufacturer gives a general one-ounce-per-gallon direction; On The Grow's firsthand microgreen method uses half an ounce per gallon. Those are different use cases, and the creator method is not a label replacement. [N04,N06]

Interpreting the liquid measure as US fluid ounces, **0.5 US fl oz per US gallon = 14.79 mL per 3.785 L = 3.906 mL/L**. For roughly 2,000 g water, that is 7.81 mL of the liquid. Its **grams cannot be calculated accurately without the actual product density**: liquid grams = mL × measured density in g/mL. Neither mL nor fluid ounces can be treated as powder grams. The visualizer therefore keeps OceanSolution as a volume comparison and gives no invented gram equivalent. [N04; unit conversion]

On The Grow's preference is grower experience with affiliate links, not a controlled published demonstration of a universal winner or a market-share measurement. There is no basis here for calling it the most popular nutrient overall. Use the MaxiGro you selected for a controlled trial before buying another fertilizer. [N04,N06; project inference]

**Finding:** product identity and units explain the ratio. They do not establish equal nitrogen, EC, sodium, crop uptake, yield or nutrition between the two products. N-P-K is a product analysis; 10-5-14 and 2-0-3 are not mixing ratios. [N01,N06]

## Mixing and best practice

1. Use clean fresh water and a clean mixing container. Hydrate and prepare coir separately; this calculator is for feeding solution, not coir hydration or buffering.
2. Weigh water, then the dry MaxiGro. Mix thoroughly until dissolved before application. Add no OceanSolution, salt, calcium nitrate or Cal-Mag by default; MaxiGro is a stand-alone fertilizer. Persistent undissolved material is a reason to recheck mixing/product instructions. [N01]
3. Measure the final pH after dissolution. GH describes 5.5–6.5 as a common hydro/soilless range; On The Grow uses the narrower 5.5–6.0. These are guidance ranges, not crop-outcome guarantees. Recheck an out-of-band reading and follow product instructions; no acid/base dosing is predicted here. [N01,N04]
4. Record EC in **mS/cm**, preferably using a calibrated meter, along with source-water EC, temperature and strength. A recipe cannot predict final pH or EC from mass alone. Nitrogen mg/L is not the same as a TDS meter's “ppm.” There is no universal EC pass/fail value in this tool. [N03; model boundary]
5. Bottom-water after germination as the crop needs it. Batch size is how much solution you mix, not a prescription to pour all of it into a tray. Keep foliage dry and avoid standing water. [N04]
6. Mix only what you expect to use promptly; keep the powder dry and sealed. A nutrient solution has no validated shelf life in this calculator. If tips burn, growth stalls or media stays wet, check concentration, watering and environment before adding more. Compare repeated trays in the grow log.

## Model, assumptions and controls

**Decision supported:** how many grams of the selected dry product to add to a chosen mass of water for a bounded coco-coir trial.

- Controlled input: water mass, 250–100,000 g. A slider covers 250–10,000 g; the number field supports larger batches. Increasing water scales powder while holding the selected rate constant.
- Goal/mode: unfertilized coir under lights, germination, or fertilized mix. The latter two select water-only; they cannot accidentally output a fertilizer dose.
- Locked source-derived rates: 0, 0.50, 1.00, 1.25 g/L, each carrying its evidence label. Higher rate at fixed water raises product and calculated added N; actual crop response is unknown.
- Confidence input: scale readability, 0.01, 0.1 or 1 g. Only rounded mass and weighing advice change.
- Measured outputs: optional final pH (0–14) and final EC (0–20 mS/cm). The EC maximum is an input sanity limit, not a crop threshold. Blanks never become zero. A pH warning takes precedence over a missing EC reading. EC is recorded without an invented target.
- Stop signal: persistent solids or suspected crop injury. Suppresses the recipe and advises checking the cause. Invalid input also suppresses all recipe quantities.
- Derived outputs: exact and scale-rounded fertilizer grams; approximate nitrogen; total initial mixture mass; OceanSolution volume comparison.

Equations:

```text
water_L ≈ water_g / 1000
powder_g = water_L × rate_g_per_L
added_N_mg_per_L ≈ rate_g_per_L × 0.10 × 1000
mixture_mass_g = water_g + powder_g
rounded_g = round(powder_g / scale_step_g) × scale_step_g
rounding_error_percent = 100 × (rounded_g − powder_g) / powder_g
OceanSolution_mL = water_L × (0.5 × 29.5735295625 / 3.785411784)
```

Room-temperature fresh water is approximated as 1 g/mL. Dissolved powder slightly changes final volume; N is an approximate addition per starting-water litre, not a laboratory analysis. Mineral contributions from water/coir, alkalinity, uptake, ion balance, evaporation and microbial changes are omitted. No pH, EC, yield, disease or storage prediction is made. OceanSolution comparison does not apply in water-only modes.

The callable `NutrientModel.selfTest()` and Node checks cover scaling, unit conversions, roundoff, all modes, invalid inputs, missing measurements, pH boundaries and stop precedence. Browser layout checks are recorded in the QA notes. [Model implementation](site/dist/nutrient-model.js).

## Sources and local access

- **N01:** [General Hydroponics, MaxiGro product and usage guidance](https://generalhydroponics.com/products/gh-maxigro). Current formula and preparation; manufacturer source.
- **N02:** [Penn State, Growing Microgreens](https://extension.psu.edu/growing-microgreens). General fertility guidance, not a MaxiGro trial; search-index text available, direct access 403.
- **N03:** [Virginia Tech, SPES-756](https://www.pubs.ext.vt.edu/SPES/spes-756.html) · [offline extension PDF](site/dist/sources/virginia-tech-microgreen-production-SPES-756.pdf). Crop/system context and formulation limits.
- **N04:** [On The Grow, firsthand nutrient comparisons and method](https://onthegrow.net/blogs/microgreens/best-nutrients-fertilizers-for-growing-microgreens). Grower/affiliate experience; not an independent randomized brand trial.
- **N05:** [Historical GH MaxiGro label URL](https://generalhydroponics.com/wp-content/uploads/General-Hydroponics_label_maxigro.pdf). Indexed metric rate; live URL returned 404 on access date. Check the supplied bag.
- **N06:** [OceanSolution 2-0-3 manufacturer page](https://oceansolution.com/product/oceansolution-203/). Product identity and general-use direction; no density established.
- **N07:** User-supplied Amazon listing, privately preserved with account/address text excluded from the public build. Identifies selected product; marketplace reviews and price are not agronomic evidence.

The [source notebook](source_docs/nutrients/research_resource_log_2026-11-08.txt) records access failures, source classes and preservation. [Coir guide](site/dist/coir-guide.html) covers preparation; [grow log](site/dist/grow-log.html) records actual tray response. The wider archive's nutrient strategy retains the cross-crop evidence synthesis.
