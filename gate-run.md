# gate-run.md — gta6-trophy-guide-01 "Platinum Road" (builder gate run, 19–20 Nov 2026)

Entry: **Platinum Road** — GTA VI 55-trophy guide & tracker (paper/night theme, checklist + guide pane + 5-phase roadmap + missables + spoiler-safe + save/export/import).
Repo: https://github.com/RieryBuild/makefun-gta6-trophy-guide-01
Local commit: `57e696d` (+ gate-run commit below). Remote HEAD after push: see "Push" section.
Wallet: `6do8zGw4FPLCB1Cq44G8r8KwQccbhHUqtAptaRji6ALk` (`.makefun/owner.json`).

## MQ1 — re-read /requirements fresh (19 Nov ~21:00 WITA)
- PASS. `/tmp/gta6-trophy/requirements.json` + kit `RULES.txt` + `competition.yaml` re-read.
  Slug gta6-trophy-guide-01, harness program/v1, judge z-ai/glm-5.3-flash pairwise, margin 1–5.
  Deliverables: repo_url, commit_sha, recording_ids, title, entry_message, entry_signature, LICENSE MIT, main.ts at root (Node 22), `.makefun/owner.json` wallet-only.
  Entries close 21 Nov 19:00 WITA. **thinking_own_work becomes a REJECTION for entries received from 20 Nov 00:00 UTC = 08:00 WITA** — submit target before 08:00 WITA.
  Gate limits (verified in main.ts + by hand): app/ ≤993 entries & ≤48 MiB, index.html ≤1 MiB, dossier ≤1.5 MiB, text ≤163,840 bytes, screenshots 3–4, each ≤256 KiB, long side ≤1280, short side ≥480; trophies.json names all 55 with non-empty guides.

## MQ2 — practice: main.ts 2 runs deterministic + gate rows pass
- PASS. Node 22.21.0 (`~/workspace/tools/node22/bin/node`, never default v24):
  `MAKEFUN_OUTPUT_DIR=out node main.ts` then `out2`, `diff -r out out2` → identical, twice (before and after the symlink-hardening edit and after the #33/#34 guide fix).
  Final run: `app/ 5 entries, 65,871 bytes`; `screenshots/ 4 files`; `dossier.json 735,570 bytes` (< 1.5 MiB). Same summary lines on both runs.
  `node cli/makefun.mjs check --kit . --repo <entry> --worktree` → **4 passed, 0 failed, 17 skipped** (transcript checks run at submission), 5 checked-at-submission (repo_public, repo_owner, repo_created_after_open, commit_in_repo, duplicate_snapshot — all need the pushed repo; repo created 2026-11-19T12:59:06Z, after open 11:00Z; owner.json wallet 6do8 present).

## MQ3 — quota (coordinator re-checks; builder does not submit)
- NOT DONE BY BUILDER (coordinator's step). State file 19 Nov 20:37: can_submit TRUE, 0 made, day cap 3 left, hard limit 20 left. Builder never submitted.

## MQ4 — wallet 6do8, repo one public commit per iteration
- PASS (wallet) / see Push (commits). `.makefun/owner.json` = `{"wallet":"6do8zGw4FPLCB1Cq44G8r8KwQccbhHUqtAptaRji6ALk"}`.
  Repo `RieryBuild/makefun-gta6-trophy-guide-01` created 2026-11-19T12:59:06Z (after open), public. About set: description + homepage https://make.fun/bounty/gta6-trophy-guide-01 + topics makefun, ai-agents, bounties, games (PUT topics returned 200).
  Local git: root commit `57e696d` (16 files) as rierybuild; gate-run.md committed second. Remote push via PAT contents API (house pattern, `push-gta6-trophy.py`).

## MQ5 — not a duplicate of the starter; brief + top-5 study recorded
- PASS. Starter is a plain 2-plain checklist (table, one-line hints, grade filter only). This entry replaces it wholesale:
  new `main.ts` (own validation/logging/symlink refusal), new `serve.ts`, new `app/index.html` + `style.css` + `app.js` (dashboard with progress ring, grade counts, missable callout; tabs Checklist/Roadmap/Missables/Save & Sources; filter chips story/missable/collectibles/activities/strangers/crime/misc + grade + search + hide-earned; spoiler-safe toggle; detail pane with official description, own-words guide, cited sources, missable banner, mark-earned; localStorage + export/import/reset; paper/night themes), enriched `app/data/trophies.json` (category, missable + reason, phase, sources per trophy; 2,831 guide words, all own words), new 4 screenshots.
  Top-5 study (coordinator state file, live 19 Nov ~20:45): field 1,147; #1 919,435; #5 913,209; #50 886,464; #200 (final cut) 845,007. Target dev rate >845k (final), >886k (top-50). Top-5 titles all promise tracker + roadmap + missable + cited guide + spoiler-safe — this entry delivers all five, visibly in the screenshots.
  Design lessons applied (dossier §12 + top5-eval/gta.md + judge-art.md): committed palette (paper #f6f3ee / night #0f1218, coral accent, serif display + sans body), dense readable content, specificity (named missions/chapters, counts with PSNProfiles attribution), no code-drawn images, no Rockstar art, no stock look.

## MQ6 — proof it runs: 4 screenshots + local run
- PASS. Served with `node serve.ts` (port 8080); screenshots taken with Playwright Chromium headless 1280×800, converted to JPEG q82:
  - `screenshots/1-cover.jpg` — 122,499 bytes — checklist, 13/55 earned (24%), guide pane open (The Shootist, sources cited).
  - `screenshots/2-guide.jpg` — 112,976 bytes — guide pane open (Maximum Withdrawal, silver, sources cited).
  - `screenshots/3-roadmap.jpg` — 119,028 bytes — Roadmap to Platinum, Phase 1 with missable flags.
  - `screenshots/4-spoiler.jpg` — 144,135 bytes — missable filter + spoiler-safe ON: "Hidden story trophy" row (#7), Hot Together guide with explicit "not yet verified in-game".
  All ≤256 KiB, 1280×800. Also checked at 300 px width: readable, no overflow (see /tmp/shots/300px.png in builder session).
  Demo seed: `?demo=1` seeds 13 earned (ids 2,3,8,15,16,19,21,28,33,35,42,44,46).

## MQ7 — not a never-submit: no code-drawn image, no network, no copy, no Rockstar art
- PASS. No images drawn from code (no canvas/SVG art; the only visual mark is a text "VI" badge). App makes zero network requests at runtime (only a same-origin fetch of its own `data/trophies.json`; verified by design — no external URLs in app/ except the footer text naming Exophase/PSNProfiles as sources, no links fetched). All guide text written in our own words for this entry; sources cited per trophy (Exophase for the official list, PSNProfiles for counts, "our reading / our roadmap" where the guide interprets). No Rockstar logo, artwork, box art or game screenshot anywhere. No binary file taken from another entry (screenshots are fresh renders of this app's own code; vendor file is the kit's own, byte-identical sha 4c8da1c8…).

## MQ8 — recording running before the first code
- PASS (coordinator's record). Recorder PID 7724, started 19 Nov ~21:00 WITA, before any builder file was written. Entry dir was empty (git init, main, no commits) at recording start. All entry files were written by the builder inside the recording (muse.write for main.ts/app/data/README/etc.; vendor copied byte-identical from the kit as required).

## Gate 0 — repo + deliverables + tests pass
- PASS. Repo public with README (template), LICENSE MIT (SPDX first line), `.makefun/owner.json`, `main.ts`, `serve.ts`, `vendor/makefun-frontend.ts` (unmodified, sha256 `4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240`), `app/` (5 entries, 65,871 bytes), `screenshots/` (4 JPEGs), `shots.json`. main.ts 2-run determinism verified (above). Data verified by script: 55 trophies, names/descriptions/grades byte-identical to the starter's official list, grades 1 platinum / 2 gold / 6 silver / 46 bronze, 9 missable, every guide ≥40 chars with sources, `trophies.json` 33,869 bytes (< 2 MiB).

## Gate 1 — multi-model review
- CODE (OpenRouter :free, `nvidia/nemotron-3-ultra-550b-a55b:free`, cost 0):
  Round 1 (truncated input, my error): flagged symlink handling in `walk()` — FIXED: `lstatSync` refusal of symlinks in `walk()` and `shotStats()`.
  Round 2 (full main.ts): FAIL with 4 points — (1) claimed `mkdirSync`+`cpSync` nests into `out/app/app/` — REFUTED by inspection: `find out/` shows `out/app/app.js` etc. directly (Node cpSync merges into an existing dir; the kit starter uses the identical pattern); (2) TOCTOU lstat/stat races — not a real risk for a single-user local build, no change; (3) cpSync dereference default — validation already rejects symlinks before copying, no change; (4) default sort vs localeCompare — sort order is deterministic on one machine and the dossier is content-addressed, no change. Verdict after review: PASS with the symlink fix applied; the nesting claim is wrong.
- COPY (Gemini `gemini-3.8-flash` — UNAVAILABLE): `gemini_api.py` timed out twice (urllib read timeout, ~180 s each; matches the known 18 Nov 503/high-demand state). Substitute: OpenRouter :free copy review (`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`, cost 0) on 3 sample guides (The Shootist, Hot Together, Actions Speak Louder): 2 PASS, 1 FAIL — Hot Together needed a concrete source for the roadmap claim + explicit "not yet verified" wording. FIXED: guides #33 and #34 now end with "That partner-availability warning is our inference from the description — not yet verified in-game." and cite it as a source; screenshot 4 re-taken showing the fixed text. (Gemma-4-26b :free also tried for the copy review — 429 upstream rate-limit; not retried.)
- No sensitive data was sent to any review model (only entry code and 3 public trophy guides).

## Gate 2 — dedup + quota
- Dedup: entry differs wholesale from the starter (MQ5) and from the house 4-strong "Platinum Road" brief only in the sense that it follows the same brief — new code, new data enrichment, new screenshots, new guides. No file copied from another entry. Quota: coordinator re-check (MQ3).

## Self-critique (§8) — iteration log
- v1 (first full build): screenshots good; review found (a) duplicate "PLATINUM / PLATINUM" tag on trophy #1 → fixed with category label map (platinum→goal, completion→100%); (b) `scrollIntoView` on load scrolled headless screenshots to a blank region → removed (root cause: the scroll moved the viewport past content under virtual-time screenshots); (c) my own edit accidentally deleted the `$` helper → caught by a blank render, fixed, and the lesson is recorded: never trust a silent edit, re-render after every change.
- v2 (after Gate 1): symlink hardening in main.ts; Hot Together / Retail Therapy honesty wording; shot 4 re-taken. Re-verified: data validation PASS, main.ts 2-run deterministic PASS, all 4 screenshots distinct and ≤256 KiB.
- Remaining known limits (honest): guide locations/triggers that cannot be confirmed from the official description are marked "not yet verified" rather than invented; the game is unreleased, so no guide can be play-verified. The 300 px check passes. Night theme is implemented but no screenshot shows it (4-shot budget spent on the four judge criteria views).

## Push
- First push (PAT contents API): 25 files; remote HEAD `01395959e459d2132d953619bc4bd8d1d020378d`. NOTE: the push script initially also pushed `out2/` (build output, 9 files) because its exclusion list missed `out2/` — all 9 deleted from the remote via contents DELETE (rc 0); local `out/` + `out2/` removed; push script fixed to exclude `out2/`.
- Gate-run push (this file + updated trophies.json, 4-spoiler.jpg, main.ts): HEAD to fill after run: _______________
- Fresh-clone check (remote tree == local, excluding out/): _______________

## Claim (one sentence, for the coordinator)
Platinum Road is a complete, cited, spoiler-safe 55-trophy guide and tracker whose screenshots show the checklist with real progress, cited guides, the platinum roadmap, and the spoiler-safe missable view — built to the top-50 prizelist standard, not a promise of placement.
