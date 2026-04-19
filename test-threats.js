// Unit tests — cờ caro threat detection
// Run: node test-threats.js

'use strict';

// ─────────────────────────────────────────────
//  Code under test (mirrored from index.html)
// ─────────────────────────────────────────────
const SIZE = 15;
const WIN  = 5;

const WARN_PATTERNS = [
  [0, 1, 1, 1, 0],        // P1:  01110
  [0, 1, 1, 0, 1, 0],     // P2:  011010
  [0, 1, 0, 1, 1, 0],     // P3:  010110  (mirror of P2)
  [0, 1, 1, 1, 1],        // P4:  01111
  [1, 1, 1, 1, 0],        // P4r: 11110   (mirror of P4)
  [0, 1, 0, 1, 1, 1],     // P5:  010111
  [1, 1, 1, 0, 1, 0],     // P5r: 111010  (mirror of P5)
];

let grid = [];

function findThreats(player) {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  const found = new Set();
  for (const [dr, dc] of dirs) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        for (const pat of WARN_PATTERNS) {
          const pieces = [];
          let ok = true;
          for (let k = 0; k < pat.length; k++) {
            const nr = r + dr * k, nc = c + dc * k;
            if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) { ok = false; break; }
            const val = grid[nr][nc];
            if (pat[k] === 1) {
              if (val !== player) { ok = false; break; }
              pieces.push(`${nr},${nc}`);
            } else {
              if (val !== 0) { ok = false; break; }
            }
          }
          if (ok) pieces.forEach(k => found.add(k));
        }
      }
    }
  }
  return found;
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function newGrid() {
  grid = Array.from({ length: SIZE }, () => new Array(SIZE).fill(0));
}
function place(cells, player) { cells.forEach(([r, c]) => { grid[r][c] = player; }); }
function hasAll(set, cells)   { return cells.every(([r, c]) =>  set.has(`${r},${c}`)); }
function hasNone(set, cells)  { return cells.every(([r, c]) => !set.has(`${r},${c}`)); }

// ─────────────────────────────────────────────
//  Mini runner
// ─────────────────────────────────────────────
let pass = 0, fail = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    pass++;
  } catch (e) {
    console.log(`  ✗  ${name}`);
    console.log(`       → ${e.message}`);
    fail++;
  }
}

function expect(cond, msg) { if (!cond) throw new Error(msg); }
function expectEmpty(set)  { expect(set.size === 0, `expected empty, got [${[...set]}]`); }
function expectCells(set, cells) { expect(hasAll(set, cells), `missing cells: ${cells.filter(([r,c]) => !set.has(`${r},${c}`)).map(([r,c]) => `(${r},${c})`).join(', ')}`); }

// ═════════════════════════════════════════════
//  PATTERN 1 — 01110
// ═════════════════════════════════════════════
console.log('\n── Pattern 1 : 01110 ───────────────────────');

test('horizontal — 3 liên tiếp, 2 đầu trống', () => {
  newGrid(); place([[5,1],[5,2],[5,3]], 1);
  expectCells(findThreats(1), [[5,1],[5,2],[5,3]]);
});

test('vertical — 3 liên tiếp, 2 đầu trống', () => {
  newGrid(); place([[1,5],[2,5],[3,5]], 1);
  expectCells(findThreats(1), [[1,5],[2,5],[3,5]]);
});

test('diagonal ↘ — 3 liên tiếp, 2 đầu trống', () => {
  newGrid(); place([[2,2],[3,3],[4,4]], 1);
  expectCells(findThreats(1), [[2,2],[3,3],[4,4]]);
});

test('diagonal ↙ — 3 liên tiếp, 2 đầu trống', () => {
  newGrid(); place([[2,6],[3,5],[4,4]], 1);
  expectCells(findThreats(1), [[2,6],[3,5],[4,4]]);
});

test('không trigger khi đầu trái bị đối thủ chặn', () => {
  newGrid(); place([[5,1],[5,2],[5,3]], 1); grid[5][0] = 2;
  expectEmpty(findThreats(1));
});

test('không trigger khi đầu phải bị đối thủ chặn', () => {
  newGrid(); place([[5,1],[5,2],[5,3]], 1); grid[5][4] = 2;
  expectEmpty(findThreats(1));
});

test('không trigger khi cả 2 đầu bị chặn', () => {
  newGrid(); place([[5,1],[5,2],[5,3]], 1); grid[5][0] = 2; grid[5][4] = 2;
  expectEmpty(findThreats(1));
});

test('không trigger cho chỉ 2 quân liên tiếp', () => {
  newGrid(); place([[5,1],[5,2]], 1);
  expectEmpty(findThreats(1));
});

// ═════════════════════════════════════════════
//  PATTERN 2 — 011010
// ═════════════════════════════════════════════
console.log('\n── Pattern 2 : 011010 ──────────────────────');

test('horizontal — 011010 cơ bản', () => {
  newGrid(); place([[5,1],[5,2],[5,4]], 1);
  // (5,0) (5,3) (5,5) trống
  expectCells(findThreats(1), [[5,1],[5,2],[5,4]]);
});

test('vertical — 011010', () => {
  newGrid(); place([[1,5],[2,5],[4,5]], 1);
  expectCells(findThreats(1), [[1,5],[2,5],[4,5]]);
});

test('diagonal ↘ — 011010', () => {
  newGrid(); place([[1,1],[2,2],[4,4]], 1);
  expectCells(findThreats(1), [[1,1],[2,2],[4,4]]);
});

test('không trigger khi gap bị đối thủ lấp', () => {
  newGrid(); place([[5,1],[5,2],[5,4]], 1); grid[5][3] = 2;
  expectEmpty(findThreats(1));
});

test('không trigger khi đầu ngoài cùng bị chặn', () => {
  newGrid(); place([[5,1],[5,2],[5,4]], 1); grid[5][0] = 2; grid[5][5] = 2;
  expectEmpty(findThreats(1));
});

// ═════════════════════════════════════════════
//  PATTERN 3 — 010110  (mirror của P2)
// ═════════════════════════════════════════════
console.log('\n── Pattern 3 : 010110 ──────────────────────');

test('horizontal — 010110 cơ bản', () => {
  newGrid(); place([[5,1],[5,3],[5,4]], 1);
  // (5,0) (5,2) (5,5) trống
  expectCells(findThreats(1), [[5,1],[5,3],[5,4]]);
});

test('vertical — 010110', () => {
  newGrid(); place([[1,5],[3,5],[4,5]], 1);
  expectCells(findThreats(1), [[1,5],[3,5],[4,5]]);
});

test('diagonal ↙ — 010110', () => {
  newGrid(); place([[1,8],[3,6],[4,5]], 1);
  expectCells(findThreats(1), [[1,8],[3,6],[4,5]]);
});

test('không trigger khi gap bị đối thủ lấp', () => {
  newGrid(); place([[5,1],[5,3],[5,4]], 1); grid[5][2] = 2;
  expectEmpty(findThreats(1));
});

// ═════════════════════════════════════════════
//  PATTERN 4 — 01111 và mirror 11110
// ═════════════════════════════════════════════
console.log('\n── Pattern 4 : 01111 / 11110 ───────────────');

test('01111 horizontal — 4 quân, đầu trái mở', () => {
  newGrid(); place([[5,1],[5,2],[5,3],[5,4]], 1);
  expectCells(findThreats(1), [[5,1],[5,2],[5,3],[5,4]]);
});

test('11110 horizontal — 4 quân, đầu phải mở', () => {
  newGrid(); place([[5,0],[5,1],[5,2],[5,3]], 1);
  // (5,4) trống → 11110
  expectCells(findThreats(1), [[5,0],[5,1],[5,2],[5,3]]);
});

test('01111 vertical — 4 quân, đầu trên mở', () => {
  newGrid(); place([[1,5],[2,5],[3,5],[4,5]], 1);
  expectCells(findThreats(1), [[1,5],[2,5],[3,5],[4,5]]);
});

test('11110 diagonal ↘ — bắt đầu từ góc', () => {
  newGrid(); place([[0,0],[1,1],[2,2],[3,3]], 1);
  // (4,4) trống → 11110
  expectCells(findThreats(1), [[0,0],[1,1],[2,2],[3,3]]);
});

test('4 quân cả 2 đầu bị chặn: không trigger', () => {
  newGrid(); place([[5,1],[5,2],[5,3],[5,4]], 1);
  grid[5][0] = 2; grid[5][5] = 2;
  expectEmpty(findThreats(1));
});

test('01111 gần mép phải (open end ở col 10)', () => {
  newGrid(); place([[7,11],[7,12],[7,13],[7,14]], 1);
  // col 10 trống → 01111 khớp; col 15 OOB nên 11110 không khớp
  expectCells(findThreats(1), [[7,11],[7,12],[7,13],[7,14]]);
});

test('mép board không tính là ô trống (3 quân ở col 0-2)', () => {
  newGrid(); place([[7,0],[7,1],[7,2]], 1);
  // 01110 cần col -1 = trống → ngoài bàn → không khớp
  // 11110 cần 4 quân → chỉ có 3 → không khớp
  expectEmpty(findThreats(1));
});

// ═════════════════════════════════════════════
//  PATTERN 5 — 010111 và mirror 111010
// ═════════════════════════════════════════════
console.log('\n── Pattern 5 : 010111 / 111010 ─────────────');

test('010111 horizontal cơ bản', () => {
  newGrid(); place([[5,1],[5,3],[5,4],[5,5]], 1);
  // (5,0) (5,2) trống
  expectCells(findThreats(1), [[5,1],[5,3],[5,4],[5,5]]);
});

test('111010 horizontal cơ bản', () => {
  newGrid(); place([[5,0],[5,1],[5,2],[5,4]], 1);
  // (5,3) (5,5) trống
  expectCells(findThreats(1), [[5,0],[5,1],[5,2],[5,4]]);
});

test('010111 vertical', () => {
  newGrid(); place([[1,5],[3,5],[4,5],[5,5]], 1);
  expectCells(findThreats(1), [[1,5],[3,5],[4,5],[5,5]]);
});

test('111010 diagonal ↙', () => {
  newGrid(); place([[2,10],[3,9],[4,8],[6,6]], 1);
  // 111010 theo ↙ từ (2,10): pieces tại (2,10)(3,9)(4,8), gap (5,7)=0, piece (6,6), (7,5)=0
  expectCells(findThreats(1), [[2,10],[3,9],[4,8],[6,6]]);
});

test('010111: không trigger khi gap bị đối thủ lấp', () => {
  newGrid(); place([[5,1],[5,3],[5,4],[5,5]], 1); grid[5][2] = 2;
  expectEmpty(findThreats(1));
});

test('111010: không trigger khi gap bị đối thủ lấp', () => {
  newGrid(); place([[5,0],[5,1],[5,2],[5,4]], 1); grid[5][3] = 2;
  expectEmpty(findThreats(1));
});

// ═════════════════════════════════════════════
//  Cô lập người chơi
// ═════════════════════════════════════════════
console.log('\n── Cô lập người chơi ───────────────────────');

test('01110 của P1 không xuất hiện khi tìm threat của P2', () => {
  newGrid(); place([[5,1],[5,2],[5,3]], 1);
  expectEmpty(findThreats(2));
});

test('01111 của P2 phát hiện chính xác', () => {
  newGrid(); place([[5,1],[5,2],[5,3],[5,4]], 2);
  expectCells(findThreats(2), [[5,1],[5,2],[5,3],[5,4]]);
  expectEmpty(findThreats(1));
});

test('P1 và P2 cùng có threat riêng biệt trên cùng bàn', () => {
  newGrid();
  place([[5,1],[5,2],[5,3]], 1);   // P1: 01110 ở row 5
  place([[8,1],[8,2],[8,3]], 2);   // P2: 01110 ở row 8
  const t1 = findThreats(1);
  const t2 = findThreats(2);
  expectCells(t1, [[5,1],[5,2],[5,3]]);
  expect(hasNone(t1, [[8,1],[8,2],[8,3]]), 'P1 threats leaked into P2 cells');
  expectCells(t2, [[8,1],[8,2],[8,3]]);
  expect(hasNone(t2, [[5,1],[5,2],[5,3]]), 'P2 threats leaked into P1 cells');
});

// ═════════════════════════════════════════════
//  Nhiều pattern cùng lúc
// ═════════════════════════════════════════════
console.log('\n── Nhiều pattern cùng lúc ──────────────────');

test('01110 + 01111 trên cùng bàn: cả 2 đều được phát hiện', () => {
  newGrid();
  place([[3,1],[3,2],[3,3]], 1);          // 01110 ở row 3
  place([[7,1],[7,2],[7,3],[7,4]], 1);    // 01111 ở row 7
  const t = findThreats(1);
  expectCells(t, [[3,1],[3,2],[3,3]]);
  expectCells(t, [[7,1],[7,2],[7,3],[7,4]]);
});

test('011010 và 010110 giao nhau trên cùng bàn', () => {
  newGrid();
  place([[5,1],[5,2],[5,4]], 1);   // 011010
  place([[6,1],[6,3],[6,4]], 1);   // 010110
  const t = findThreats(1);
  expectCells(t, [[5,1],[5,2],[5,4]]);
  expectCells(t, [[6,1],[6,3],[6,4]]);
});

// ═════════════════════════════════════════════
//  Summary
// ═════════════════════════════════════════════
const total = pass + fail;
console.log(`\n─────────────────────────────────────────────`);
console.log(`  Kết quả: ${pass}/${total} passed${fail > 0 ? `, ${fail} FAILED` : ' ✓'}`);
if (fail > 0) process.exit(1);
