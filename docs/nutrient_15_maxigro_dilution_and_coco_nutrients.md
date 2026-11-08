# MaxiGro for coco-coir microgreens: grams, dilution and practice

Researched November 8, 2026. [Open the mixing visualizer](site/dist/nutrients.html) · [Source notebook](source_docs/nutrients/research_resource_log_2026-11-08.txt).

## Start with a measured comparison

Your selected product is **General Hydroponics MaxiGro 10-5-14 dry fertilizer, 2.2 lb**. The updated default is **1.60 g MaxiGro plus 2,000 g fresh water** (about 2 L): **0.80 g/L**, approximately **80 mg/L added nitrogen and 112 mg/L potash (K₂O)**. This is an **OceanSolution-inspired trial**, chosen to approximate the nitrogen and potash in On The Grow’s OceanSolution recipe **if the liquid density is 1.00 g/mL**. That density is an illustrative assumption, not a verified product specification. It is not a full chemical substitute or a demonstrated crop optimum. [N01,N04,N10,N11; derived model]

The earlier **0.50 g/L** default remains available as the **conservative comparison** (50 mg/L N). Both 0.50 and 0.80 g/L sit within Penn State's general 50–100 mg/L N guidance; the guidance does not validate this specific brand comparison. Read the bag's directions before use. [N01–N03]

Use plain water through germination. For unfertilized coco coir, trial feed when seedlings go under lights and bottom-watering begins. Keep a plain-water comparison; extra nutrients are not automatically useful in a fertilized potting mix. [N02,N04]

**Finding:** extension guidance supports a modest nutrient trial; brand-specific superiority and your best concentration remain unmeasured. Test the same crop, seed lot and coir at water-only, 0.50 and 0.80 g/L over repeated trays before increasing strength. Record actual applied water, saleable harvest, color, tip condition and loss. [N02,N03; project trial design]

## Simple weighing cards

Tare a clean container, weigh the **water first**, then add the separately weighed powder. These are grams of water **before** fertilizer; do not subtract fertilizer from the water weight.

| Water to weigh | Ocean-inspired default: 0.80 g/L | Conservative: 0.50 g/L | Stronger comparison: 0.90 g/L |
|---:|---:|---:|---:|
| 500 g | 0.40 g | 0.25 g | 0.45 g |
| 1,000 g | 0.80 g | 0.50 g | 0.90 g |
| 2,000 g | **1.60 g** | 1.00 g | 1.80 g |
| 4,000 g | 3.20 g | 2.00 g | 3.60 g |
| 10,000 g | 8.00 g | 5.00 g | 9.00 g |

At the new default, **1 g MaxiGro goes into 1,250 g water**. Use a scale with 0.01 g readability for small batches. With a whole-gram kitchen scale, 1.60 g would round to 2 g, a 25% change: use a fine scale or a larger batch such as **5,000 g water + 4 g MaxiGro**. Readability is not accuracy. The calculator flags rounding error above 10%; this is project weighing advice, not a plant-tolerance boundary.

### Which rate has which evidence?

- **0 g/L:** water-only control, and default for germination or nutrient-bearing mix.
- **0.50 g/L:** 50 mg/L added N; conservative project adaptation of extension guidance.
- **0.80 g/L:** 80 mg/L N; new OceanSolution-inspired default, assuming 1.00 g/mL liquid density for a partial N/K₂O comparison.
- **0.90 g/L:** 90 mg/L N; stronger comparison, not a verified density correction.
- **1.00 g/L:** 100 mg/L added N; upper end of that general guidance, offered as a comparison.
- **1.25 g/L:** 125 mg/L added N; derived from the older manufacturer label's metric low end, 5 g per 4 L. Not the opening recommendation. [N01,N02,N05]

On The Grow reports using one teaspoon of MaxiGro per US gallon. A teaspoon of powder is not an exact mass. Also, **4 L and one US gallon (3.785411784 L) differ**: 5 g/4 L is 1.25 g/L; 5 g/US gal is about 1.321 g/L. The calculator never treats them as equal. The old label PDF is search-index accessible but its live URL now returns 404; the reference remains explicitly historical. [N04,N05]

## OceanSolution: what the popular ratio means

You likely mean **OceanSolution 2-0-3**, a formulated sea-mineral liquid with added nitrogen and potassium, rather than raw seawater or OceanSolution PURE. The manufacturer gives a general one-ounce-per-gallon direction; On The Grow's firsthand microgreen method uses half an ounce per gallon. Those are different use cases, and the creator method is not a label replacement. [N04,N06]

Interpreting the liquid measure as US fluid ounces, **0.5 US fl oz per US gallon = 14.79 mL per 3.785 L = 3.906 mL/L**. For roughly 2,000 g water, that is 7.81 mL of the liquid. Its **grams cannot be calculated accurately without the actual product density**: liquid grams = mL × measured density in g/mL. Neither mL nor fluid ounces can be treated as powder grams. The visualizer keeps the liquid dose in mL; its nutrient comparison separately and explicitly assumes 1.00 g/mL. It does not present an assumed liquid mass as a measurement. [N04; unit conversion]

On The Grow's preference is grower experience with affiliate links, not a controlled published demonstration of a universal winner or a market-share measurement. There is no basis here for calling it the most popular nutrient overall. Use the MaxiGro you selected for a controlled trial before buying another fertilizer. [N04,N06; project inference]

**Finding:** product identity and units explain the ratio. They support a conditional N/K₂O approximation, not equal EC, sodium, crop uptake, yield or nutrition between the products. N-P-K is a product analysis; 10-5-14 and 2-0-3 are not mixing ratios. [N01,N06]

## Formula for the OceanSolution-inspired default

On The Grow’s 0.5 US fl oz/US gal converts to **3.90625 mL/L**. Using OceanSolution’s 2% N and 3% K₂O analysis as mass fractions, with **assumed liquid density ρ = 1.00 g/mL**, the estimated additions are:

```text
Ocean N (mg/L)   = 3.90625 × ρ × 0.02 × 1000 = 78.125 × ρ
Ocean K₂O (mg/L) = 3.90625 × ρ × 0.03 × 1000 = 117.1875 × ρ
MaxiGro N (mg/L)   = dose_g_per_L × 0.10 × 1000
MaxiGro K₂O (mg/L) = dose_g_per_L × 0.14 × 1000
N-matching MaxiGro rate   = 0.78125 × ρ g/L
K₂O-matching MaxiGro rate = 0.8370536 × ρ g/L
```

At ρ = 1.00, **0.80 g/L** is a practical rounded compromise between those two rates. The two products have different N:K₂O proportions, so no single MaxiGro dose can match both exactly. The choice is not claimed to minimize a formal error function. [N01,N04,N10; calculated]

| Approximate addition per starting-water litre | OceanSolution at OTG rate, assumed ρ = 1.00 | MaxiGro at 0.80 g/L |
|---|---:|---:|
| Total N | 78.1 mg/L | 80 mg/L (**+2.4%**) |
| Potash, expressed as K₂O | 117.2 mg/L | 112 mg/L (**−4.4%**) |
| Nitrate N | 78.1 mg/L | 68 mg/L |
| Ammoniacal N | None listed separately | 12 mg/L |
| Phosphate, expressed as P₂O₅ | Not quantified in the consulted label | 40 mg/L |
| Calcium / magnesium / sulfur | Not quantified in the consulted label | 48 / 16 / 24 mg/L |

These are calculated fertilizer contributions, not laboratory results. K₂O is the fertilizer-label potash convention, **not elemental potassium**. An unquantified OceanSolution nutrient is not assumed absent. Different nitrogen forms and unmodeled sea-mineral/salt contributions prevent full chemical equivalence; equal N/K₂O does not imply equal EC or harvest performance. [N01,N10]

### Density sensitivity

| Assumed OceanSolution density | N-matching MaxiGro | K₂O-matching MaxiGro | Arithmetic midpoint, rounded |
|---:|---:|---:|---:|
| 1.00 g/mL | 0.781 g/L | 0.837 g/L | 0.81 g/L |
| 1.05 g/mL | 0.820 g/L | 0.879 g/L | 0.85 g/L |
| 1.10 g/mL | 0.859 g/L | 0.921 g/L | 0.89 g/L |
| 1.15 g/mL | 0.898 g/L | 0.963 g/L | 0.93 g/L |

This is a **sensitivity table**, not measured density or a statistical confidence interval. The opening recipe stays at 0.80 g/L; the 0.90 g/L preset is a comparison trial, not an automatic correction. A trustworthy product density specification or repeated net-mass measurements of a known liquid volume would refine the arithmetic. New measurements would still not validate a crop outcome. [Derived model; N11 is user-supplied analysis, not independent evidence]

The verified Canadian OceanSolution label lists a 0.5–0.75 oz/gal hydroponic application. Its EC/“ppm” advice belongs to that product and water/system context; **do not raise MaxiGro to imitate OceanSolution’s EC**. The historical GH general label rate and OTG’s separate MaxiGro teaspoon recipe are not the basis for the 0.80 g/L partial match. The supplied note’s reference to a 2.7 g/gal GH feed chart was not independently reverified in this follow-up and is not used to justify this default. [N04,N05,N10]

## Mixing and best practice

1. Use clean fresh water and a clean mixing container. Hydrate and prepare coir separately; this calculator is for feeding solution, not coir hydration or buffering.
2. Weigh water, then the dry MaxiGro. Mix thoroughly until dissolved before application. Add no OceanSolution, salt, calcium nitrate or Cal-Mag by default; MaxiGro is a stand-alone fertilizer. Persistent undissolved material is a reason to recheck mixing/product instructions. [N01]
3. Measure the final pH after dissolution. GH describes 5.5–6.5 as a common hydro/soilless range; On The Grow uses the narrower 5.5–6.0. The Ocean-inspired 0.80 and 0.90 g/L presets use **5.5–6.0** as their trial pH target; the other feed presets retain GH’s common 5.5–6.5 guidance. These are guidance ranges, not crop-outcome guarantees. Recheck an out-of-band reading and follow product instructions; no acid/base dosing is predicted here. [N01,N04]
4. Record EC in **mS/cm**, preferably using a calibrated meter, along with source-water EC, temperature and strength. A recipe cannot predict final pH or EC from mass alone. Nitrogen mg/L is not the same as a TDS meter's “ppm.” There is no universal EC pass/fail value in this tool. [N03; model boundary]
5. Bottom-water after germination as the crop needs it. Batch size is how much solution you mix, not a prescription to pour all of it into a tray. Keep foliage dry and avoid standing water. [N04]
6. Mix only what you expect to use promptly; keep the powder dry and sealed. A nutrient solution has no validated shelf life in this calculator. If tips burn, growth stalls or media stays wet, check concentration, watering and environment before adding more. Compare repeated trays in the grow log.

## Model, assumptions and controls

**Decision supported:** how many grams of the selected dry product to add to a chosen mass of water for a bounded coco-coir trial.

- Controlled input: water mass, 250–100,000 g. A slider covers 250–10,000 g; the number field supports larger batches. Increasing water scales powder while holding the selected rate constant.
- Goal/mode: unfertilized coir under lights, germination, or fertilized mix. The latter two select water-only; they cannot accidentally output a fertilizer dose.
- Locked source-derived rates: 0, 0.50, 0.80, 0.90, 1.00, 1.25 g/L, each carrying its evidence label. Higher rate at fixed water raises product and calculated added N; actual crop response is unknown.
- Confidence input: scale readability, 0.01, 0.1 or 1 g. Only rounded mass and weighing advice change.
- Measured outputs: optional final pH (0–14) and final EC (0–20 mS/cm). The EC maximum is an input sanity limit, not a crop threshold. Blanks never become zero. A pH warning takes precedence over a missing EC reading. EC is recorded without an invented target.
- Stop signal: persistent solids or suspected crop injury. Suppresses the recipe and advises checking the cause. Invalid input also suppresses all recipe quantities.
- Derived outputs: exact and scale-rounded fertilizer grams; approximate nitrogen and potash; total initial mixture mass; OceanSolution volume and conditional N/K₂O comparison.

Equations:

```text
water_L ≈ water_g / 1000
powder_g = water_L × rate_g_per_L
added_N_mg_per_L ≈ rate_g_per_L × 0.10 × 1000
mixture_mass_g = water_g + powder_g
rounded_g = round(powder_g / scale_step_g) × scale_step_g
rounding_error_percent = 100 × (rounded_g − powder_g) / powder_g
added_K2O_mg_per_L ≈ rate_g_per_L × 0.14 × 1000
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
- **N10:** [OceanGrown Canada, OceanSolution 2-0-3 guaranteed analysis](https://oceangrowncanada.com/assets/files/OceanSolution%202-0-3.pdf) · [offline label](site/dist/sources/OceanSolution-2-0-3-label.pdf). Product label, no density specified.
- **N11:** User-supplied OceanSolution matching analysis and bucket-storage discussion, preserved privately. Arithmetic was independently recalculated; unsupported storage-day/temperature claims are not adopted as validated shelf life.
- **N07:** User-supplied Amazon listing, privately preserved with account/address text excluded from the public build. Identifies selected product; marketplace reviews and price are not agronomic evidence.

The [source notebook](source_docs/nutrients/research_resource_log_2026-11-08.txt) records access failures, source classes and preservation. [Coir guide](site/dist/coir-guide.html) covers preparation; [grow log](site/dist/grow-log.html) records actual tray response. The wider archive's nutrient strategy retains the cross-crop evidence synthesis.
