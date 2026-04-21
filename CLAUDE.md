# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A standalone Vietnamese Gomoku (5-in-a-row) game called **Cờ Caro Vui Vẻ**. The entire application is a single `index.html` file with embedded CSS and JavaScript — no build step, no package manager, no external dependencies beyond a Google Fonts CDN link.

## Running & Testing

**Play the game:** Open `index.html` directly in any browser, or serve it:
```bash
python3 -m http.server 8080
```

**Run the threat-detection unit tests:**
```bash
node test-threats.js
```
All 35 tests should pass with a summary printed to stdout. There is no test framework — the test runner is hand-rolled inside `test-threats.js` itself.

## Architecture

### File layout
- `index.html` — complete application (HTML + CSS + JS, ~760 lines)
- `test-threats.js` — standalone Node.js unit tests for threat detection

### Core game state (`index.html` lines 345–352)
```
SIZE = 15       15×15 board
WIN  = 5        pieces in a row to win
grid[][]        board state: 0=empty, 1=P1, 2=P2
turn            current player (1 or 2)
over            game-over flag
scores[2]       cumulative scores across games
history[]       move stack for undo
```

### Threat detection system
This is the most complex logic in the codebase. `findThreats(player)` scans all 4 directions (horizontal, vertical, two diagonals) against `WARN_PATTERNS` — a list of 7 pattern arrays where `0` = empty and `1` = opponent's piece. A matching window marks its empty cells with the `.threat-cell` CSS class (orange glow). The patterns and their expected behaviour are validated exhaustively in `test-threats.js`.

Modifying `WARN_PATTERNS` or `findThreats` **requires re-running `node test-threats.js`** to verify correctness. The 7 patterns currently cover:
- Open three (`01110`)
- Gapped threes (`011010`, `010110`)
- Open fours (`01111`, `11110`)
- Gapped fours (`010111`, `111010`)

### Sharing logic between game and tests
`test-threats.js` duplicates the `findThreats` implementation because it runs in Node (no DOM). When changing `findThreats` in `index.html`, apply the same change to the copy in `test-threats.js`.

### Responsive sizing
Cell size is computed at runtime by `cellSize()` and applied as a CSS variable, avoiding media queries. Touch input is handled separately from mouse via `onCellTouch()` with `preventDefault()` to suppress ghost clicks on mobile.

### Audio
Sound uses the Web Audio API (`playTone`, `playWin`). All audio calls are wrapped in try/catch so the game degrades silently if the API is unavailable.

## Key Conventions

- **No build step.** Do not introduce a bundler or package.json unless explicitly asked.
- **No external JS libraries.** Keep the game dependency-free (Google Fonts CDN for typography is acceptable).
- **Test after every change to threat logic.** Run `node test-threats.js` and confirm all 35 tests pass.
- **Keep state mutations inside `play()` and `undoMove()`.** These are the only two functions that modify `grid`, `turn`, `scores`, and `history`.
