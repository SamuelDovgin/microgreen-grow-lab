# Seed density, growing families and water for 1020 trays

*Research pass: November 1, 2026. [Open the integrated planner](site/dist/crops.html), [complete crop catalogue](09_species_density_and_protocol_catalog.md), [creator-caption review](08_creator_transcript_density_and_water_review.md), [model specification](10_crop_model_equations_and_validation.md), and [source recovery log](source_docs/research_resource_log_2026-11-01.txt).*

## What works as a starting point

Use a named crop/cultivar, a defined harvest product, a measured growing surface and **one source recipe**. For many small brassicas, Johnny’s lower seed-use 2017 greenhouse observations supply a defensible first trial: broccoli 13 g, Red Russian kale 10 g, red cabbage 10.5 g, kohlrabi 9.5 g and mizuna 9.5 g per nominal 1020. These were successful sowings, **not density optimization experiments**. Faster cotyledon-stage commercial systems can use higher rates: MGM’s dated tables use roughly 18–22 g for several of those crops, with shorter cycles. The evidence does not establish that either system wins for most growers. [D02,D04,D05]

The strongest practical generalization is **uniform seed distribution, good seed/medium contact, an aerated root zone, appropriate emergence moisture, and a harvest-stage definition**. “More grams” is not inherently better. Small-seed mixtures, radish, large peas, hull-on sunflower, mucilaginous basil and multigerm beet are different populations even when sold in the same tray size. [D01,D25,D26]

The visualizer opens with the **calculated research starting plan**: the chosen source’s seed mass scaled to your actual planted surface, with a 100% trial factor. This is the closest defensible default to an “ideal formula” without inventing unsupported biological coefficients. Count mode can calculate a desired emerged population from measured seed-lot inputs. A separate optimizer chooses the best **observed** density for your selected goal when comparable response data exist. It does not generate a fictional yield curve for every species.

Selecting a source restores its documented medium category and light hours when those are known. Exact fill depth, water capacity, top load and emergence assumptions remain labeled scenarios. A crop, source or substrate change resets measured-water mode so that the old tray weights are not silently reused for a different root zone.

**What this section found:** extension methods support the arithmetic; paired supplier and creator observations establish useful starting recipes. They do not establish a single cross-species, cross-substrate optimum. [D01–D05,D26]

## First normalize the tray

“1020” is a product category, not a measurement of usable planted surface. Measure at the actual sowing plane, excluding rims and unused channels. Record root-zone depth separately: equal area does not imply equal medium volume or water reserve.

For a rectangular surface:

`A(in²) = usable length(in) × usable width(in)`

`A(cm²) = A(in²) × 6.4516`

`A(m²) = A(in²) × 0.00064516`

A nominal 10 × 20 in surface is **200 in² = 1,290.32 cm² = 0.129032 m²**. A 19.75 × 9.5 in growing surface is 187.625 in², or **6.19% smaller**. A nominal 13-g recipe becomes 12.20 g on that surface when the source’s nominal reference is treated as 200 in². That final assumption remains approximate if the source never measured its interior tray area. [D01]

There were two arithmetic errors in older crop pages, corrected during this pass: the chia page had called 10 × 20 in 0.093 m²; it is 0.129032 m². A buckwheat page had written 20 g per 800 cm² as 25 g/m²; it is **250 g/m²**. The approximately 30-g conversion to 1,210 cm² in that buckwheat page was already consistent with 250 g/m². Neither correction changes the separate crop-specific food-use limitations in those pages.

## Seed mass is a conversion, not the biological target

An empirical mass recipe and a target live population answer different questions.

**Source recipe mode** scales a published dry mass:

`m = reference dry seed grams × A / reference A × trial factor`

Do not automatically divide an already successful source recipe by germination. The source mass already produced a stand under its own unreported lot conditions. Doing so assumes an unreported reference germination and can overcompensate. Expected stand is displayed separately using the entered lot assumptions. [D01,D02]

**Target emerged-shoot mode** sets a live population and calculates the required input:

`m = target emerged shoots/in² × A(in²) / [planting units/g × germination fraction × conditional establishment fraction × shoots/viable unit]`

This generalizes the Penn State count-to-mass calculation. The extra establishment and shoots-per-unit terms are explicit bookkeeping extensions. Establishment is conditional on germination, preventing double counting the same loss. A low germination result is a reason to investigate lot quality, not an unlimited license to add dead seed. [D01]

For a study that prescribes **seeds sown/cm²**, such as the mung/lentil experiment, use its sown count directly:

`m = sown seeds/cm² × A(cm²) / lot seeds/g`

Dividing that rate by germination would change the experimental treatment into a different live-stand target. The tool keeps those modes distinct. [D11]

### Seed-lot measurement and count units

Count several representative samples, weigh the dry samples, and divide total count by total dry mass. With small seeds, a 0.01-g scale and a sufficiently large sample are more useful than a nominal tablespoon. Repeat samples reveal within-lot variation. A packet’s approximate seeds-per-pound value converts with `seeds/g = seeds/lb ÷ 453.59237`. Wet seed mass after soaking is not the dry seed input. [D01]

The app’s broccoli 281 units/g, beet 53 units/g and mustard 530 units/g examples come from Maryland Extension. Arthur et al. supply measured hundred-seed weights for their research lots of Dark Opal basil, chives, scallion and shiso. **Most other count examples are openly labeled illustrative**, not newly measured or verified cultivar constants. Replace them before interpreting the expected plant count as your lot’s result. The source-based default mass does not depend on these illustrative counts, except the two explicitly count-based legume study presets. [D07,D15]

Beet/chard units can be multigerm fruit clusters. Whole cilantro fruit contains two mericarps, while split cilantro changes the planting unit and units/g. One whole fruit cannot simply be treated as one split seed or one emerged plant. Leave shoots/unit at 1 unless you measure a different relationship. [D18,D19]

**What this section found:** area and count conversion are exact arithmetic; germination, size, establishment and embryos per unit require actual lot data. The published count-density target itself remains a biological hypothesis to test. [D01,D07,D11,D15,D18,D19]

## Variables that change the useful density

| Variable | Why it matters | What the planner does | What remains a measurement |
|---|---|---|---|
| Species and cultivar | Seed reserves, leaf size, vigor, stem form and crop endpoint differ | Separate identities and source recipes | Local cultivar performance and demand |
| Seed lot and seed size | Same grams can contain different numbers of planting units | Units/g, germination, establishment, multigerm controls | Representative lot tests |
| Harvest stage | Cotyledons, first true leaves and larger herb leaves need different space and time | Source-specific day windows and an adjustable checkpoint | Actual developmental stage and flavor |
| Usable tray area | Nominal tray size can overstate planted area | Exact area conversion and mass scaling | Interior dimensions at sowing plane |
| Root-zone depth | Changes stored water, rooting space and saturation behavior | Volume and water-buffer calculation | Real fill depth, compaction and drainage |
| Substrate | Aeration, hydraulic continuity, water retention and nutrient supply vary | Seven substrate scenarios and editable retention | Measured water retention and EC |
| Irrigation | Dense stands can exhaust water rapidly; saturated pores limit oxygen | Conditional measured-weight refill and uncertainty | Real water loss, drainage, uniformity |
| PPFD, spectrum and hours | Carbon gain, morphology and water loss differ | PPFD and photoperiod → DLI; source comparisons | Canopy light map and crop response |
| Temperature and RH | Emergence, growth, transpiration and condensation change | Air VPD diagnostics and recorded scenario | Leaf/root temperatures and canopy microclimate |
| Air movement | Dense patches can be stagnant; excessive flow dries edges | Observation control and diagnostic notes | Spatial airflow and tray loss |
| Fertility, pH and EC | Inert media and long herb cycles differ from short seed-reserve crops | Record pH/EC; highlight context | Measured nutrient program and crop-specific trial |
| Distribution, cover and load | Clumping, poor contact, sticky seed and crushed shoots affect stand | Separate dome/contact/light-stack and optional stretch phases | Sowing uniformity and a physically suitable load |
| Product and sales goal | Highest gross mass can lose to better leaves, less seed or faster turnover | Explicit objective and actual saleable CSV | Trim, rejected crop, sold mass, labor and realized price |

No primary source consulted supplies a valid all-crop formula such as “multiply seed mass by 1.2 for coir” or “reduce it by 15% at 70% RH.” The tool therefore does **not** hide fabricated multipliers behind these sliders. Changing the root zone changes the water arithmetic; changing temperature/RH changes VPD; changing light changes DLI. Automatic seed-rate corrections require matched experimental response data. [D06–D10,D26]

## What density experiments actually show

### Density × light: four distinct crops

de Lima et al. crossed three density levels with four PPFD levels, with three trays per treatment, in four independent species experiments. They used 2-cm coir, nutrient solution, about 25°C, four days stacked/dark, then six light days at 16 h/day before day-10 harvest. Their published area and printed dimensions differ slightly; this tool preserves their **area-normalized rates** without pretending they were measured 1020 results. [D06]

| Crop / study cultivar | Sowing levels (g/m²) | Fresh yield at those levels (kg/m²) | Useful decision |
|---|---|---|---|
| Sunflower ‘Miúdo’ | 1,275 / 1,700 / 2,125 | 6.5 / 7.9 / 7.4 | Middle rate maximized observed area yield; low rate maximized seed efficiency. |
| Radish ‘Crimson Gigante’ | 272 / 340 / 408 | 3.5 / 4.3 / 5.2 | Yield rose through the highest treatment; an upper optimum was **not located**. |
| Green cabbage ‘Chato de Quintal’ | 126 / 180 / 235 | 2.9 / 3.7 / 4.4 | Higher area yield, declining seed efficiency; upper optimum unknown. |
| Red cabbage | 126 / 180 / 235 | 2.3 / 3.0 / 3.0 | Middle and high rates overlapped in the top statistical group; no measured mass advantage to the extra seed. |

The nominal 200-in² sunflower masses would be approximately 164.5, 219.4 and 274.2 g by arithmetic. Those are much denser than USU’s 48-g household recipe and above several creator recipes. Do not average them: cultivar, nutrient delivery, cycle, crop specification and lot differ. The curves are available as **study explorations**, not the default household prescription. [D03,D06]

### Herbs × media: one family does not predict one substrate answer

Arthur et al. tested five rates, 75–375 g/m², on peat and jute in four herbs over two greenhouse runs, with five replicate trays per combination/run. Responses depended on crop and run. Higher density raised harvested mass in several comparisons, while basil visual quality deteriorated at dense rates, including shoot rot. A numerical fresh-mass maximum can therefore be a poor commercial target. The app includes January **means pooled over both substrates**; those points cannot establish the peat-only or jute-only optimum. [D07]

Common chives at 300 g/m² were in a top-yield group overlapping 375 g/m²; scallion had its highest observed output at the highest tested rate, 375 g/m². These are useful local trial anchors, with different conclusions, despite both being alliums. The tool’s mechanical objective ranking uses the published means; it does not claim statistical separation between overlapping treatments. [D07]

Cowden et al. found that a 50% denser sowing gave about 37% more area biomass overall in their three-brassica cellulose system: input and output did not rise proportionally. Freitas et al. directly studied beet light-quality × density interaction. Its erratum corrects the corresponding author, not the agronomic results. That result still does not supply a universal spectrum multiplier. Dubey et al.’s small-pot work suggests plateaus, but abstract/table discrepancies and the pot-to-tray difference limit translation. [D08,D10,D27,D30]

**What this section found:** controlled trials establish crop- and endpoint-specific tradeoffs. A maximum among tested treatments is not automatically a mathematical interior optimum, a saleable-yield maximum or a profitable operating point. [D06–D10,D27]

## Botanical families versus working protocols

The database has **54 crop/cultivar profiles, 11 botanical families and 17 functional protocol groups**. Profiles are not 54 distinct species: broccoli, cabbage, kohlrabi and cauliflower include botanical varieties of the same species; basil and radish also include cultivar records. Trade-name ambiguities are retained where the exact identity is not established.

Botanical families help organize the crop library. Functional groups describe handling. Shared ancestry does not justify an identical seed rate or watering schedule. Amaranth and beet are both Amaranthaceae; fine-seed amaranth and beet fruit clusters need different sowing and cover behavior. Sunflower, lettuce and Gem marigold are all Asteraceae yet have different seed size, emergence and harvest endpoints.

| Working group | Typical planning window after sowing | Practical shared protocol | Species override |
|---|---|---|---|
| Small brassicas | 2–4 covered days; roughly 8–14 d harvest | Uniform surface sowing, contact cover where appropriate, then light and weight-based bottom watering | Arugula/cress mucilage; kohlrabi and source-specific later harvests |
| Radish | 2–3 covered days; about 7–10 d | Fast emergence, prompt light, close late-stage moisture checks | Cultivar size and desired flavor/texture |
| Basil/chia | Basil often 4–7 covered days, later leaf harvest | Direct sow sticky seeds; maintain surface moisture without pooling | MGM basil dome versus Jonah light stack; chia study uses 48-h cover and day-12 harvest |
| Shiso | 4–7 d emergence planning; 16–28 d | Gentle moisture, cultivar/lot attention, longer crop | Same botanical family as basil does not establish the same mucilage behavior |
| Apiaceae herbs | Roughly 5–10 covered days and 16–25 d total | Prevent seed-zone drying during slow emergence; target recognizable leaves | Celery dome; whole/split cilantro; parsley’s longer cycle |
| Beet/chard | About 4–6 covered days and 14–18 d | Thin medium cover and good contact can aid hull release | Multigerm units, seed-lot vigor and retained hard hulls |
| Amaranth | Roughly 2–3 covered days and 13–18 d | Fine even distribution, gentle moisture, avoid crush/pooling | Tiny seeds can pass through reusable mesh |
| Pea | About 3–4 covered days and 8–12 d | Weigh dry seed, optional source-specific soak, drain, root anchoring | Field versus tendril cultivar and product endpoint |
| Other legumes | Individual crop trial | Match named study and count units | Mung/lentil density and temperature differ; fenugreek has a separate media trial |
| Sunflower | About 3–4 covered days and 8–10 d | Source-specific soak, no piled seed, good roots, hull management | Donny 4-h soak versus USU 12 h; reject universal water volumes |
| Lettuce/chicory handling | Gentle dome emergence, later leaf cut | Surface moisture and ventilation; avoid automatic heavy dark stacking | Only lettuce has a numerical preset in this release |
| Alliums | About 5–10 emergence days and 16–25 d | Prevent prolonged surface drying, manage fine roots and hulls | Chives, scallion and bulb onion have different evidence |
| Cereal juice grass | About 2–3 covered days and 7–12 d | Food-use whole grain, drainage, dense-root monitoring | Wheat supplier rate does not define oat/barley rates |
| Nasturtium | About 4–6 covered days and 10–16 d | Even large-seed sowing and appropriate top dress | MGM’s unsoaked recipe differs from generic large-seed advice |
| Sorrel | Slow emergence; about 21–31 d | Fine seed, carefully maintained surface, suitable long-cycle medium | Later true-leaf endpoint, not a radish-style cotyledon product |
| Cantaloupe | About 3–4 covered days and 10–14 d | Good contact, avoid waterlogged seed | Not a general cucumber/watermelon recipe |
| Gem marigold | About 3–5 emergence days and 18–22 d | Gentle emergence and a defined later leaf stage | Confirm edible cultivar/species and appropriate seed |

These are **generalized planning windows** combining source records and explicit editorial handling guidance. The crop and source recipe override the group. Cover-time examples absent from a source are not presented as measured results from its yield trial. The schedule uses stage cues to leave the cover and assess harvest; it never waits mechanically for every seed to catch up. [D02–D05,D17–D23,V01–V17]

## Water model

### Why the app generates checks before volumes

A reliable “water 400 mL every day” rule would require comparable substrate, fill, initial hydration, root contact, drainage, plant area, developmental stage, radiation, climate and airflow. The sources do not supply that rule across 54 profiles. MGM’s direct hand-watering recording emphasizes weight and feedback; Jonah’s initial-volume examples are conditional. Tavan et al.’s exact reservoir setpoint belongs to a specific kale/hemp/2-L reservoir system, **not a universal medium-moisture percentage**. [D09,D16,V09,V10,V17]

The default therefore generates **morning and late-light checks** and an illustrative water-loss budget. Covered seeds also need a separate surface-moisture check: roots may not yet reach the medium or reservoir. Actual refill is calculated only in measured-weight mode.

### Illustrative storage balance

`bulk medium volume(mL) = A(in²) × fill depth(in) × 16.387064`

`modeled water reserve(mL) = bulk volume × retained-water fraction + accessible reservoir(mL)`

`late-crop loss(mL/day) = entered loss(mm/day) × A(m²) × 1000`

`time to selected depletion trigger(h) = reserve × depletion fraction / loss × 24`

The peat/coir/mat retention values, 30% depletion trigger, 2-mm/day demand, ±40% demand sensitivity, and early-growth ramp are **illustrative assumptions**, not measured crop constants or validated optimal thresholds. The thin mat presets model a smaller intrinsic buffer; nonabsorbent mesh models none unless an accessible reservoir is entered. A larger reserve is not proof of good oxygenation or of safely delaying checks.

### Measured refill

Use the same complete tray assembly and weighing convention. After watering and drainage, record the current target wet mass. Record a defensible usable water reserve and choose a conservative depletion trigger. For water near room temperature, the approximate mass-to-volume conversion is 1 g ≈ 1 mL:

`trigger mass = drained wet target mass − usable reserve × depletion fraction`

`refill now = wet target − current mass, when current mass ≤ trigger; otherwise 0`

Apply in portions, allow distribution and drainage, and reweigh. If the example weights remain unchanged, the output is still an example. Plant biomass, root growth, soak-water uptake, medium settling, changed accessories, retained drain water and reservoir access complicate a long-run mass balance; refresh the target rather than assuming a day-0 mass remains exact until harvest. Record supplied and drained water separately when estimating total use. [D09,V17]

### Climate and light are diagnostics

The app computes air VPD from air temperature and RH and DLI from PPFD × light hours. Air VPD is not leaf VPD without leaf temperature. Evapotranspiration also depends on leaf area, conductance, radiation, substrate evaporation and air movement. Consequently the app does **not** multiply water loss by VPD or DLI and call that a validated crop ET model. Replace the demand input with your measured loss when possible. [D08,D09,D26]

**What this section found:** measurement-led irrigation has stronger support than cross-species fixed dosing. The schedule is a reminder and scenario; the weight-based calculation is conditional on real current inputs. [D09,D16,V17]

## Find the optimum your goal requires

Let `Y(m)` be measured saleable yield at seed mass `m`, `P` the realized sale price, `Cseed` cost/seed gram, `Cother` other variable costs, `T` crop time and `Tc` turnaround. The useful objectives differ:

`seed efficiency = Y / m`

`area productivity = Y / A`

`throughput = Y / [A × (T + Tc)]`

`contribution = P × Y − Cseed × m − Cother`

`contribution per area-day = contribution / [A × (T + Tc)]`

If a validated differentiable response existed at fixed time, an interior economic optimum would satisfy **marginal sale value of extra yield = marginal seed/input cost**. Three disconnected creator yields do not supply that derivative. Fitting a quadratic through them would silently equate different crop systems. The tool instead ranks comparable observed treatments, resolving exact ties with less seed. If the largest tested rate wins, it says the upper optimum was not found. [D06–D08]

For your own CSV, use one crop, substrate, seed lot and harvest stage per comparison. Normalize mass by actual area, group independent trays at the same area-density and days, show the mean and sample SD, and include failed trays at zero saleable grams. The tool rejects mixed contexts and one-rate datasets. It does not claim a p-value, causal substrate effect, confidence interval, or continuous optimum from those rows.

A useful first density screen is **0.75× / 1.00× / 1.25×**, three independently sown trays per rate, shelf-position blocking/randomization, then a repeat across independent crop cycles. Hold the other inputs and intended stage constant. Change media in a separate comparison or a properly replicated factorial design. Record gross harvest, rejected mass, saleable mass, actually sold mass, seed costs, time and labor. Only sellable and sold output belongs in your commercial objective; gross study biomass is an optimistic scenario denominator.

## Scope and recovery

This release deliberately favors traceable common crops over filling every crop name with guessed numbers. It does not add a food-use default for flax, buckwheat, fava or unidentified beans from generic family similarity. Their existing crop/safety profiles remain separate. It also does not supply a numerical oat/barley/cucumber density by analogy with wheat or cantaloupe.

All 54 profiles and per-field evidence classes are available in [JSON](data/crop-protocols.json) and a compact [CSV](data/crop-starting-rates.csv). Eight experimental response curves are kept distinct from source recipes. The 17 video notes preserve passage times and caption-track checksums without redistributing full copyrighted transcripts. Full source titles, URLs, access outcomes, numeric support, limitations and local file hashes are in the [dated recovery log](source_docs/research_resource_log_2026-11-01.txt). Source IDs D01–D30 and V01–V17 resolve there and in the app’s evidence section.
