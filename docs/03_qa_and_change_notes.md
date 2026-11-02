# QA and change notes

*October 30, 2026.*

## Changes and purpose

- Added the Grow Lab landing page and one functional tool: light/canopy planning. Planned tools are clearly labeled and do not pretend to be available.
- Added exact 4-foot LED specification guidance, reconciled MGM's six versus ten lights, and traced his Hykolity link to the 22 W family.
- Added front/back spread, tray orientation and fit, growing-canopy clearance, independently entered PPFD/DLI, rack power and a downloadable plan.
- Added a specific guide, model documentation, creator notes, rendered/raw views and a source recovery log. Reused freely available extension/starter PDFs.
- Preserved all existing archive edits; Site source is isolated from the pre-existing uncommitted research work.

## Automated checks

The model tests pass for DLI identities, electrical arithmetic, clearance, overhang, positive finite outputs across 64 geometry combinations, symmetry, bar additivity, optical independence from electrical watts, and 48-versus-192-segment convergence at tested points within 2.5%.

The site validator checks every local link and fragment, script and stylesheet references, duplicate IDs, page titles and native input labels. JavaScript syntax checks run for both interactive scripts.

## Browser verification and limit

The local server returned HTTP 200. The initial desktop screenshot showed correct page hierarchy, controls, native form widgets, preset row and the top of the coverage diagram. Its accessibility state showed the expected default **8-inch gap**, **60 W/shelf**, **300 W/rack**, **144 kWh/30 days** and **$21.60/rack at $0.15/kWh**. The initial dose input was blank as intended.

Further interaction and responsive browser verification were blocked by the browser tool reporting **local browser use is disabled in Work settings**. Mobile CSS and SVG labels were adjusted by source inspection, but mobile rendering, live preset transitions, download behavior and measurement invalidation are **not browser-verified**. The reusable Node tests verify the underlying numeric calculations, not these UI events.

## Evidence limits

No exact shelf has been physically mapped. Relative optical geometry is uncalibrated, creator attribution does not prove an optimum, and hardware variants can change. Defaults for tray outer dimensions, medium elevation, fixture drop and several bar positions are explicitly illustrative. These are operational gaps for a future measured-shelf pass, not missing values silently filled with manufacturer lumens.

## Hosting handoff status

A private Site was registered and its exact identity persisted in `site/.openai/hosting.json`. The initial short-lived credential expired during research/build. Credential renewal and the subsequent read of the same Site both returned **Sites project not found**. No source was pushed, no version saved and no deployment succeeded. The original identity is retained; no duplicate Site was created. The expected URL is not presented as a live result.

The complete local `site/dist/` is usable as static files without a server because the tool does not fetch remote data. A portable ZIP of that folder accompanies the topic. Reconnect to the same Sites workspace/account and resolve access to the retained Site before resuming publication. Browser automation remains disabled as described above.

The archive topic audit also completed with **zero broken local links and zero warnings**.

## Follow-up validation: period dose and MGM edge placement

- Added hours/day, lit days and a selectable daily reference band. Total exposure uses mol/m²; daily DLI retains mol/m²/day. The period benchmark multiplies the daily reference by the same days.
- Added a cumulative reference-band chart, below/within/above status, corresponding PPFD reference for the chosen schedule, period energy/cost and schedule-aware export.
- Revised the MGM two-bar preset from 8-inch separation to a **2-inch edge inset / 14-inch separation** on its 18-inch shelf. Direct inspection of the rack chapter supports edge placement; exact coordinates remain inferred. The older article's inconsistent 8-inch wording is retained in the evidence notes.
- Numeric tests now cover seven-day totals, reference boundaries, zero/invalid inputs, daily-hour changes, period energy and the new bar positions.
- A non-browser harness executes the **actual UI script** and checks displayed totals/status, schedule-linked cost updates, blank/invalid states, and PPFD reset/retention. It caught and resolved a stale variable during implementation and now passes. This tests event logic, not visual rendering or real browser downloads.
- A fresh browser attempt still reported local browser use disabled in Work settings, so responsive visual QA remains unverified. The Sites read still returns project not found; publication was not attempted with a replacement identity.

## Follow-up: specific TRINITY rack and installed height chain

Added the six-shelf model and its source evidence page. Product dimensions come from Costco/TRINITY, Hykolity and Bootstrap Farmer; unknown mounting, rail/grid depth, nesting and fill dimensions remain editable assumptions or direct measured overrides. The manufacturer manual is locally preserved.

The default reconstruction gives a 1.78-inch lamp drop, 1.275-inch medium elevation and 3.945-inch leaf gap for a 10-inch pitch and 3-inch shoots. This is conditional arithmetic, not a measured creator rack. Main MGM preset and selected-bay transfer use these offsets; generic presets retain their generic examples.

Numeric and actual-script event tests pass for grid vs rail mounting, measured overrides, nested trays, separate pitches, frame/fill validity, caster-invariant gaps, beginner unlit bays and precision-preserving transfer. A fresh browser attempt still reports local browser use disabled. A fresh Sites read still reports project not found; local output remains the delivery route.

## Follow-up: default light level and dropdown

At the user's request the dose calculator now initializes with an assumed **200 PPFD** and calculates 11.52 daily DLI / 80.64 mol/m² over its default 16-hour, 7-day period immediately. The dropdown offers 100, 150, 200, 250 and 300 PPFD examples and a custom/measured option. Custom numeric entry and value-source controls stay hidden until needed.

Assumed scenarios persist across layout changes with an explicit assumed-light label. Measured custom readings retain the existing invalidation on a physical change. Tests cover every dropdown option, default initialization, conditional fields, reference status, reading-basis export, assumption retention, measured reset and rack transfer. Browser rendering remains unverified; Sites access still returns project not found.

## Follow-up: 24-inch depth and Costco link

Defaulted the rack page and every planning lighting preset to 24-inch shelf depth. Added a prominent direct link identifying the original Costco item as 18 inches deep. Kept that original depth as an explicit reference, blocked its four-tray no-overhang transfer, and carried depth through the rack-to-lighting link. The adapted MGM method uses assumed 2-inch edge insets / 20-inch bar separation. Tests check default depth, containment, reference rejection and transferred depth.


### Original MGM preset restored

Restored a separate **Microgreen Manager · original 18″** lighting preset alongside the 24-inch adaptation. It uses the archived source-rack reconstruction (two 22 W bars, five lit shelves, four trays, 16 hours, 10-inch pitch and assumed 14-inch bar separation). Its note distinguishes source facts from reconstructed geometry and the tray-fit warning remains visible. The default remains the 24-inch shelf trial. Event-handler checks cover both presets and their independent depth/spacing values.


### MGM selected by default; 2-inch shoot example

The lighting page now opens on the original 18-inch MGM preset. Static form values, selected button and script initialization agree for every geometry field: 10-inch pitch, two 22 W bars, 14-inch assumed separation, 46.1-inch fixture length, 1.78-inch lamp drop, 1.275-inch medium elevation, four trays and five lit shelves. All presets and the detailed rack use an editable 2-inch canopy-height example. The original reference retains its tray-overhang note; the 24-inch adaptation remains available. Maryland Extension L27 supports a typical 2–3-inch harvest range; 2 inches is a scenario choice rather than a documented MGM height. Event tests verify every preset field, changing away and back, default selection, recalculated gap and costs.


### Representative midpoint between first light and harvest

Replaced the single starting height in the lighting planner with editable first-light and harvest examples (1 and 2 inches) and a first/midpoint/harvest/custom selector. The default is their 1.5-inch midpoint. All five presets reset the full profile, while imported rack geometry retains its supplied height in custom mode. The caption shows first-light and harvest clearances and explains the roughly linear growth assumption. Dose copy distinguishes midpoint height from time-average PPFD; the constant-PPFD dose equation is unchanged. Actual-script checks cover endpoints, midpoint changes, invalid/reversed/blank values, custom selection, preset reset and export. Local browser rendering remains unverified because the browser tool rejects file URLs.


### Simplified height control

Removed the first-light, harvest-height and stage fields at the user’s request. The lighting planner returns to one shoot-height slider, with a representative **1.5-inch mid-growth planning default** for every preset and the detailed rack. MGM remains selected on opening, with all other setup dimensions unchanged. Removed stage-specific script, export data and UI checks; existing event checks verify the single slider, preset resets, clearance and imported height.


### Automatic lamp-based median dose

Defaulted the light-level dropdown to Auto and coupled the existing canopy geometry to an explicitly assumed output scale: Hykolity’s 2200 lm / 22 W = 100 lm/W, with Iowa State Extension’s rough divide-by-60 photon conversion. The true spatial median over equal-area planted cells feeds daily and period dose, while the sampled range stays visible. The heatmap now uses the exact same cells as the median calculation. Fixed examples and measured/custom overrides remain, with geometry invalidation for measured readings. Export records automatic basis, assumptions, median, mean, sampled range and spectrum-only sensitivity.

Tests cover watt scaling, median vs range midpoint, invalid/zero cases, geometry sensitivity, photon conservation, analytical kernel normalization, live UI updates, overrides and exports. The new estimate is about 81 median PPFD for the reconstructed MGM default, rather than the former independent 200 example. It is an uncalibrated scenario and not an audit of his actual farm. Browser rendering remains unverified due to the file-URL browser policy.


### Source-linked assessment of the user-pasted MGM setup

Added a separate review of the exact pasted configuration, with source distinctions for MGM practice, Virginia Tech general/species-specific guidance, Liu 2022 and archived de Lima 2026. The assessment treats the setup as a reasonable low-cost crop trial with limited lighting headroom; the generic low-DLI badge does not prove failure. It also explains that copying 2-inch edge insets onto a 24-inch shelf can weaken center coverage. Added reading links without changing lamp settings, presets, dose equations or thresholds. Preserved the input snapshot and source notebook records.


### Wider bar-spacing control

Removed the slider’s arbitrary 2-inch edge inset restriction while retaining the creator presets. Outer bar centers may now approach 0.5 inch from each edge. Three bars can spread to 8.5-inch adjacent spacing on an 18-inch shelf or 11.5 inches on a 24-inch shelf. Actual-script checks verify the expanded range, depth-change clamping, two-bar range, one-bar disable behavior and preset restoration.

## Coco coir calculator and guide — November 1, 2026

Added a dedicated [coir calculator](site/dist/coir.html) and [preparation/calibration research guide](12_coco_coir_preparation_and_calculator.md). The component preserves the supplied 6/8/6/8 cup crop trial, labels 4 mL/g as an uncalibrated starting assumption, separates hydration from later irrigation, and keeps earlier near-full fills as explicit comparisons. Rounded per-tray weigh-outs sum to 630 g and 2.52 L for one of each crop.

Validation: `test-coir.cjs` checks all 625 count combinations (including over-capacity rejection), conversions, rounding, incomplete/wet/dry calibration, invalid numeric bounds, scaling, cost-only price effects, stock shortfall and exports. `test-coir-interactions.cjs` executes the actual UI script and checks controls, diagrams, saved-state restoration, worksheet consistency and empty/error states. Browser interaction checks confirmed two-tray totals, four-tray limit suppression and measured water calibration; desktop and 390 px mobile visuals were inspected, with no body-width overflow at 390 or 320 px. Shared local-link/fragment/title/ID/label validation passed.

The supplied conversation and original source notebook are downloadable separately. The coir notebook uses a distinct filename from the existing crop-research notebook. Online publication is still blocked by `Sites project not found` for the retained project identity.


## November 2, 2026 — purchased shop T8 default

Added My Barrina T8 · 2 × 40 W as the selected default (ASIN B07G2Q4VZN, user-supplied listing: 5,500 lm per fixture, 5000 K). Output now uses editable fixture efficacy: 137.5 lm/W for the purchased T8 and the previous 100 lm/W for comparison presets. Default power is 80 W/shelf; a six-pack supports three shelves. Prior geometry is retained and its body length/mount drop explicitly remain assumptions for the T8. Added default, efficacy, power, export, preset-switching and rack-import checks. Rebuilt research views and portable ZIP. Hosting recovery still returned Sites project not found.

Verification: lighting model, actual-script interactions, rack model/interactions and 367 local links passed. Chrome desktop preview confirms the selected Barrina preset, two lights, 40 W each, 80 W/shelf and the recalculated estimate. Mobile rendering was not checked in this pass.

## Fill-height correction — November 2, 2026

The original 6/8/6/8-cup split had no established species-specific fill basis. The calculator now defaults to OTG’s documented economical six-cup baseline for all four crops (540 g dry coir / 2.16 L starting water for one of each). A separate 12/12/8/8-cup **seed-clearance trial** provides a higher small-seed bed and lower pea/sunflower bed (900 g / 3.60 L total). This relative pattern is supported by Scintilla Farms’ firsthand Paperpot method; its exact Bootstrap/coir volumes are explicitly an adaptation. Existing saved plans remain intact, with a legacy explanation when the old split is detected. See the [updated guide](12_coco_coir_preparation_and_calculator.md) and [November 2 notebook](source_docs/coir/research_resource_log_2026-11-02.txt). Earlier delivery figures in this document are historical.
