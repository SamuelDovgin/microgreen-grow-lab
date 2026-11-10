# HOCl seed sanitation: measured log reductions, targets and grower agreement

*Deep review: November 10, 2026. This extends the [earlier sanitation research](17_seed_sanitation_research_and_timing.md). Concentration–time pairs below describe experiments, not a universal application protocol. “HOCl” includes the closely related acidic/slightly acidic electrolyzed-water literature, whose pH and formulation must be retained.*

[Open the planner](site/dist/seed-sanitation.html) · [Source notebook](source_docs/seed_sanitation/research_resource_log_2026-11-10.txt)

## 1. Direct answer: HOCl has positive experimental evidence

**Yes. Specific chlorine concentration–time conditions have produced substantial microbial reductions on seeds and sprouts.** The gap is not whether HOCl has antimicrobial activity. The gap is whether an exact treatment reliably achieves a specified outcome for a particular crop, lot, organism, formulation and production system.

The planner’s **400 ppm / 30 min** and **12% peroxide / 1.25 min** remain arithmetic extrapolations. They are not published microbial-kill results. Asterisks must identify that gap without implying that no HOCl treatment has ever been tested.

The most relevant new evidence found in this pass is a **sunflower-seed Salmonella challenge study**, not just another study of broccoli. It tested acidic electrolyzed water at **48 mg/L available chlorine, pH 2.76, for 15 minutes**, reporting **2.39-log Salmonella reduction**. This is a real seed result, but not evidence that a different-pH homemade solution achieves the same result. [S22](https://pubmed.ncbi.nlm.nih.gov/35410797/)

## 2. What log reduction means

```text
log reduction = log10(initial viable count / surviving viable count)
percent reduction = (1 − 10^(−log reduction)) × 100
```

| Reduction | Percentage removed/inactivated | Survivors from an illustrative 1,000,000 organisms |
|---:|---:|---:|
| 1 log | 90% | 100,000 |
| 2 log | 99% | 10,000 |
| 3 log | 99.9% | 1,000 |
| 4 log | 99.99% | 100 |
| 5 log | 99.999% | 10 |

These are arithmetic examples, not estimates of contamination on your seeds. A treatment’s reduction must specify **which organism, compared with which control, measured when, and in what units**. Counts on a seed immediately after treatment differ from counts after germination or on harvested shoots. “Not detected” means below a method’s detection limit, not proof that zero organisms remain.

### Three goals that must stay separate

1. **Visible mold / crop loss:** require fungal outcomes plus germination and usable yield. A bacterial log result does not by itself answer this question.
2. **General microbial reduction:** total aerobic bacteria or Enterobacteriaceae may show process effects, but are not interchangeable with a Salmonella challenge.
3. **Foodborne-pathogen control:** require evidence for relevant pathogens and the actual seed/process; prevention and verification still matter after treatment.

**Finding:** there is no established universal fungal-log target that guarantees mold-free, safe-to-eat coir microgreens.

## 3. What target should we look for?

FDA’s September 2023 **sprout** guidance recommends seed treatment achieving **at least 3-log reduction in microorganisms of public-health significance**, with primary attention to Salmonella and E. coli O157:H7. It favors the most efficacious practical treatment. The associated risk model found greater benefit from **5-log reduction plus spent-irrigation-water testing**. These are different levels of protection, not claims that a seed wash alone assures safety. [S20, printed pp. 35–36](https://www.fda.gov/media/102430/download)

Current Canadian sprout guidance also recommends considering treatment capable of at least **3-log reduction of relevant pathogens**, and says no treatment guarantees pathogen-free seeds. [S21](https://inspection.canada.ca/en/preventive-controls/fresh-fruits-vegetables/sprouted-seeds)

For evaluating a seed-treatment claim, a useful evidence ladder is:

| Evidence offered | Interpretation |
|---|---|
| Cleaner-looking tray / less visible mold | Useful agronomic observation; no established pathogen log reduction. |
| Approximately 1–2 log of naturally occurring flora | Measurable reduction, but below the sprout pathogen-control benchmark and potentially a different endpoint. |
| At least 3 log of relevant challenged pathogens under matched conditions | A meaningful sprout-guidance benchmark; still needs process controls and verification. |
| 5 log of relevant pathogens, supported for the intended process | Stronger performance goal; does not remove later contamination or regrowth risks. |

**Application boundary:** FDA distinguishes microgreens from sprouts and excludes microgreens from sprout-specific Subpart M, while other Produce Safety Rule provisions may apply. Do not relabel this sprout guidance as a universal legal 3- or 5-log requirement for home microgreens. [S20, printed pp. 9–10]

**My research recommendation:** when a supplier or sanitizer claims food-safety control, ask for organism- and process-specific validation at a meaningful pathogen-reduction level, not just a “kills 99.9%” suspension test. For your visible-mold problem, also demand fungal and growing-performance evidence. The two goals cannot be reduced to one generic log number.

## 4. What has actually been studied?

ACC below means available chlorine concentration. In these dilute aqueous measurements, mg/L is conventionally reported as ppm. Different electrolyzed-water pH values and chemical forms are not automatically interchangeable.

| Crop / material | Treatment studied | Measured result | What it does and does not establish |
|---|---|---|---|
| **Broccoli seeds / subsequent 24-hour sprouts** | Fresh HOCl, approximately **800 ppm, 15 min** | Authors report approximately **4–5-log bacterial-load reduction** and fungi below detection in the head-to-head comparison. | Positive research evidence. Natural culturable contamination, not a Salmonella challenge validation for all seeds. [S01](https://pmc.ncbi.nlm.nih.gov/articles/PMC9955435/) |
| Broccoli, same study | Approximately **800 ppm, 5 min** | Authors describe **2–3-log bacterial reductions**, less effective than 15 min. | Shows time matters under this experiment; does not validate 200/400/600 ppm inverse-time substitution. [S01] |
| **Sunflower seeds**, five-strain Salmonella challenge | Acidic electrolyzed water: **48 mg/L ACC, pH 2.76, ORP 1093 mV, 15 min** | **2.39-log Salmonella reduction**; seed germination remained above 96% across treatments. | Directly relevant seed species and pathogen, but less than 3 log in this test; sprout growth characteristics varied by sanitizer. Not a home-generator equivalence. [S22](https://pubmed.ncbi.nlm.nih.gov/35410797/) |
| **Pea seeds/sprouts**, treatment throughout production | Slightly acidic electrolyzed water at **35 or 70 mg/L**, used for soaking and sprouting water | Natural microbiota reduced by **up to about 1.6 log CFU/g**. | Positive production-system evidence; not a one-time bath or demonstrated 5-log pathogen process. [S24](https://www.sciencedirect.com/science/article/abs/pii/S0956713519301902) |
| **Radish sprouts**, production spray | Electrolyzed oxidizing water at **30 or 50 mg/L** during sprouting | The abstract reports **1.39- and 1.58-log reductions**, covering aerobic bacteria and yeast/mold outcomes. | Supports effects in that sprout system; do not assign each value to a concentration without the full result table or call it a daily coir-tray recipe. [S25](https://www.sciencedirect.com/science/article/abs/pii/S0956713516300913) |
| **Mung bean seeds**, inoculated Salmonella Typhimurium | **250 mg/L SAEW plus microbubbles, 20 min** in an engineered 10-L apparatus | **4.3-log CFU/g reduction** reported in publisher highlights/results. | Genuine combination evidence, but the physical microbubble treatment is part of the intervention. Not a plain 250-ppm bath. [S26](https://doi.org/10.1016/j.foodcont.2024.110767) |
| **Mung seeds and sprouts**, challenged E. coli O157:H7 and Salmonella Enteritidis | SAEW, **pH 5.0–6.5, 20–120 mg/L, 3–15 min** | Positive pathogen reductions reported across treatment conditions. | Abstract-level access does not let this review assign every reported range to an exact seed-versus-sprout dose/time cell; no single recipe extracted. [S23](https://www.sciencedirect.com/science/article/abs/pii/S0956713510003865) |
| **Harvested broccoli sprouts**, washing | Acidic electrolyzed water, **230 mg/L, pH 3.66, 20 s** | Approximately **1.0–1.4 log** of sprout contaminants. | An additional positive result; it is a wash of sprouts, not seed pretreatment. [S36](https://doi.org/10.1016/j.lwt.2017.09.044) |

**Finding:** HOCl-family treatments have measurable effects across multiple plant systems. The evidence does not establish a common dose/time/log curve transferable among them.

### Important details in the strongest broccoli evidence

The Gilbert experiments used 200 seeds per replicate; factorial experiments were independently repeated four times. The later head-to-head tests used five replicates per treatment and were repeated twice for each of the 5- and 15-minute durations. The study included post-treatment rinsing and a separate water soak, and enumerated subsequent microbial growth. These procedural details matter when interpreting its headline reduction. [S01]

The article’s data-availability statement says the data can be supplied **by the corresponding author on request**. This project does not have a publicly downloaded raw dataset or a fitted kinetic coefficient. A claim in the supplied discussion that raw data had been published should not be treated as verified.

### What sunflower results add

The sunflower experiment also found different results for separate sanitizer arms, including sodium hypochlorite and vinegar. This does not justify transferring the best-performing treatment to every crop, mixing the separate treatments, or treating the sunflower result as a fungal endpoint. The complete abstract and methods excerpts support the seed species, measured chemistry and Salmonella endpoint. The full author-hosted PDF timed out in this pass, so this review does not claim access to every table or replicate-level value. [S22]

## 5. Why ppm × time cannot predict a desired log reduction here

The present calculation `time = reference time × reference concentration / selected concentration` imposes a fixed exposure product. It does not contain an experimentally estimated kill-rate constant, organism-specific concentration exponent, chlorine-consumption curve, or seed-surface accessibility term.

Therefore it cannot answer:

- “Will 400 ppm for 30 minutes achieve 3 or 5 log?”
- “Does 200 ppm for 60 minutes equal the broccoli 800-ppm result?”
- “Does 12% peroxide for 75 seconds preserve germination and equal 3% for 5 minutes?”

The same nominal ppm may behave differently with pH, seed debris, temperature, bath-to-seed ratio, agitation, solution aging and the target organism. Increasing time can also increase seed damage or run into chlorine depletion. A suspension test on freely exposed bacteria is not a seed challenge test.

**Recommendation for the planner:** show measured study pairs and endpoints first. Keep the current starred arithmetic in a clearly separate illustrative lane, with **no predicted log-reduction score**. The evidence found here is a reason to narrow claims, not to fit a kill curve from incompatible experiments.

## 6. Is there microgreen-community consensus?

### Method and limitation of this comparison

I compared six firsthand growing/supplier guides plus one public community discussion, checking which stage, chemical strength and contact time each actually describes. This is a **purposive source comparison**, not a representative survey, prevalence estimate or formal consensus statement. Published grower advice can change.

| Firsthand source | What its guidance actually says | Implication |
|---|---|---|
| [Bootstrap Farmer](https://www.bootstrapfarmer.com/blogs/microgreens/how-to-disinfect-seeds-before-planting-and-sprouting) | 3% H₂O₂ for 3–5 min, then rinse. | A defined grower bath, not a measured pathogen-log guarantee. [S02] |
| [Home Microgreens](https://homemicrogreens.com/growing-sunflower-microgreens-presoaking-the-seed/) | A teaspoon of 3% peroxide per 25 g of sunflower seed; 5–10 min before adding water for the longer hydration soak. | Seed wetting by stock-strength peroxide is not automatically the same bath geometry or final concentration as full immersion. [S30] |
| [On The Grow](https://onthegrow.net/blogs/microgreens/how-to-grow-sunflower-microgreens) | Current sunflower method uses no presoak, with an optional light mist of roughly two tablespoons of 3% peroxide per liter of water. | An optional sowing-stage diluted mist, not 3% peroxide as the finished spray or a mandatory daily program. [S29] |
| [Fork Farms](https://farmative.forkfarms.com/help/seeding-microgreens) | Allows water or 1% peroxide for overnight soaking of listed varieties; HOCl is mentioned separately in tray cleaning. | Another system-specific procedure; the cleaning reference does not supply an HOCl seed protocol. [S31] |
| [Johnny’s Selected Seeds](https://www.johnnyseeds.com/on/demandware.static/-/Library-Sites-JSSSharedLibrary/default/dw440de445/assets/information/8079-micro-greens-production.pdf) | The reviewed general microgreens production sheet emphasizes seed, media and environment without a sanitizer concentration/time recipe. | Absence in this sheet is not proof that no grower uses treatment; it does not support a chemical consensus. [S32] |
| [Mumm’s commercial growing guide](https://commercial.sprouting.com/pages/growing-a-microgreen-business) | Describes a multi-step heat/chemical sanitation method. | A different approach from a plain HOCl or peroxide bath; not converted into a home mixing instruction here. [S33] |

An illustrative [r/microgreens discussion directly comparing H₂O₂ and HOCl](https://www.reddit.com/r/microgreens/comments/1if006f/h%E2%82%82o%E2%82%82_vs_hocl_for_microgreens_which_is_more/) contains water-only growing reports, peroxide users, environmental troubleshooting and an HOCl tray-cleaning anecdote. None provides a microbial challenge validation. [S34]

**What the sampled sources agree on more strongly:** seed-lot quality, clean equipment, suitable moisture/drainage, density, environmental control and monitoring the crop.

**What they do not establish:** one accepted sanitizer, one ppm, one contact time, one mandatory daily spray frequency, or a standard 12% peroxide seed bath. Peroxide is common in the sampled advice; that does not turn a particular recipe into a validated food-safety control. HOCl seed-treatment parameters are less standardized in these sources.

## 7. What I would conclude for this setup

1. **Do not dismiss HOCl.** It has positive controlled evidence, including a direct sunflower Salmonella study.
2. **Define the endpoint.** For the recurring sunflower mold question, seek fungal/growing-performance results. For a safety claim, seek relevant pathogen validation with actual process conditions.
3. **Use 3 log as a meaningful sprout-pathogen benchmark and 5 log as a stronger goal**, while preserving the regulatory and system distinction. Neither is a guarantee or a home microgreen legal threshold.
4. **Do not declare 400 ppm/30 min or 12%/75 s “best.”** Those values remain unvalidated arithmetic; there is no measured log reduction attached to them.
5. **Do not copy an acidic-water study by acidifying household stock.** Product formulation and instructions matter, and pH 2.76 acidic electrolyzed water is not interchangeable with every HOCl generator output.
6. **Treat grower guidance as a practical starting source, not community certification.** Use a suitable labeled product/process and retain records of seed lot, concentration, time, rinsing, germination, visible mold and usable yield. Qualified microbial work is needed to establish a pathogen-log claim.

## 8. What changed from the earlier research

- Clarified that the “unconfirmed” gap concerns particular extrapolations and crop/process transfer, not absence of positive HOCl evidence.
- Added the direct sunflower Salmonella result and separated it from the broccoli natural-flora result.
- Located FDA’s explicit current 3-log recommendation and its stronger 5-log-plus-testing risk scenario, with the microgreen scope distinction.
- Added measured pea, radish and mung evidence and retained physical-assistance / finished-sprout distinctions.
- Replaced a vague claim of community agreement with a source-by-source comparison and an explicit sampling limitation.
- Corrected the raw-data availability statement: available on request, not a public dataset used by this project.

## Source access

[Source-preservation notebook](source_docs/seed_sanitation/research_resource_log_2026-11-10.txt), entries S20–S36, records identifiers, access limits and conclusions. Existing S01–S19 retain the earlier trail. [FDA source PDF](source_docs/seed_sanitation/deep_review/FDA-sprouts-guidance-2023.pdf) is preserved from its official government endpoint; [capture manifest](source_docs/seed_sanitation/deep_review/deep-review-capture-manifest.json) records its hash. The sunflower institutional PDF failed to download and is **not** claimed as locally preserved.

Key additional identifiers: S21 CFIA current sprouted-seed controls; S22 Inpitak & Udompijitkul 2022, DOI 10.1016/j.ijfoodmicro.2022.109668, PMID 35410797; S23 Zhang et al. 2011, Food Control 22:792–796; S24 pea study, DOI 10.1016/j.foodcont.2019.04.029; S25 radish study, DOI 10.1016/j.foodcont.2016.02.045; S26 Chen et al. 2025, DOI 10.1016/j.foodcont.2024.110767; S27 alfalfa microbubble follow-up, DOI 10.3390/seeds4040051, supplementary lead with access limits; S28 historical NACMCF sprout recommendations, PMID 10733245; S29–S34 firsthand growing/community sources; S35 risk-assessment context, DOI 10.1111/risa.12964; S36 harvested-broccoli wash, DOI 10.1016/j.lwt.2017.09.044.
