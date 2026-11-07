# Your seed packets, rate history and next harvest

*November 7, 2026. [Open the crop planner](site/dist/crops.html) · [My grow log](site/dist/grow-log.html) · [Published rate history](data/seed-rate-history.json) · [Source notebook](source_docs/research_resource_log_2026-11-07.txt).*

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
