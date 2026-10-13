# Krillion Log
Plain HTML/JS frontend + Google Apps Script backend (free). Sheet is the source of truth; stats are computed in the browser from the Results tab.

## Setup
1. Create a Google Sheet with tabs: `Results` (date, player, score, depth, raw_input, submitted_at), `Players` (name, color, active). Add your friends to `Players` (active = TRUE).
2. Extensions > Apps Script; paste `apps-script/Code.gs`. Project Settings > Script Properties: add `PASSCODE` = your group passcode (never put it in client code).
3. Deploy > New deployment > Web app; Execute as: Me; Access: Anyone. Copy the URL (the passcode is what gates data).
4. Put the URL in `config.js`.
5. Run locally: `npm start` (any static server works). Deploy free: GitHub Pages / Netlify. Tests: `npm test` (Node 18+).

## Parser
Supports: `Krillion #N` header, score on its own line or as `Score: N` / `N pts`, depth as `400m`, and emoji-only lines as the 7-question breakdown. Failures are logged to the console and `raw_input` is always saved.
