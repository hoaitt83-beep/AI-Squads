# CLAUDE.md — AI-Squads / Bank Numerology App

## Project Overview

Single-page static web app giải mã phong thủy số tài khoản ngân hàng cho khách hàng T***bank. App nhận đầu vào là ngày sinh + số tài khoản, xuất ra báo cáo tổng hợp gồm Thần Số Học, Phong Thủy, Ngũ Hành, Kinh Dịch, Chuỗi Số Cát Tường, và phân tích đặc thù T***bank.

**Không có build system, không có framework.** Toàn bộ là HTML/CSS/JS thuần, chạy trực tiếp trên browser.

---

## File Structure

```
/
├── index.html          # Entry point — form UI, DOM scaffold, script tags
├── css/
│   └── style.css       # Design system, responsive layout, animations
└── js/
    ├── version.js      # Single source of truth cho app version
    ├── analysis.js     # Engine phân tích — data + thuật toán (no DOM)
    └── app.js          # Controller — render HTML, DOM events, particles
```

### Phân tách trách nhiệm

| File | Quy tắc |
|---|---|
| `analysis.js` | Không được access DOM. Chỉ export hàm và data. |
| `app.js` | Chỉ render và handle events. Không chứa logic tính toán. |
| `index.html` | Inline JS chỉ được dùng cho input formatting và version badge. |

---

## Development Workflow

### Khi sửa code

Mỗi lần sửa xong **bắt buộc phải tăng version** trước khi commit:

1. Sửa `APP_VERSION` trong `js/version.js`
2. Cập nhật `?v=X.Y.Z` ở **3 chỗ** trong `index.html` (style.css, analysis.js, app.js)
3. Commit tất cả file thay đổi cùng lúc

```javascript
// js/version.js
const APP_VERSION = '1.3.1'; // ← sửa ở đây
```

```html
<!-- index.html — 3 chỗ phải khớp nhau -->
<link rel="stylesheet" href="css/style.css?v=1.3.1">
<script src="js/analysis.js?v=1.3.1"></script>
<script src="js/app.js?v=1.3.1"></script>
```

### Versioning Convention

`MAJOR.MINOR.PATCH`

- **PATCH** (+0.0.1): Sửa lỗi nhỏ, chỉnh wording
- **MINOR** (+0.1.0): Tính năng mới, cải tiến UI
- **MAJOR** (+1.0.0): Thay đổi lớn về cấu trúc hoặc tính năng

### Git

**Branch hiện tại:** `claude/bank-numerlogy-techcombank-uat`

**Commit message format:**
```
<prefix>: <mô tả ngắn> (vX.Y.Z)
```

Prefix chuẩn: `feat:`, `fix:`, `refactor:`, `ui:`, `copy:`

**Push command:**
```bash
git push -u origin claude/bank-numerlogy-techcombank-uat
```

---

## Core Logic — analysis.js

### Hệ thống Bản Mệnh (Nạp Âm)

**Bắt buộc dùng Nạp Âm**, KHÔNG dùng Thiên Can (số cuối năm). Đây là hệ chuẩn người Việt dùng khi nói "bản mệnh ngũ hành".

```javascript
// ĐÚNG — dùng bảng NAP_AM 30 cặp
function getNapAm(year) {
  const pos = ((year - 1984) % 60 + 60) % 60;
  return NAP_AM[Math.floor(pos / 2)]; // { el: 'hoa', name: 'Thiên Thượng Hỏa' }
}

// SAI — KHÔNG làm thế này
const birthElement = { 8: 'tho', 9: 'tho' }[year % 10]; // ← sai hệ thống
```

Ví dụ kiểm tra: 1978 = Mậu Ngọ = Thiên Thượng Hỏa = **Hỏa** (không phải Thổ).

### Hàm phân tích chính

```javascript
analyzeAccount(dob, accountNumber)
// → { digits, birthYear, lifePath, lifePathInfo, accountNum, accountNumInfo,
//     birthElement, birthNapAm, dominantAccountElement, accountElementCounts,
//     relation, foundSeqs, hexagram, numCompat, overallScore,
//     eightCount, sixCount, nineCount, tcbRelation }
```

### Tương quan Ngũ Hành

5 loại quan hệ giữa bản mệnh và hành tài khoản:

| type | Ý nghĩa | Score |
|---|---|---|
| `same` | Đồng hành | 85% |
| `generate` | Tài khoản sinh bản mệnh (tốt nhất) | 96% |
| `generated` | Bản mệnh sinh tài khoản | 90% |
| `control` | Tài khoản kiểm soát bản mệnh | 78% |
| `controlled` | Bản mệnh kiểm soát tài khoản | 82% |

Chu kỳ sinh: Kim→Thủy→Mộc→Hỏa→Thổ→Kim  
Chu kỳ khắc: Kim→Mộc→Thổ→Thủy→Hỏa→Kim

### T***bank Feng Shui

T***bank cố định là mệnh **Hỏa** (`TCB_ELEMENT = 'hoa'`). Mọi narrative trong `TCB_RELATION` phải từ góc nhìn tích cực. 5 kịch bản: Hỏa×Hỏa, Mộc sinh Hỏa, Hỏa sinh Thổ, Hỏa luyện Kim, Hỏa×Thủy.

### Lucky Sequences

16 chuỗi số, **không được có trùng seq**. Kiểm tra khi thêm mới:
```javascript
// Tất cả seq.seq phải unique
const seqs = LUCKY_SEQUENCES.map(s => s.seq);
console.assert(new Set(seqs).size === seqs.length, 'Có seq trùng!');
```

### Hexagram Pool

Hiện có 16 quẻ Kinh Dịch. Chỉ số quẻ: `(sum of account digits) % HEXAGRAMS.length`.

---

## UI Conventions — app.js & CSS

### Report Structure (thứ tự cố định)

1. `.report-banner` — điểm số tổng quan
2. `.verdict-card` — Kết luận + TCB narrative
3. `.section-card` — Thần Số Học
4. `.section-card` — Phong Thủy Học
5. `.section-card` — Ngũ Hành Tương Sinh
6. `.section-card` — Chuỗi Số Cát Tường
7. `.section-card` — Kinh Dịch Luận Số
8. `.section-card section-card-tcb` — Phong Thủy T***bank

### CSS Variables chính

```css
--gold: #c9a227          /* Accent vàng chính */
--gold-light: #f0d060    /* Highlight vàng sáng */
--dark-bg: #0c0a0a       /* Nền trang */
--dark-card: #180e0e     /* Nền card */
--text: #f0e0b0          /* Văn bản chính */
--tcb-red: #CC0000       /* Màu T***bank */
```

### Responsive Breakpoint

`@media (max-width: 600px)`: form grid 1 cột, section-card padding thu nhỏ, `.two-col-grid` → 1 cột.

### Brand Masking

Mọi chuỗi hiển thị trên UI **bắt buộc dùng** `T***bank` / `T***` thay vì tên thật. Tên biến/class/comment trong code không bị ảnh hưởng.

---

## Known Issues & Constraints

- `numCompat` được tính trong `analyzeAccount()` nhưng **chưa hiển thị** trong report — trường này là dead code hiện tại.
- Validation DOB chỉ kiểm tra range (1–31 ngày, 1–12 tháng) — không validate ngày không tồn tại (ví dụ 30/02).
- Safari cache HTML: đã thêm `<meta http-equiv="Cache-Control">` nhưng chỉ là best-effort — server cần gửi HTTP header `Cache-Control: no-cache` cho `index.html` để đảm bảo.
- `HEXAGRAMS` hiện có 16/64 quẻ.

---

## Testing

Không có test framework. Chạy kiểm tra logic bằng Node.js:

```bash
# Syntax check
node --check js/analysis.js
node --check js/app.js

# Functional test
node -e "
$(cat js/analysis.js)
const r = analyzeAccount('15/08/1990', '1234567890');
console.log(r.birthElement, r.birthNapAm, r.overallScore);
"

# Kiểm tra Nạp Âm
node -e "
$(cat js/analysis.js)
// 1978 phải là hoa / Thiên Thượng Hỏa
const r = getNapAm(1978);
console.assert(r.el === 'hoa' && r.name === 'Thiên Thượng Hỏa', 'FAIL');
console.log('OK:', r);
"
```
