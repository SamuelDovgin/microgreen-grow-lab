# Your seed packets, rate history and next harvest

*Updated November 9, 2026. [Open the crop planner](site/dist/crops.html) · [My grow log](site/dist/grow-log.html) · [Published rate history](data/seed-rate-history.json) · [Source notebook](source_docs/research_resource_log_2026-11-07.txt).*

The supplied photo identifies **True Leaf Market Waltham 29 broccoli (1 lb), organic Daikon Minowase radish (1 lb), Black Oil sunflower (5 lb), and organic Speckled pea (5 lb)**. These are packet identities, not measured seed-lot counts, germination or actual sown trays. The planner exposes all four packets plus mung beans from your previous grow in a ready-to-plan section. The mung card uses your 180 g dry-seed trial rate and the existing 10 h selected presoak; its button plans preparation from now. No mung supplier or packet size is inferred. [U01 — user photo and instructions]

## Starting amounts ready in the planner

| Your packet / crop | Selected dry seed per nominal 200 in² tray | Selected preparation | Notes |
|---|---:|---|---|
| Black Oil sunflower | **130 g** | 6–12 h soak window; calendar selects **9 h** | Existing coir starter, 15 lb added load, then loose blackout. The rinse-only and 8 h On The Grow recipes remain separate alternatives. |
| Daikon Minowase radish, organic | **28 g** | **No soak** | The supplier’s exact named recipe is 1 oz, about 28.35 g. Its two-day cover and 6–10 day harvest window remain selectable. |
| Waltham 29 broccoli | **20 g** | **No soak** | Existing coir starter with an empty cover and no added paver. Supplier’s separate 1 oz recipe remains available. |
| Speckled pea, organic | **225 g** | Existing coir starter selects **6 h** | The named supplier alternative selects 5 h within 4–6 h cold soak, uses its dome method, and has its own 5–8 oz mass range. |
| Your first mung trial | **180 g** | Existing 8–12 h window; selects **10 h** | Your chosen first amount, recorded November 7. Harvest yield, exact sowing date and actual planted area remain unknown. |

The four previously reviewed starter masses are retained. Matching a packet does not make a mixed-source coir starter identical to every supplier instruction. Compare the named alternatives when reproducing a supplier method. All weights are **dry, before soaking**. If a source describes soaked mass, that is not silently substituted for dry grams. [D37–D40; existing grower sources D31–D33 and seed comparison P01]

True Leaf’s Daikon Minowase page specifies no soak, 1 oz per 10×20 tray, two dark days and 6–10 days to harvest. Waltham 29 specifies no soak, 1 oz and 8–12 days. Its narrative and table describe somewhat different covered windows, so the local coir method retains its own provenance. [D39 — radish](https://trueleafmarket.com/products/radish-sprouting-daikon-organic-seeds?variant=38824751240) · [D38 — broccoli](https://trueleafmarket.com/products/broccoli-waltham-29-microgreens-seeds)

Speckled pea’s supplier describes 4–6 h cold soaking, 5–8 oz per 10×20, and 8–14 days. Its optional presprouting stage is distinct from soaking followed by immediate sowing; the named planner option uses immediate sowing. The sunflower product confirms Black Oil identity and warns seed is no longer sorted by size. Its approximate counts are not a measurement of your lot. On The Grow independently documents 125 g dry Black Oil seed in shallow Bootstrap trays; the retained 130 g starter is a nearby source-reviewed trial, not a universal optimum. [D37 — pea](https://trueleafmarket.com/products/pea-sprouting-speckled-organic) · [D40 — sunflower packet](https://trueleafmarket.com/products/sunflower-black-oil-microgreens-seeds) · [D31 — grower method](https://onthegrow.net/blogs/microgreens/how-to-grow-sunflower-microgreens)

## Planning sunflower and radish from now

Choose the corresponding **Plan … from now** button. It loads a nominal 20×10 inch tray and your current selected starter, including a saved personal trial rate when present. Radish has no presoak, so the planned sowing time is now. Sunflower sowing is scheduled after the selected soak: starting its 9 h default at 15:00 on November 7 plans sowing for 00:00 on November 8. Its preparation step remains on November 7. Times follow your browser’s local clock.

This creates a plan only. It does not invent a sowing event, confirm that you have started a soak, or add a tray to the grow log. Correct the date/time if the seeds are already soaking, then use **Log this tray** and verify the actual inputs.

Follow root anchoring and upright emergence at cover removal. The height cues are approximate, not growth predictions. Bottom-water only when the medium wicks and roots have access; the calendar’s water amounts are scenarios to calibrate from your tray, not mandatory additions.

## Your mung change is kept in history

The recent website revisions are **150 g → 215 g → 180 g**. The first two changes were committed November 6; your 180 g choice was reported November 7. Earlier count-derived research presets also remain in the historical data. These are **revision dates**, not asserted sowing dates. The 180 g choice is not labeled a measured yield winner. The 215 g supplier rate, 450 g Vitality recipe and study count benchmark remain selectable. [U01; Git-backed published history]

The published history was reconstructed from seven committed crop-data snapshots. It records every changed mass for the current 55 crop profiles, including the prior amount, date, source, reason and source commit. Dates use the Git author timestamp in its recorded offset. Historical seed-count recipes use the seed-size input saved in that revision. The build rejects a changed default unless a matching new history entry has been appended.

## Saving later refinements

In **Seed-rate history & your next trial**, enter the actual dry grams for the entered tray area, a reason, and optionally the seed lot and tray IDs or yield notes. **Save as my next trial rate** appends a dated revision and loads it as your personal default for that crop in this browser. It preserves both actual grams/area and the normalized g/200 in² reference. For example, 150 g on 100 in² is 300 g/200 in²; it is not a 150 g full-tray rate.

Each revision also preserves the chosen preparation/calendar recipe. Changing a rate, selecting a different source, or importing a history never rewrites existing grow-log snapshots or harvested trays. Website defaults and personal trial choices remain distinguishable.

Use **Export rate history** to keep the personal revisions portable. The backup includes the published history for reference; importing merges personal revision IDs without replacing published website history or overwriting conflicting IDs. Personal defaults live in your browser, not a cloud account, and do not automatically reach this chat. A blocked/full store reports that changes are held in the current tab; export before closing. Export **My grow log** separately for the complete measured tray records.

For the next refinement, record actual dry seed grams, lot/cultivar, planted area, sow and harvest dates, growing conditions, gross/rejected/saleable harvest mass, and useful quality notes. Leave missing yield unknown. Keep failures as zero saleable output. Compare the same lot, medium and harvest stage over repeated trays; a larger harvest from more seed does not automatically mean better seed efficiency or quality. No automatic optimum is inferred from an unmeasured trial.

## Verification

The rate model and actual UI tests cover history persistence/reload, area normalization, date/soak rollover, nonoverwriting imports, stale tabs, storage errors and protected unreadable data. Existing crop, grow-log, coir and lighting checks remain in place. Local browser verification on November 7 checked the desktop packet cards and the 390×844 phone layout, confirmed no page-level horizontal overflow, exercised sunflower/radish start timing, and inspected the dated mung history. A timezone ordering issue in date-only history entries was found and corrected. Automated checks separately cover persistence and error cases.


## Approximate growing phases from other growers

*Reviewed November 9, 2026.* These are practical ranges synthesized from multiple growers, not a statistical average. **Germination** below means the covered establishment period after sowing, not the first visible root. **Blackout** means extra loose-cover darkness after that period. **Light** means elapsed growing days under a normal daily light cycle, not 24-hour illumination. Soaking comes before these phases.

<!-- BEGIN GROWER PHASE TABLE -->
| Crop | Covered germination | Extra blackout | Under lights | Height at light transition |
|---|---|---|---|---|
| Black Oil sunflower | ≈3–4 days | ≈0–3 days | ≈3–7 days | 1–2 in. Approximate light-transition cue; check roots and hull release. |
| Daikon Minowase radish | ≈2–4 days | ≈0–2 days | ≈3–5 days | 1–2 in with stretch blackout. Earlier light is also used; do not chase height if stems lean. |
| Waltham 29 broccoli | ≈2–3 days | ≈0–2 days | ≈3–7 days | 1–2 in with stretch blackout. Early-light methods uncover around ½–1 in; 2 in is not required. |
| Speckled pea | ≈2–5 days | ≈0–3 days | ≈4–8 days | ¾–1¼ in for early light. Longer stretch methods vary; move before shoots tangle. |
| Mung beans | ≈3–4 days | ≈0 days | ≈3–7 days | ½–1 in · rough observation cue. No grower-verified inch threshold found; use rooted, upright emergence. Timing evidence is limited. |
<!-- END GROWER PHASE TABLE -->

The ranges vary together: do not add every minimum or maximum to predict harvest. A short blackout often means more days under lights. For example, 3 covered days + 1 blackout day + 5 lit days is a 9-day crop. The plan buttons continue to load their selected starter recipe; these cards summarize the wider grower practice. Use rooted emergence and upright growth to decide when to uncover, and measure height above the medium. Remove contact trays and loads before shoots bend beneath them.

### What to look for before switching stages

There is **no verified fixed height for starting loose blackout**. The card illustrations show rooted emergence and upright growth, not a scale drawing or an automatic readiness score. Look across the tray rather than at the first sprout. For brassicas and sunflower, pale growth replacing the dark hull layer and shoots lifting the contact tray help signal the end of covered establishment. Remove pressure as stems start to bend beneath it. Extra blackout is an optional stem-length choice for these crops; when used, invert or raise the dark cover so shoots have space, with no added load. Finish while stems still stand on their own. [G03,G15]

<!-- BEGIN TRANSITION CUES -->
- **Black Oil sunflower:** Rooted shoots are lifting the contact tray; pale growth is replacing the blanket of black hulls. Remove the load and contact tray. Use a loose dark dome for the chosen stretch method; extra blackout is optional.
- **Daikon Minowase radish:** Most of the tray has emerged and anchored; pale seedlings outnumber dark hulls. Remove the contact tray. Add a loose dark dome only for optional stem stretch; earlier light also works.
- **Waltham 29 broccoli:** Pale seedlings cover most of the tray, roots hold in the coir, and shoots push up the contact tray. Remove the contact tray. Use a loose dark dome for optional stretch, or move straight to light.
- **Speckled pea:** Roots are anchored and shoots have emerged across most of the tray, pushing up the contact cover. Remove the contact tray and any load. A loose dark dome is optional; move to light before shoots tangle.
- **Mung beans:** Roots are anchored and shoots stand upright across most of the tray. A tiny root tip alone is too early. Remove the contact cover and move to light. This starter uses no extra blackout; the height below is only a rough cue.
<!-- END TRANSITION CUES -->

The existing inch ranges describe **when to move into light**, measured above the coir. They are not minimum heights for removing the contact cover. Pea and mung readiness wording is an editorial application of rooted emergence, not a verified crop-specific height threshold. Do not extend darkness just to reach a number.

### What the growers actually do

| Crop | Grower comparisons | What this means for the card |
|---|---|---|
| Sunflower | Piedmont lists 3 covered days and a 9-day crop [G01,G02]. On The Grow uses about 4 + 1 dark days [G07]. Bootstrap uses 2–3 stacked + 2–3 blackout [G06]. Wind River introduces light at 1–2 inches [G08]. | Allow 0–3 extra dark days across methods; shorter darkness shifts growth into the light phase. |
| Broccoli | Piedmont: 3 covered days [G01]. On The Grow: 2–3 + 1 [G04]. Bootstrap: 2–3 + 0 [G06]. Yardibles: about 3 + 1–2, then 2–3 lit days at a 1–2-inch transition [G05]. | A 2-inch target belongs to a stretch method; earlier light also works. The typical 3–7 lit-day band does not capture every early harvest. |
| Daikon radish | Piedmont: 3 covered days, 8 total [G01,G02]. Bootstrap: 2–3 + 0 [G06]. On The Grow: roughly 4 + 1 + 3–4 [G09]. True Leaf: 2–4 + 1–2, with taller stems [G10]. | Separate short/no-blackout recipes from the optional stretch; the old ½–1-inch universal note was too narrow. |
| Speckled pea | Piedmont: 3 covered days, 9 total [G01,G02]. On The Grow’s 1020 method: 3 + 1, harvest 8–14 [G11]. Bootstrap: 2–3 + 1–3 [G06]. LaNiTex: light around 0.8–1.2 inches, later tendril harvest [G12]. | A wide range reflects tray and harvest differences. The height cue is for early light, not a required stretch target. |
| Mung | MP Seeds: 3–4 covered days + about 3 lit [G13]. Vitality: 3–4 covered + about 7 lit, although its total-time heading conflicts [G14]. | Evidence is thinner. Show 0 extra blackout and 3–7 lit days; retain an explicitly rough height cue rather than invent a verified cutoff. |

Light durations are directly reported where available (Yardibles, Vitality, MP Seeds) and otherwise inferred from a source’s light-start and harvest timing. Piedmont’s two table vintages are context, not a single matched experiment. Generic crop methods are not measurements of your exact cultivar or seed lot. See the [complete review notebook](source_docs/research_resource_log_2026-11-09.txt) and [machine-readable card guidance](data/quick-start-growing-guidance.json).

### Grower sources for these estimates

- **G01 — [Microgreen Manager / Piedmont — germination table](https://microgreenmanager.com/blog/germination-id-guides)**. Broccoli, Daikon, basic pea and sunflower each have a three-day stacked germination period. Published 2025; this is covered emergence, not time to first root.
- **G15 — [On The Grow — weight to blackout visual cues](https://onthegrow.net/blogs/microgreens/unlocking-the-secret-knowing-the-right-time-to-transition-microgreen-trays-from-weight-to-blackout)**. Visual emergence and release of pressure guide the transition; no universal starting height is given. Extra blackout ends while stems remain upright.
- **G02 — [Microgreen Manager / Piedmont — yield table](https://microgreenmanager.com/blog/microgreens-yield-cheatsheet)**. Published 2024: broccoli 10 days, Daikon 8, basic pea 9 and sunflower 9 to harvest. Different vintage from G01; light durations inferred across these tables are approximate.
- **G03 — [Microgreen Manager — separate blackout](https://microgreenmanager.com/blog/blackout-step-for-microgreens)**. Defines blackout as an optional post-germination stretch. Says most crops do not need it; harvesting equipment and stem length affect the choice.
- **G04 — [On The Grow — broccoli](https://onthegrow.net/blogs/microgreens/how-to-grow-broccoli-microgreens)**. Two to three days with an empty contact tray, then about one day under a loose dark cover. Light cue includes lifting the tray roughly half an inch; tray lift is not an absolute plant-height measurement.
- **G05 — [Yardibles — broccoli walkthrough](https://www.yardibles.com/how-to-grow-broccoli-microgreens-benefits-nutrients/)**. About three days germination, one to two extra dark days, light at one to two inches, then two to three lit days. This is a longer-stem method, not proof that earlier light fails.
- **G06 — [Bootstrap Farmer — crop chart](https://www.bootstrapfarmer.com/pages/ultimate-microgreen-growing-resource)**. Broccoli and radish: stack two to three days, no separate blackout. Peas: stack two to three plus one to three blackout days. Sunflower: stack two to three plus two to three blackout days. Harvest: 7–10, 7–10, 8–12 and 9–12 days respectively.
- **G07 — [On The Grow — black-oil sunflower](https://onthegrow.net/blogs/microgreens/how-to-grow-sunflower-microgreens)**. About four weighted dark days, then one loose blackout day, sometimes another for hulls. Reports eight to ten days overall; roughly three to five lit days is subtraction, not a separately reported duration.
- **G08 — [Wind River Greens — sunflower](https://windrivergreens.com/blogs/guides/how-to-grow-sunflower-microgreens-step-by-step-complete-beginner-s-guide)**. Moves sunflower to light around one to two inches after three to four dark days. Seven to twelve days total. Uses blackout to include covered germination; no additional stretch period is specified.
- **G09 — [On The Grow — radish](https://onthegrow.net/blogs/microgreens/how-to-grow-radish-microgreens)**. Detailed method keeps contact cover until around day four, adds one blackout day, lights around day five and harvests around day eight or nine. Light phase is therefore about three to four days.
- **G10 — [True Leaf Market — radish grow guide](https://trueleafmarket.com/pages/how-to-grow-radish-microgreens-guide)**. Two to four covered germination days plus one to two extra blackout days; stretch stems no taller than about two to two-and-a-half inches. Overall harvest eight to ten days. Generic radish guidance, not a Minowase-specific trial.
- **G11 — [On The Grow — peas on different trays](https://onthegrow.net/blogs/microgreens/how-to-grow-pea-microgreens-on-various-trays-quick-and-easy-guide)**. 1020 method: about three days contact cover plus one loose blackout day. General summary allows three to five germination days and one to two extra blackout days. Harvest eight to fourteen days; includes Speckled among preferred peas.
- **G12 — [LaNiTex — pea shoots](https://lanitexhydrogarden.com.au/blogs/microgreen-blog/how-to-grow-pea-microgreens-australia)**. Two to three dark days, light at two to three centimetres (about 0.8–1.2 inches), ten to sixteen days to a later tendril harvest. Different harvest target from a young Speckled crop.
- **G13 — [MP Seeds — mung bean microgreens](https://mpseeds.eu/mung-bean-microgreens-seeds)**. Microgreen prose: three to four days germination and another three in light. Product table says three to four blackout days and eight to nine total. These are overlapping dark-stage labels, not two sequential dark periods; timing is internally inconsistent.
- **G14 — [Vitality Farms — Growing Micros, mung p. 40 and radish p. 42](https://vitalityfarmscompany.com/wp-content/uploads/2022/04/micro-grow-notes.pdf)**. Mung: three to four stacked days then about seven lit days, conflicting with its seven-to-ten-day harvest heading. Radish: two to four stacked days then three to four lit days. Contributed recipes are not independently replicated trials.
