# Seed sanitation: chemicals, timing, crop priorities and evidence

*Compiled November 10, 2026. Scope: the sanitation-planner research and corrections in this project. Evidence labels: experimental result, grower guidance, editorial handling judgment, or hypothetical calculation. None is a product-specific food-safety validation.*

[Open the planner](site/dist/seed-sanitation.html) · [Source-preservation notebook](source_docs/seed_sanitation/research_resource_log_2026-11-10.txt)

## Latest evidence review

### Protocol evidence review

*November 13, 2026. Focused review of controlled seed and spray studies, grower instructions, and extension guidance. I compared crop, treatment stage, and measured outcome before deciding what transfers to a coir-grown microgreen tray. Grower recipes are reported separately because the sources do not establish a reliable consensus dose.*

**For recurring sunflower mold, start with a rinse-and-sow baseline.** Use clean trays, potable water, good drainage, and airflow; bottom-water once the roots can draw from the tray. Check whether the white growth is confined to the roots before treating it as mold. If mold keeps recurring with the same seed lot, a side-by-side comparison with an edible-seed treatment used according to its label is more informative than raising spray strength. [Penn State Extension](https://extension.psu.edu/a-step-by-step-guide-for-growing-microgreens-at-home) · [LSU AgCenter](https://www.lsuagcenter.com/articles/page1625257098667)

| Approach | What the evidence showed | How I’d use it |
|---|---|---|
| Sunflower rinse and sow | On The Grow reports 615 g from a rinsed tray versus 520 g from a water-soaked tray in a side-by-side grow. It did not report replication or measure mold reduction. [Sunflower grow guide](https://onthegrow.net/blogs/microgreens/how-to-grow-sunflower-microgreens) | A sensible baseline. This comparison does not establish that skipping a soak improves yield across seed lots. |
| 3% H₂O₂ seed bath | Bootstrap Farmer describes a 3–5 minute immersion followed by rinsing. A controlled study tested a **different, 10-minute** exposure on amaranth, borage and carrot; yeast and mold counts fell by about 0.8–1.2 log versus no soak and about 0.4–0.9 log versus the water-soak controls. A separate broccoli study found 3% peroxide unreliable against fungal contamination. [Grower method](https://www.bootstrapfarmer.com/blogs/microgreens/how-to-disinfect-seeds-before-planting-and-sprouting) · [Three-crop study, Table 4](https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2023.1264472/full) · [Broccoli study, §3.5](https://pmc.ncbi.nlm.nih.gov/articles/PMC9955435/) | A grower option if the product is labeled for edible seeds. The studies do not establish that the short bath controls mold on sunflower or makes contaminated seeds safe. |
| Electrolyzed chlorine seed baths | A sunflower study measured a **2.39-log Salmonella reduction** at 48 mg/L available chlorine, pH 2.76, and 15 minutes. It did not measure mold. In a separate broccoli sprout experiment, approximately 800 ppm HOCl for 15 minutes reduced culturable bacteria by about 4–5 log and brought fungi below detection, with no statistically significant loss of germination in that comparison. [Sunflower study](https://pubmed.ncbi.nlm.nih.gov/35410797/) · [Broccoli study, §3.5](https://pmc.ncbi.nlm.nih.gov/articles/PMC9955435/) | Positive evidence under the tested conditions. A generator reading of 200 ppm does not reproduce either bath. Neither the 200 ppm timing extrapolation nor a spray dose follows from these results. |
| H₂O₂ foliar spray on sunflower | The greenhouse experiment tested daily sprays through 200 mg/L and recorded plant injury and growth. Sunflower showed no increase in visible damage under those conditions, while radish and arugula showed injury at lower concentrations. On The Grow publishes an optional sunflower spray recipe around 870 ppm, rounded to 900 ppm in the calculator. [Greenhouse study](https://scholars.wlu.ca/etd/2215/) · [Grower spray recipe](https://onthegrow.net/blogs/microgreens/how-to-grow-sunflower-microgreens) | There is no measured mold-control dose here. Keep 900 ppm as a grower reference in the calculator; the tolerance study gives no evidence that 900 ppm is well tolerated. |

Growers also differ on when to use peroxide. On The Grow describes a separate, weaker seed soak for problem lots in its [mold guide](https://onthegrow.net/blogs/microgreens/microgreens-mold-prevention-identification-complete-guide). Bootstrap Farmer’s 3% bath and On The Grow’s sunflower spray answer different questions, so averaging their strengths or times would give a recipe nobody tested.

For the other seeds in the planner, **broccoli** has the closest head-to-head evidence and it favors chlorine over 3% peroxide in that sprout experiment. **Radish** warrants caution with peroxide sprays because the greenhouse study found leaf injury. **Pea** has some evidence for electrolyzed water across an entire sprouting workflow, so the result cannot be assigned to the initial soak alone. **Mung bean** evidence includes a combined electrolyzed water and microbubble treatment; that system does not validate a plain home bath. [Broccoli study](https://pmc.ncbi.nlm.nih.gov/articles/PMC9955435/) · [Radish tolerance study](https://scholars.wlu.ca/etd/2215/) · [Pea sprout study](https://www.sciencedirect.com/science/article/pii/S0956713519301902) · [Mung bean study](https://researchoutput.ncku.edu.tw/en/publications/inactivation-of-salmonella-typhimurium-on-mung-bean-seeds-by-comb/)

To compare performance on your trays, split one seed lot between rinse-only and a labeled seed treatment. Match seed mass, coir moisture, cover time, and airflow. Record emergence, visible mold patches, and usable yield across several batches. Those observations can tell you whether a treatment helps your grow; they cannot establish pathogen reduction or clear a moldy tray for eating.

The [peroxide calculator](site/dist/seed-sanitation.html#hocl-dilution) now has a **3% by weight** seed-soak preset. For 12% stock, weigh **1 part stock to 3 parts water** (125 g and 375 g for a 500 g batch). The preset calculates the mixture. Use the product’s edible-seed directions for contact time and rinsing.

**Foliar use review, November 11.** Commercial HOCl examples, the organic chlorine residual standard, municipal water data and the peroxide label comparison are in [section 15](#15-foliar-sprays-food-contact-and-product-labels).

**50-ppm spray proposal reviewed, November 10:** section 13 compares six primary studies behind the attached assessment. Radish and pea provide relevant sprout-production evidence; broccoli evidence includes a fresh-weight penalty. **50 ppm is a plausible experimental comparison, not a validated twice-daily germination spray for the five coir-grown crops.**

**Recorded spray observation, November 10:** 10 trigger pulls delivered **1.66 g of liquid**. At up to 10 applications, the generator recipe contributes approximately **0.10 g salt-equivalent per 1020 tray**. Assessment: **likely a minor salinity concern in adequately moist, low-salt coir; moderate confidence**, separate from chlorine tolerance or mold-control efficacy. Full calculation and evidence are recorded in section 11 below.

[Tissue-culture seed preparation and lessons for microgreens](19_tissue_culture_seed_disinfection_and_microgreen_protocols.md) adds laboratory workflow, seed-lot effects, culture-versus-pathogen endpoints and a five-crop comparison. It does not validate the calculated badge times.

[HOCl measured studies, log-reduction targets and grower agreement](18_hocl_log_reduction_and_grower_consensus.md) adds direct sunflower Salmonella evidence, FDA’s explicit sprout target, and a firsthand grower comparison. HOCl has positive measured results; the unconfirmed gap concerns particular extrapolated times and transfer to your crop/process. The timing math below is not a validated kill model.

## 1. Why 12% appeared to need longer than 3%

The earlier card combined **12% H₂O₂ for 15 minutes from a broccoli bacterial experiment** with **3% for 3–5 minutes from a grower article**. Different organisms, outcomes and evidence standards made those values unsuitable as points on one concentration–time curve. Their juxtaposition was misleading. It did not show that stronger peroxide biologically requires longer. [S01](https://pmc.ncbi.nlm.nih.gov/articles/PMC9955435/), [S02](https://www.bootstrapfarmer.com/blogs/microgreens/how-to-disinfect-seeds-before-planting-and-sprouting)

The corrected card uses one clearly hypothetical peroxide comparison, anchored to the upper end of that grower guidance: `t = 5 min × 3% / selected %`. It displays **3% → 5 min*** and **12% → 1.25 min***. The latter is **75 seconds of calculated exposure**, not a tested seed-disinfection protocol. Both values remain starred. The 15-minute experimental record remains in the evidence, rather than being silently discarded.

Higher concentration does not establish a proportional improvement, equivalent germination, or a suitable edible-crop use. A shorter calculated time does not make concentrated peroxide an advisable home seed bath. Use the bottle as stock for a suitable labeled dilution. [S09](https://www.poison.org/articles/hydrogen-peroxide), [S10](https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/efficacy-factors.html)

## 2. Experimental evidence and what it actually measured

| Source | Context / treatment | What it supports | Translation limit |
|---|---|---|---|
| [S01 — Gilbert, Diaz & Bregoff, Foods 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC9955435/) | Broccoli factorial experiments; H₂O₂ 3/6/12/30%; HOCl approximately 80/400/800 ppm; 1/5/10/15 min. | Separate concentration and time effects on bacterial contamination and germination. | No fitted exponent for these planner estimates. |
| S01, selected bacterial comparison | 12% H₂O₂ × 15 min. | A selected bacterial-outcome condition without significant germination reduction in that comparison. | Not a fungal-control validation for sunflower, pea or mung. |
| S01, head-to-head fungal comparison | 3% peroxide; approximately 800 ppm HOCl; 0.6% sodium hypochlorite; 5- and 15-minute experiments. | Chlorine treatments performed better; 3% peroxide was inconsistent/ineffective for that mold endpoint. | Culturable contamination on broccoli, not proof of pathogen elimination or label authorization. |
| [S04 — Ocho Bernal et al., Frontiers 2023](https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2023.1264472/full) | Microgreen-seed decontamination, including 3% H₂O₂ and 10-minute soaking; some arms also used heat. | Another experimental context for peroxide. | Do not attribute a combined heat-treatment outcome to peroxide alone; not a 12%-to-3% conversion study. |
| [S05 — Eicher-Sodo research](https://scholars.wlu.ca/etd/2215/) | Daily foliar H₂O₂, 0–200 mg/L, on sunflower, radish and arugula. | Plant injury and growth responses. | Tolerance is not demonstrated mold-control effectiveness; peas, broccoli and mung were outside that trial. |
| [S06 — Food Control 2016](https://www.sciencedirect.com/science/article/abs/pii/S0956713516300913) | Electrolyzed water during radish sprouting; 30/50 mg/L available chlorine in spray comparisons. | Antimicrobial results in that sprout system. | Not a general daily spray for covered coir microgreens. |

S01 used repeated controlled experiments and separately evaluated bacteria, fungi and germination. Outcomes must stay separate. Its authors also cautioned against concentrated peroxide for home seed disinfection. A lawful open-access [article XML copy](source_docs/seed_sanitation/Gilbert-2023-Foods-PMC9955435.xml) is preserved; no raw-data kinetic fit was performed here.

**Finding:** crop, system and endpoint matter. These papers do not establish one universal sanitizer recipe.

## 3. Grower guidance and the five seed priorities

### Grower seed bath comparison

Growers sometimes call this step “sterilizing.” Their published procedures describe seed surface treatments, and their reports leave sterility and foodborne pathogen reduction unverified. The hours-long water presoak hydrates the seed. For sunflower, the [Seed & Water planner](site/dist/crops.html#growing-plan) starts at **8 hours** and includes a rinse-only recipe. If soaking, start with **3 parts potable water to 1 part dry seed by volume** and keep the seed submerged as it swells. [Bootstrap Farmer soaking guide](https://www.bootstrapfarmer.com/blogs/microgreens/microgreens-soaking-seeds-when-why) · [On The Grow sunflower guide](https://onthegrow.net/blogs/microgreens/how-to-grow-sunflower-microgreens)

| Grower | Reported peroxide seed treatment | Contact time and follow-up |
| --- | --- | --- |
| [Bootstrap Farmer](https://www.bootstrapfarmer.com/blogs/microgreens/how-to-disinfect-seeds-before-planting-and-sprouting) | Immerse in **3% finished H₂O₂**, using enough to cover the seed. | **3–5 min**, then drain and rinse thoroughly. |
| [Home Microgreens](https://homemicrogreens.com/growing-sunflower-microgreens-presoaking-the-seed/) | Apply **1 US tsp of 3% H₂O₂ per 25 g of sunflower seed** and stir. | **5–10 min** before adding water for the hydration soak. The grower drains and rinses before sowing. |
| [On The Grow mold guide](https://onthegrow.net/blogs/microgreens/microgreens-mold-prevention-identification-complete-guide) | For problem lots, **1 US tbsp of 3% H₂O₂ per US cup of water**, approximately **0.18% finished**. The grower’s usual sunflower method is rinse and sow. | **15–20 min** before the regular soak in the optional procedure. |
| [Leath sunflower guide](https://growleath.com/blogs/education/sunflower) | **1 US tbsp of 3% H₂O₂ per US cup of water**, approximately **0.18% finished**, in its detailed optional bath recipe. | **5 min**, rinse thoroughly, then water-soak. |

Three of these four guides include **5 minutes**. The median of the four time-range midpoints is **6.25 minutes** (4, 5, 7.5 and 17.5 minutes). The contacts include both immersion and a small-volume seed treatment. This small sample supports a short contact time as a common practice and leaves a consensus concentration or effective time undetermined. The **3% immersion** is Bootstrap Farmer’s example. A **12% w/w stock** makes **3% w/w** at **1 part stock to 3 parts water by weight**. Follow the product’s edible-seed directions for use and rinsing. The **900 ppm** grower-reference spray has a separate calculator.

### How much bath per gram of seed

Bootstrap Farmer gives a **coverage instruction** for its 3% peroxide example: use enough solution to reach about 1 inch above the seeds. It gives no amount per gram. The vessel width and the volume of the seeds determine how much solution reaches that depth. Ocho Bernal et al. used **50 mL for 12 g** of amaranth, borage or carrot seed, about **4.17 mL/g** in their test jars. Canadian sprout guidance gives **5 mL/g** as an immersion-volume benchmark. These sources support a planning estimate for bath volume. They leave the effective amount for a particular sunflower seed lot and peroxide treatment unverified. [Bootstrap Farmer](https://www.bootstrapfarmer.com/blogs/microgreens/how-to-disinfect-seeds-before-planting-and-sprouting) · [Ocho Bernal et al.](https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2023.1264472/full) · [Canadian Food Inspection Agency](https://inspection.canada.ca/en/preventive-controls/fresh-fruits-vegetables/sprouted-seeds)

The calculator defaults to **5 mL of finished bath per gram of dry seed**. For a weight-based aqueous mix it uses **5 g/g** as an approximate equivalent. At **130 g of dry sunflower seed**, this gives **650 g of finished bath** in weight mode. To mix the **3% w/w grower reference** from **12% w/w stock**, weigh **162.5 g stock and 487.5 g water**. Use the edible-seed product label for volume, concentration, contact time and rinsing. Check coverage in your vessel and increase the finished batch at the same concentration if the applicable directions require more liquid. The calculator also accepts a measured finished batch amount directly.

Bootstrap Farmer describes rinsing, a **3% peroxide bath for 3–5 minutes**, thorough rinsing afterward and disposal of spent solution. Its soaking guide discusses larger seeds including sunflower, peas and mung. These are grower procedures, not validated pathogen-kill processes. [S02](https://www.bootstrapfarmer.com/blogs/microgreens/how-to-disinfect-seeds-before-planting-and-sprouting), [S03](https://www.bootstrapfarmer.com/blogs/microgreens/microgreens-soaking-seeds-when-why)

| Seed | Planner priority | Why / boundary |
|---|---|---|
| Sunflower | Yes — prioritize pretreatment | Hulls, presoaking and recurring lot problems justify attention; not proof of greater pathogen prevalence. |
| Pea | Yes — prioritize pretreatment | Large, commonly presoaked seed; keep chemical contact separate from water soaking. |
| Mung bean | Yes — prioritize pretreatment | Large-seed handling context; treatment does not establish a safe raw serving stage. |
| Daikon radish | No routine bath selected | Commonly direct-sown; a decision for this guide, not proof that seed cannot be contaminated. |
| Broccoli | No routine bath selected | Commonly direct-sown; research options do not automatically become routine practice. |

These are **handling priorities**, not rankings of foodborne-pathogen risk. The other 55-profile catalogue labels likewise include editorial judgments. Gel-forming seeds need crop-specific handling rather than a generic soaking rule. University guidance supports drainage, appropriate media and crop-specific soaking practices. [S07](https://extension.usu.edu/yardandgarden/research/grow-your-own-microgreens), [S08](https://gardeningsolutions.ifas.ufl.edu/plants/edibles/vegetables/microgreens/)

**Finding:** “yes” means prioritize the pretreatment decision. It does not endorse every concentration available in the comparison badges.

## 4. Timing models: arithmetic, assumptions and uncertainty

The general illustrative relationship is:

```text
C^n × t = constant
new time = reference time × (reference concentration / selected concentration)^n
```

Neither `n = 1` nor the sensitivity values `n = 0.5–2` were fitted to seed-disinfection data. The sensitivity ranges below are **not confidence intervals or acceptable soaking windows**. They show dependence on unmeasured assumptions. EPA specifically discusses the dangers of extrapolating C–t beyond experimental data; kinetic research also addresses disinfectant dissipation. [S10](https://www.cdc.gov/infection-control/hcp/disinfection-sterilization/efficacy-factors.html), [S11](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=2000TL73.TXT), [S12](https://pmc.ncbi.nlm.nih.gov/articles/PMC7780086/)

### HOCl: unchanged illustrative anchor

Anchor: approximately 800 ppm available chlorine and 15 minutes from the broccoli experiment. [S01] The selector now opens at **200 ppm** for every crop. Its **60 min*** result is an unconfirmed arithmetic comparison outside the studied time range. Actual soak time comes from suitable product directions; the mixing form leaves it blank.

| Selected available chlorine | Linear arithmetic* | Sensitivity with illustrative n = 0.5–2* |
|---|---:|---:|
| 200 ppm | 60 min | 30–240 min |
| 400 ppm | 30 min | 21.2–60 min |
| 600 ppm | 20 min | 17.3–26.7 min |
| 800 ppm | 15 min | 15 min, the reference |

*The 20/30/60-minute outputs exceed the paper’s 1–15-minute window. In particular, testing 400 ppm does not validate 400 ppm for 30 minutes. These are comparison numbers, not suggested soaking durations.*

### Peroxide: corrected common anchor

Anchor: **3% × 5 minutes**, choosing the upper end of grower guidance for a consistent arithmetic comparison. This is not an experimentally established effective dose. [S02]

| Selected bath concentration | Linear arithmetic* | Sensitivity with illustrative n = 0.5–2* | Evidence class |
|---|---:|---:|---|
| 3% | 5 min | 5 min, the reference | Chosen grower-guidance anchor |
| 12% | 1.25 min / 75 s | 0.3125–2.5 min / 18.75–150 s | Untested extrapolation |

*The 12% interval is not a recommendation or a measured tolerance range. A stronger oxidizer can affect seed tissues differently; arithmetic cannot determine efficacy or injury. The same comparison is shown across crops because no crop-specific parameters were measured.*

If concentration changes during treatment, a more realistic exposure proxy would be `D = integral C_active(t)^n dt`. That would require actual concentration measurements and an appropriate model. It still would not establish safety, mold control or a pathogen kill step by itself. [S12]

**Finding:** the corrected curve is internally consistent. Scientific equivalence remains unconfirmed.

## 5. Chlorine chemistry, pH and measurement

HOCl and sodium hypochlorite are related chlorine disinfectants, but products, pH, active-concentration units and labels differ. “0.6% sodium hypochlorite” is not “0.6% of the bleach bottle.” A research use does not authorize a current household product for edible seeds. Bootstrap’s seed guidance and the experimental bleach study have different purposes and should not be merged into a universal bleach recommendation. [S01, S02]

With approximate pKa 7.5, the HOCl fraction of free chlorine can be illustrated by:

```text
HOCl fraction ≈ 1 / (1 + 10^(pH − 7.5))
```

This gives about 99%, 91%, 50% and 9% at pH 5.5, 6.5, 7.5 and 8.5. These are speciation calculations, not recommended seed-bath pH values. Never use them as instructions to acidify bleach or a generated solution. [S13](https://pmc.ncbi.nlm.nih.gov/articles/PMC10461463/)

A generator setting is not a measured bath concentration. Stock age, storage, debris and organic demand can matter. Use a suitable-range chlorine test and record the concentration before and after a research comparison. Diluting 200 ppm stock cannot produce 400 or 800 ppm. [S11, S12]

## 6. Diluting the 12% peroxide bottle

**Bottle strength, final bath strength and exposure time are different inputs.** Owning 12% stock does not require using a 12% bath. Product directions determine intended use; the following table is mass-balance arithmetic only.

For matching weight-percent units:

```text
stock mass = final batch mass × target wt% / stock wt%
water mass = final mass − stock mass
```

| Target from 12% stock | Stock for 1,000 g final batch | Added water |
|---|---:|---:|
| 6% | 500 g | 500 g |
| 3% | 250 g | 750 g |
| 2% | 166.7 g | 833.3 g |
| 1% | 83.3 g | 916.7 g |

This is a **1,000 g batch**, not an exact one-liter recipe. If the bottle uses weight percentages, volume substitution needs density information. The often-cited 250 mL stock + 750 mL water is only an approximate volumetric interpretation for a weight-percent bottle. For compatible mg/L chlorine units, dilution uses the corresponding final volume.

For aqueous dilute comparisons, 100–200 ppm peroxide corresponds approximately to 0.01–0.02%; it is far below 3% or 12%. Those spray-study concentrations must not be confused with seed-bath percentages. [S05]

Use label-specified protection when handling concentrated peroxide. “Food grade” does not mean harmless or authorized for every application. Never combine peroxide, HOCl, bleach, vinegar, ammonia or cleaners with each other. [S09]

## 7. Daily spraying and tray management

The planner does **not** recommend a routine daily HOCl or peroxide spray concentration for the five covered-coir crops. Peroxide plant-tolerance findings and radish aqueous-sprout research do not fill that evidence gap. [S05, S06]

Keep these decisions separate:

- **Before sowing:** seed-lot selection and any suitable labeled pretreatment.
- **During germination:** inspect moisture and drainage; use potable water when needed, without automatic repeated chemical wetting.
- **Between crops:** remove debris, wash/rinse and sanitize empty equipment according to its label. See the [tray-care guide](site/dist/sanitation.html).
- **Visible genuine mold:** the project precaution is to discard the edible tray rather than claim a chemical rescue establishes safety. This is a precaution, not an outcome demonstrated by the timing model.

Root hairs and mold can be confused; diagnose the growth pattern before labeling a tray. Ordinary appearance cannot establish microbiological safety. Water and hygiene remain part of the broader process. [S07, S08, S14](https://extension.psu.edu/ensuring-food-safety-in-microgreens-production)

## 8. Regulatory context and sources that do not validate a recipe

FDA sprout guidance describes a multi-hurdle approach and scientifically valid seed treatments. Microgreens and sprouts have different production and regulatory treatment; applicable requirements depend on the operation. This document does not interpret a particular business’s exemption or authorize a home recipe. [S15](https://www.fda.gov/media/102430/download)

USDA **NOP 5029** concerns organic seed, seedlings and planting stock. It is not a validation for a sanitizer concentration/contact time. Its presence in the supplied planner must not be read as supporting such a recipe. [S16](https://www.ams.usda.gov/sites/default/files/media/5029.pdf)

The supplied planner also listed broader chemistry and extension references. Their scope and access limits are retained in the notebook. Discovery of an unrelated paper’s seed-cleaning method is not the same as a controlled sanitizer efficacy trial.

## 9. Evidence gaps and what would improve the model

Needed: crop/lot-specific microbial outcomes, germination and usable yield; measured active concentration over time; defined pH, temperature, organic load and seed-to-solution ratio; a matched target organism; neutralization and appropriate controls; replicated batches; a lawful applicable product label. No exponent or kill-rate coefficient has been fitted here.

A labeled-treatment comparison against a plain-water control can inform local germination and growing performance. Record seed lot, dry seed mass, actual treatment, measured concentration, contact time, rinsing, germination, visible mold, environmental conditions and usable yield. Such observations do not replace qualified microbiological validation. Keep failed trays in the record rather than excluding them.

## 10. Source access and correction history

- **November 10, 2026:** separated mixed peroxide references from a common timing curve; fixed both badges to one explicit assumption; preserved the 12%/15-minute result as evidence; documented uncertainty and source scope.
- [Verbose source notebook](source_docs/seed_sanitation/research_resource_log_2026-11-10.txt): stable IDs S01–S19, access limits, claims, preserved files and hashes.
- [Capture manifest](source_docs/seed_sanitation/capture-manifest.json).
- [Main paper XML](source_docs/seed_sanitation/Gilbert-2023-Foods-PMC9955435.xml) and [USDA guidance PDF](source_docs/seed_sanitation/USDA-NOP-5029-seeds.pdf).
- Additional context: the archive’s [hydroponic intervention review](../06_food_safety/05_hydroponic_intervention_evidence_review.md). It reinforces the importance of system-specific interpretation; it was not used to fit these timing estimates.

### Source identifiers

S01 Gilbert et al. (2023), *Foods* 12(4):747, DOI 10.3390/foods12040747, PMCID PMC9955435. S02 Bootstrap Farmer seed disinfection. S03 Bootstrap Farmer soaking guidance. S04 Ocho Bernal et al. (2023), DOI 10.3389/fsufs.2023.1264472. S05 Eicher-Sodo research and associated HortTechnology 2019 paper. S06 Food Control 2016, DOI 10.1016/j.foodcont.2016.02.045. S07 USU. S08 UF/IFAS. S09 National Capital Poison Center. S10 CDC efficacy factors. S11 EPA C–t project summary. S12 dynamic-disinfection modeling paper, PMCID PMC7780086. S13 EFSA/ECHA water-treatment guidance, PMCID PMC10461463. S14 Penn State. S15 FDA sprout guidance. S16 USDA NOP 5029. S17 supplied planner/discussion. S18 local archive and implementation. S19 discovery-only leads. Full links and access records are in the notebook.

## 11. Measured spray salt load

*Recorded November 10, 2026. This is a user-reported measurement and a research assessment, not a completed growing trial.*

### Observation and recipe context

- **Measured spray output:** 10 trigger pulls weighed **1.66 g of liquid**, approximately **1.66 mL** using a dilute-water density approximation of 1 g/mL. This is one reported observation, without a replicate range or independent verification. [S55]
- **Generator feed supplied by the user:** 250 mL purified/distilled water, 1.50 g NaCl and 0.63 mL vinegar of unspecified acidity. Approximate starting salt rate: **6.00 g/L = 6 mg/mL**. Small final-volume changes are neglected.
- **Process plan supplied by the user:** 30-minute electrolysis, target FAC 300 ppm and target final pH 4.50. These are recipe/process targets and a reported timing reference, **not recorded fresh FAC/pH measurements for this batch**. Generator/manual compatibility was not verified in this salt assessment.
- **Application plan:** mist during germination only; **up to 10 applications** for the upper-load estimate. The earlier twice-daily, three-day schedule would be six applications, so it is a separate, lower-load scenario.

### Salt-equivalent calculation

```text
per application = 1.66 mL × 6 mg/mL = 9.96 mg salt-equivalent
6 applications  = 9.96 × 6 = 59.76 mg ≈ 0.060 g per tray
10 applications = 9.96 × 10 = 99.6 mg ≈ 0.100 g per tray
```

“Salt-equivalent” tracks the NaCl introduced in the generator feed. It is **not an assay of unchanged NaCl remaining after electrolysis**, final EC, chlorine residue, plant uptake or the amount retained on each seed. The estimate assumes a homogeneous single-bottle output and no salt separation. Sodium-containing dissolved material remains relevant even as some chloride changes chemical form. [S55; S59]

Assuming all of the upper-load estimate remains and mixes evenly with the **water currently retained in the tray**:

| Retained water, including any spray water | Added salt-equivalent | Approximate NaCl-equivalent concentration |
|---:|---:|---:|
| 250 mL | 0.398 g/L | 6.8 mM |
| 500 mL | 0.199 g/L | 3.4 mM |
| 1,000 mL | 0.100 g/L | 1.7 mM |

Equation: `mM = (salt-equivalent g / retained-water L) ÷ 58.4428 × 1,000`. These water quantities are **sensitivity scenarios, not measurements of this tray**, and exclude background salinity from coir, water and nutrients. The calculation assumes complete retention but uniform mixing; actual local exposure can be higher or lower. [S55]

### Evidence informing the assessment

| Source | Relevant finding | Transfer limit |
|---|---|---|
| **Plocek et al., broccoli microgreens** | Irrigation solutions contained 0.32, 0.64 and 0.96 g/L NaCl. Two 14-day trials showed no consistent yield penalty; fresh yield increased in one treatment in the second trial. | Germination used plain water for the first four days. Growing pads and repeated irrigation differ from brief coir misting; physiology changed despite no consistent yield loss. [S56](https://doi.org/10.48130/TIH-2023-0004) |
| **Masepan et al., Chinese white radish** | 10–20 mM NaCl did not impair the listed growth parameters in four-day seedlings and increased cotyledon fresh weight. | Species/cultivar-specific; some physiological and mineral endpoints changed. The paper's descriptions of higher 50–100 mM effects are mixed, so the reassurance here uses the lower treatments only. [S57](https://pmc.ncbi.nlm.nih.gov/articles/PMC12157832/) |
| **Wu et al., sunflower** | Continuous exposure at 10 mM and above slowed germination; higher exposures also affected growth. | A useful counterexample to a universal 25-mM no-effect claim. This was a Petri-dish germination experiment; the separate growth experiment used older seedlings. [S58](https://doi.org/10.17221/22/2015-PSE) |

Preserved sources: [broccoli PDF](source_docs/seed_sanitation/salt_load/Plocek-2023-broccoli-salinity.pdf), [radish XML](source_docs/seed_sanitation/salt_load/Masepan-2025-radish-PMC12157832.xml), [sunflower PDF](source_docs/seed_sanitation/salt_load/Wu-2015-sunflower-salinity.pdf), [capture manifest](source_docs/seed_sanitation/salt_load/salt-load-capture-manifest.json). The earlier mung/pea comparisons identify effects at particular studied doses, not minimum harmful doses; they are not used to declare a universal safe threshold here.

### Recorded assessment and limits

**Salt accumulation is likely a minor practical concern at the measured output and a cap of 10 applications on a well-moistened 1020 tray. Confidence: moderate.** This is an inference from the approximately 100-mg total load, plausible dilution and the studies above—not a direct test of this recipe.

Conditions supporting that assessment: reasonably low-salt starting coir/water, adequate moisture, reasonably even coverage and germination-only use. Fresh spray droplets still begin near the 6-g/L feed-salt equivalent (approximately 103 mM), before dilution; drying or uneven deposits can create greater local exposure. No water-loss/distribution measurements were collected, and a small germination delay cannot be ruled out.

**Scope boundary:** this conclusion concerns salt loading only. It does not establish tolerance to 300 ppm active chlorine at pH 4.50, microbial/log reduction, mold-prevention benefit, food-use suitability or a recommended daily spray program. No successful crop outcome was reported. A same-lot plain-water comparison against the complete spray would assess the whole formulation, without isolating salt from chlorine effects.

[Structured observation and calculation record](data/spray-salt-observation-2026-11-10.json) · [Source notebook, S55–S59](source_docs/seed_sanitation/research_resource_log_2026-11-10.txt).

## 12. HOCl dilution card

[Open the dilution card](site/dist/seed-sanitation.html#hocl-dilution). Choose HOCl in the spray dilution card after the three quick-help cards. Stock FAC starts at **200 ppm** based on the user's tentative estimate; replace it with a verified, in-range free available chlorine (FAC) reading. **Final solution volume defaults to 500 mL**; the 50-ppm target is an arithmetic example, not a crop recommendation. Presets 10/30/50/70/100/200/300 ppm and custom positive targets are available.

**Batch note [S71]:** The user identified the top pH strip as tap water and the two vertical strips as generated solution. Their tentative chlorine estimate was about **200 mg/L**; the pasted comparison estimated a solution pH of roughly **4.0–4.5**. The photo does not confirm a 200 mg/L FAC reading, whether the strip measures free or total chlorine, or whether the sample was diluted before testing. The earlier 300-ppm figure was a target in the working recipe. Neither photo nor target establishes which recipe amounts were actually used. The new prefill is a planning assumption.

| Input or output | Basis |
|---|---|
| Measured stock FAC | User-entered ppm; use a suitable-range free-chlorine measurement. A target or off-scale strip reading is not a stock measurement. |
| Target FAC | Calculation input; must be positive and no higher than stock. No crop-specific efficacy or safety score. |
| Final batch | Default500mL **total**, including stock and water. Changing to liters converts the entered amounts. |
| Available-stock mode | Enter existing stock volume; calculate the larger final volume and water addition. Separate from choosing a final batch. |
| Salt estimates | Recorded6g/L feed and0.166mL per trigger pull; optional spray/application counts default10/10. Feed-salt equivalents, not measured residual NaCl or plant uptake. |
| Final measured FAC and pH | Optional observation fields; FAC difference from target is shown without an invented pass/fail band. pH is recorded, never predicted. Changing batch inputs clears stale post-mix measurements. |

```text
Final-volume mode:
stock mL = final mL × target ppm / measured stock ppm
water mL = final mL − stock mL

Available-stock mode:
final mL = available stock mL × measured stock ppm / target ppm
water mL = final mL − available stock mL

Diluted feed-salt equivalent mg/mL = 6 × target ppm / measured stock ppm
Batch salt-equivalent mg = 6 × stock mL
Tray salt-equivalent mg = diluted mg/mL × 0.166 × sprays/application × applications
```

**Current example:** if the stock is verified at **200 ppm FAC**, a 50-ppm target and 500 mL final batch give **125 mL stock + 375 mL water**, or 1 part stock to 3 parts water. Add water to the final-volume mark; the calculation assumes approximately additive volumes and negligible FAC in the diluent. Using the recorded 6 g/L feed assumption, the estimate is **1.5 mg/mL**, **750 mg per batch** and **24.9 mg per tray** for 10 sprays × 10 applications. The feed assumption has not been verified for the photographed batch. Batch size is not the amount to apply to one tray.

Recheck FAC and pH after mixing. Water demand, chlorine decay and measurement resolution can change the achieved concentration. Use only water for dilution and follow product directions; the tool does not adjust generator salt, acid, electrolysis time or pH. Final measurements and dilution arithmetic do not validate crop tolerance, contact time, mold prevention or food-safety performance. The existing daily-spray guidance is unchanged.

**Provenance:** user requested a compact functional card with500mL final volume; the attached earlier proposal used250mL, so the live request takes precedence. Its additional2025 seedling-research claim was initially unverified; it is now appraised separately in section 13. The previous measured spray record (section11/S55) supplies the salt/spray assumptions. Copy notes reproduce current quantities, salt assumptions and any recorded post-dilution observations. Spray estimates (including all salt figures) and mixed-batch measurement fields each start collapsed and can be expanded independently; primary stock/water amounts stay visible. The browser exposes `HoclDilutionApp.selfTest()` for deterministic arithmetic checks. [S60–S61 in the source notebook](source_docs/seed_sanitation/research_resource_log_2026-11-10.txt)

## 13. Evidence behind the 50 ppm spray proposal

**Assessment: 50 ppm free available chlorine (FAC) is a scientifically plausible concentration to investigate, especially given radish and pea sprout experiments. The evidence does not establish a routine twice-daily spray during three days of germination on coir.** This is an editorial synthesis of the studies below, not a tested protocol or a community consensus. The attached discussion is recorded as a research lead [S62]; its claims were checked against primary records rather than accepted as instructions.

For these dilute aqueous comparisons, 50 ppm FAC is approximately 50 mg/L available chlorine expressed as chlorine equivalent. It is not a 50-ppm salt concentration. Papers use different electrolyzed-water formulations, pH, application methods and endpoints; matching the nominal FAC alone does not reproduce their treatment.

### What the six studies actually support

| Study | Exposure and result | Relevance and limitation |
|---|---|---|
| [S25 — Zhang et al., radish, Food Control 2016](https://doi.org/10.1016/j.foodcont.2016.02.045) | Sprout-spray arms used 30 and 50 mg/L available chlorine. The abstract reports 1.39/1.58-log reductions covering aerobic bacteria and yeast/mold, with improved sprout growth. | Direct sprout-spray evidence. The abstract's wording does not securely map each reduction to a particular dose and organism; no one-to-one mapping is asserted here without the tables. Separate 12-hour seed-soaking arms had different concentrations and some germination effects. |
| [S24 — Zhang et al., pea, Food Control 2019](https://doi.org/10.1016/j.foodcont.2019.04.029) | 35/70 mg/L SAEW replaced production water for seed soaking and sprout spraying. Natural microbial counts fell by up to 1.6 log; reported growth/nutritional outcomes were maintained or enhanced. | Relevant repeated-production exposure at concentrations bracketing 50 ppm. This was not an exact 50-ppm test, a pathogen challenge or a coir-tray experiment. The available summary does not establish the user's proposed application volume or frequency. |
| [S63 — Li et al., broccoli, Food Research International 2018](https://pubmed.ncbi.nlm.nih.gov/29433193/) · [S67 — author-institution report](https://www.jircas.go.jp/sites/default/files/publication/annual_report/annual_report-2017_-.pdf) | 10–50 ppm solutions; a 3-hour soak followed by cultivation over solution on sterile cheesecloth, renewed every 24 hours, with harvest after 8 days. At 50 mg/L, microbial counts were 1.71 log CFU/g below tap-water treatment. | **Growth was inhibited: fresh weight decreased as ACC increased, although dry weight did not change.** This corrects the attachment's broad claim of no significant growth penalties. Repeated solution exposure is not equivalent to a brief mist. |
| [S64 — Blasco et al., Energy Nexus 2025](https://doi.org/10.1016/j.nexus.2025.100566) | Eleven pH-4.5 EW formulations, five with zeolite; 50–500 ppm FAC. Controlled seedling tests at 100 ppm reported approximately 70% reductions in incidence/severity of the studied Alternaria diseases. Greenhouse results at 50 ppm were limited. | Direct plant-fungal-disease evidence, but on older broccoli/tomato seedlings and selected pathogens. The authors report no phytotoxicity up to 500 ppm in tested plants; that is not a germinating-seed tolerance limit. Disease percentages are not microbial log reductions. |
| [S65 — Ogunniyi et al., Food Microbiology 2021](https://pubmed.ncbi.nlm.nih.gov/32912583/) | Living lettuce/spinach leaves were challenged with bacteria. EOW at 50 mg/L free chlorine reduced counts by at least 1.5 log without visible leaf injury; matched-FAC NaOCl caused discoloration/necrosis in that experiment. | Supporting evidence on living leaves; repeated germination spraying was not established. The project report describes single-application tolerance, but that report is currently only search-index accessible [S69]. It does not show that all EOW products outperform all hypochlorite products at the same FAC. |
| [S66 — Liang et al., buckwheat, LWT 2019](https://doi.org/10.1016/j.lwt.2019.03.021) | Approximately 10/28/92 mg/L SAEW, pH around 6, evaluated across dipping, germination and washing. Higher ACC improved microbial reduction, but approximately 92 mg/L adversely affected sprout length; authors favored 10–28 mg/L for the balance of endpoints. | A useful counterexample to a universal 50-ppm optimum. Buckwheat is outside the five selected crops; results from different production stages cannot be combined into one spray-dose response. |

**Access limits:** publisher-indexed abstracts/highlights, PubMed records and institutional reports were reviewed. Full experimental tables and replicate counts were not available for all six studies; no pooled effect, dose-response fit or statistical safety margin was calculated. The 2025 paper is openly licensed, but direct full-text retrieval was blocked; its summary-level findings are identified accordingly. [Bibliographic metadata capture and access record](source_docs/seed_sanitation/spray_50ppm/spray-studies-metadata.json) · [Capture manifest](source_docs/seed_sanitation/spray_50ppm/spray-studies-capture-manifest.json) · [Source notebook S62–S70](source_docs/seed_sanitation/research_resource_log_2026-11-10.txt).

### How much confidence transfers to the five crops?

These are **editorial confidence judgments about relevance**, not probabilities of safety or efficacy:

- **Radish and pea:** moderate support for investigating low-concentration EW during sprout production; limited support for the exact covered-coir spray schedule.
- **Broccoli:** mixed evidence. Microbial reduction is real, but the repeated-exposure sprout study also found a fresh-weight penalty. Later seedling tolerance does not resolve this.
- **Sunflower and mung bean:** low confidence in this exact 50-ppm spray schedule. Existing seed-bath/pathogen studies in the companion HOCl review answer different questions; their positive results do not fill the spray gap.

Here, “moderate” describes relevance of the published production systems, not confirmation of visible-mold prevention. A 1.6-log reduction is approximately a 97.5% reduction in the measured count; it can still leave survivors. Natural aerobic or yeast/mold counts cannot be substituted for the relevant-pathogen reductions discussed in the [log-target review](18_hocl_log_reduction_and_grower_consensus.md).

### What this means for the planner and a comparison

Keep **50 ppm as a calculation/example target**, with the research accessible on scroll. The evidence supports calling it a candidate for investigation; it does not justify changing the five crops to “daily spray recommended.” No new chemical contact time is inferred from these studies, and no grower consensus for 50 ppm twice daily was established.

A useful crop comparison would use the same seed lot, coir, seed density and total water, with water-only controls and independent replicate trays. Record actual FAC/pH, delivered volume, frequency, germination percentage, growth/fresh yield and visible mold separately. A comparison of the complete spray assesses the formulation as a whole; it does not isolate chlorine from salt/pH effects. Visual observations cannot establish a pathogen kill step. This describes how to evaluate the hypothesis; it is not an instruction to challenge crops with pathogens or treat an unsuitable product as crop-authorized.

### Recorded dilution and salt arithmetic

The original 300-ppm scenario gives approximately **83.33 mL stock + 416.67 mL water** for 500 mL at 50 ppm. Under the same recorded salt and spray assumptions, that scenario gives **16.6 mg per tray** for 10 sprays × 10 applications; the current 200-ppm scenario gives **24.9 mg** because it uses more stock to reach 50 ppm. Both are mass-balance estimates. Final pH is not predicted by the dilution ratio. [Current dilution example](#12-hocl-dilution-card) · [Measured spray output](#11-measured-spray-salt-load).

**Finding:** the attached proposal has a credible research basis as an experimental hypothesis, strongest for radish/pea sprout production. Its blanket growth-tolerance claim needs correction, and the exact five-crop germination-only misting schedule remains unconfirmed.


## 14. Peroxide spray dilution and chlorate

[Open the spray dilution calculator](site/dist/seed-sanitation.html#hocl-dilution). It opens on **H₂O₂**, with **12% w/w stock**, a **900 mg/L grower-reference target** and **500 mL final volume**. Use the HOCl button for [free-chlorine dilution](#12-hocl-dilution-card). The separate custom seed-bath form also starts on peroxide.

### Peroxide amounts and the sunflower study

On The Grow describes mixing 15 mL of 3% peroxide into 500 mL of water for a light germination mist. That is approximately 870 mg/L after mixing. The calculator rounds this grower reference to 900 mg/L. Sunflower crop tolerance, disease prevention and pathogen reduction at that concentration remain unverified. [On The Grow germination spray example](https://onthegrow.net/blogs/microgreens/microgreens-mold-prevention-identification-complete-guide)

For a weight-percent label, 12% stock contains 120 mg H₂O₂ per gram. A 500 mL batch at 900 mg/L needs 450 mg of H₂O₂. The calculator offers two ways to measure that amount.

- **Direct example.** Weigh **3.75 g of 12% stock** and add water to the 500 mL mark. The calculator uses the label's mass fraction and the finished volume, so stock density is unnecessary. Follow the concentrate's label and keep it separate from HOCl and bleach.
- **Two-step example.** Mix **3.75 g of 12% stock with 41.25 g of water** to get 45 g of 1% working solution. Use **45 g of that solution** and add water to the 500 mL mark.

The recorded 0.166 mL per spray gives **16.6 mL across 100 sprays**, or **14.94 mg H₂O₂ in the spray** at 900 mg/L. The fraction that reaches or remains on the seedlings is unknown.

Eicher-Sodo et al. tested 0–200 mg/L in daily greenhouse sprays. Black-oil sunflower showed no increase in measured leaf damage through 200 mg/L. Radish, arugula and the lettuce cultivars showed leaf injury at some tested levels. The study measured growth and leaf damage. Mold prevention, antimicrobial effect size and pathogen reduction for the proposed covered germination spray remain unknown. [2019 HortTechnology study, S05](https://doi.org/10.21273/HORTTECH04255-18)

### Chlorate and the five days after spraying

Free available chlorine (FAC) and chlorate are different measurements. At 50 mg/L FAC, the same 16.6 mL spray schedule delivers **0.83 mg chlorine equivalent** before reactions. Chlorate in the diluted solution requires its own concentration measurement. A FAC reading or estimated salt load leaves that amount unknown.

Plants can transform chlorate. In Arabidopsis, nitrate reductase converts it to chlorite. A baby lettuce study found chlorate in harvested leaves after irrigation with electrolyzed water. Together these findings support both metabolism and retention as possibilities. [Arabidopsis enzyme study, S73](https://pmc.ncbi.nlm.nih.gov/articles/PMC1081098/) · [Baby lettuce irrigation study, S74](https://pubmed.ncbi.nlm.nih.gov/29171869/)

Stopping the spray for five days ends further input from that spray. It leaves the amount already present in sunflower tissue unknown. Growth can reduce the concentration per gram if a fixed residue is distributed through more biomass. Measuring residue at harvest would be needed to assess clearance in this setup.

## 15. Foliar sprays, food contact and product labels

For U.S. edible microgreens, start with the intended use and the actual product or generator. A preharvest crop spray, a postharvest produce wash, and a sanitizer for empty trays have different conditions. The reviewed sources establish no single HOCl foliar concentration for conventional microgreens. [EPA product labeling guidance](https://www.epa.gov/pesticide-labels/pesticide-labeling-questions-answers)

| Use | What the U.S. sources say |
|---|---|
| Organic preharvest water contacting the crop | The rule lists HOCl generated from electrolyzed water. It limits the **residual chlorine in water in direct crop contact** to the drinking-water maximum residual disinfectant level, **4 mg/L as Cl₂** for chlorine. USDA guidance calls for monitoring at the last point of contact. The rule separately addresses edible sprout production under EPA label directions. FDA treats microgreens as a distinct crop category in its produce safety guidance. [7 CFR § 205.601(a)(2)](https://www.ecfr.gov/current/title-7/subtitle-B/chapter-I/subchapter-M/part-205/subpart-G/section-205.601) · [40 CFR § 141.65](https://www.ecfr.gov/current/title-40/chapter-I/subchapter-D/part-141/subpart-G/section-141.65) · [USDA NOP 5026 Rev. 03](https://www.ams.usda.gov/sites/default/files/media/5026.pdf) · [FDA sprout guidance](https://www.fda.gov/media/102430/download) |
| Organic postharvest produce wash | NOP 5026 allows chlorine at levels authorized for the specific use and calls for an immediate qualifying potable-water rinse. The residual limit applies at the final rinse. [USDA NOP 5026, § 4.3](https://www.ams.usda.gov/sites/default/files/media/5026.pdf) |
| Commercial postharvest produce wash | FDA FCN 1811 covers the listed supplier and its customers. It specifies up to **60 ppm FAC** and, for produce eaten raw, a potable-water rinse or a 10-minute drain. [FDA FCN 1811](https://www.hfpappexternal.fda.gov/scripts/fdcc/index.cfm?id=1811&set=FCN) |
| Sanitizing hard food-contact surfaces | The federal residue exemption specifies up to **200 ppm total available chlorine** under its conditions. The EcaFlo/Danolyte label has a **200 ppm FAC** hard-surface use with 60 seconds wet contact, followed by draining and drying. Follow the end-use label for the product in hand. [40 CFR § 180.940](https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-180/subpart-D/section-180.940) · [EPA label 91582-1, February 2026](https://www3.epa.gov/pesticides/chem_search/ppls/091582-00001-20260202.pdf) |

The **4 ppm** value is a residual-water standard in the organic context. An initial **10 or 50 ppm** mix has a different measurement point. Measure at the relevant point when evaluating compliance. For conventional crops, verify the authorized use, crop and directions for the actual product. EPA explains that some on-site generators are pesticide devices, with different rules for generators supplied with substances or distributed output. Device status alone leaves the crop use unverified. [EPA device guidance](https://www.epa.gov/pesticides/pesticide-devices-guide-consumers)

### Commercial HOCl examples and dilution arithmetic

- **10 ppm is a prevention reference.** It is near the 8 ppm preventive foliar rate in AGrowlyte’s guide. [AGrowlyte grower guide](https://www.agrowlyte.com/_files/ugd/48b9e9_f6fe6bfbd01c48efa9d89038916af76d.pdf)
- **50 ppm is a treatment-range reference.** It is near AGrowlyte’s 40 ppm rate for existing plant disease. GroWash also markets 50 ppm for routine leaf hygiene. These examples leave prevention and treatment doses for germinating edible microgreens unverified. [AGrowlyte grower guide](https://www.agrowlyte.com/_files/ugd/48b9e9_f6fe6bfbd01c48efa9d89038916af76d.pdf) · [GroWash product directions](https://growash.com/products/)

The manufacturer materials identify HOCl as the principal antimicrobial. The concentrations below are published targets or stock specifications. The last columns show a **250 mL finished batch** using those nominal stocks and the amount delivered by **1.66 mL per ten sprays**, using the concentration as FAC for the comparison. These are reference calculations. The labels reviewed did not establish a U.S. preharvest use on edible microgreens for any of these three products.

| Manufacturer example | Nominal stock | Published target and use | Stock + water for 250 mL | mg FAC equivalent per 10 sprays |
|---|---:|---|---:|---:|
| AGrowlyte prevention | 500 ppm FAC | 8 ppm foliar, twice weekly | 4 + 246 mL | 0.0133 |
| AGrowlyte treatment | 500 ppm FAC | 40 ppm foliar, daily. The guide describes up to twice daily in severe cases. | 20 + 230 mL | 0.0664 |
| GroWash | 50 ppm FAC at production | 50 ppm ready-to-use plant hygiene spray, daily | 250 + 0 mL | 0.0830 |
| Green Houston HOCl 500 | 500 ppm nominal HOCl | 50–100 ppm foliar or greenhouse fogging | 25–50 + 225–200 mL | 0.0830–0.166 |
| Green Houston HOCl 500 | 500 ppm nominal HOCl | 150 ppm outbreak fogging, episodic | 75 + 175 mL | 0.249 |
| Green Houston HOCl 100 | 100 ppm nominal HOCl | 100 ppm foliar and cuttings product | 250 + 0 mL | 0.166 |

**AGrowlyte.** Its grower guide specifies checking residual fluid for up to 4 ppm and cautions against use during seedling and prevegetative stages. At exactly 500 ppm stock, the guide’s printed stock-to-water ratios calculate to about 7.7 and 36.2 ppm before demand. The table uses the advertised 8 and 40 ppm targets. The EPA 91582-1 master label reviewed includes hard-surface uses. Its text has no edible-crop foliar directions. [AGrowlyte grower guide](https://www.agrowlyte.com/_files/ugd/48b9e9_f6fe6bfbd01c48efa9d89038916af76d.pdf) · [EPA master label](https://www3.epa.gov/pesticides/chem_search/ppls/091582-00001-20260202.pdf)

**GroWash and Green Houston.** GroWash specifies FAC at manufacture. Green Houston, a South African supplier, lists nominal HOCl strengths and describes the 50 ppm lower end under fogging. The reviewed page provides separate foliar directions for its 100 ppm product. The table treats those nominal concentrations as FAC for arithmetic only. The manufacturer’s directions and measured product concentration are the relevant inputs for a real batch. [GroWash product directions](https://growash.com/products/) · [Green Houston product directions](https://www.greenhouston.co.za/products/hypochlorous-acid-hocl-organic-disinfectant-foliar-spray) · [Cornell EPA label research tools](https://cals.cornell.edu/produce-safety-alliance/resources)

### Tap water and the 10 ppm calculation

Tinley Park’s municipal report lists **0.8–0.9 ppm chlorine** for its 2025 monitoring, with a reported high of **0.9 ppm** and no chlorine violation. That range describes the utility’s samples. A faucet reading requires testing the actual water. Numerically, 50 ppm is about 56 times 0.9 ppm. Those numbers describe the water concentrations. [Village water quality report, 2025 data](https://cms6.revize.com/revize/tinleypark/document_center/Water%20Quality%20Report/Water%20Quality%20Report%202025.pdf)

The calculator’s **10 ppm FAC** preset gives **25 mL of stock verified at 200 ppm FAC**, with water added to **500 mL final volume** (about **475 mL** water). It assumes negligible FAC in the diluent and reports a mixing target. Check final FAC with a test suited to the low range. At 10 ppm, 100 sprays at the recorded volume deliver **0.166 mg FAC equivalent** across a tray. At 50 ppm the same schedule delivers **0.83 mg**. These figures describe FAC introduced with the spray. Chlorate concentration, residues on greens at harvest, and whether a previously moldy tray is suitable to eat require other evidence. [Spray dilution calculator](site/dist/seed-sanitation.html#hocl-dilution) · [Chlorate and harvest residue evidence](#14-peroxide-spray-dilution-and-chlorate)

### Peroxide comparison from the discussion

The **1% H₂O₂ per application** in 40 CFR § 180.1197 is a residue-tolerance exemption for growing and postharvest crops. Organic crop rules list hydrogen peroxide for crop disease control under § 205.601(i)(5), subject to applicable restrictions and product directions. The **100 ppm** calculator example comes from the concentration range in a greenhouse plant-tolerance study, with microbial effectiveness on germinating sunflower still unknown. [40 CFR § 180.1197](https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-180/subpart-D/section-180.1197) · [7 CFR § 205.601](https://www.ecfr.gov/current/title-7/subtitle-B/chapter-I/subchapter-M/part-205/subpart-G/section-205.601) · [Eicher-Sodo et al. 2019](https://doi.org/10.21273/HORTTECH04255-18)

ZeroTol 2.0 is a separate example with **27.1% hydrogen peroxide and 2.0% peroxyacetic acid**. BioSafe’s V16.3 specimen lists microgreens under leafy vegetables, with preventive **1:200–1:400** rates and a zero-day preharvest interval under the label directions. The pasted estimate of roughly 680–1,350 mg/L H₂O₂ assumes a stock density near water. Using the SDS density of 9.18 lb/gal (about 1.10 kg/L) gives roughly **740–1,480 mg/L H₂O₂** on the stated volume ratios. This is a formulation-specific estimate. [BioSafe V16.3 specimen](https://biosafesystems.com/wp-content/uploads/2020/08/6000-ZeroTol-2.0-V16.3-49st-Specimen1.pdf) · [EPA label record 70299-12](https://www3.epa.gov/pesticides/chem_search/ppls/070299-00012-20210903.pdf) · [BioSafe SDS, section 9](https://biosafesystems.com/wp-content/uploads/2025/05/SDS-6000-ZeroTol-2.0-Rev-1.pdf)

[Archived USDA NOP 5026 PDF](source_docs/seed_sanitation/USDA-NOP-5026-chlorine-rev03.pdf) · [Source notebook, S75–S86](source_docs/seed_sanitation/research_resource_log_2026-11-10.txt)
