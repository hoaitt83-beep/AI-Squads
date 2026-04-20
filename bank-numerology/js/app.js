/* Main application controller */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();

  const form = document.getElementById('analysis-form');
  const reportEl = document.getElementById('report');
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error-msg');

  form.addEventListener('submit', e => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const dob = document.getElementById('dob').value.trim();
    const account = document.getElementById('account').value.trim();

    if (!validateDOB(dob)) {
      errorEl.textContent = 'Vui lòng nhập ngày sinh đúng định dạng DD/MM/YYYY (ví dụ: 15/08/1990)';
      errorEl.style.display = 'block';
      return;
    }
    if (!account || account.replace(/\D/g, '').length < 6) {
      errorEl.textContent = 'Số tài khoản phải có ít nhất 6 chữ số';
      errorEl.style.display = 'block';
      return;
    }

    reportEl.style.display = 'none';
    loadingEl.style.display = 'block';
    loadingEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const result = analyzeAccount(dob, account);
      loadingEl.style.display = 'none';
      renderReport(result, dob, account);
      reportEl.style.display = 'block';
      reportEl.scrollIntoView({ behavior: 'smooth' });
    }, 1800);
  });
});

// ── Validation ────────────────────────────────────────────────
function validateDOB(dob) {
  const re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const m = dob.match(re);
  if (!m) return false;
  const [, d, mo, y] = m.map(Number);
  return d >= 1 && d <= 31 && mo >= 1 && mo <= 12 && y >= 1900 && y <= 2100;
}

// ── Render ─────────────────────────────────────────────────────
function renderReport(r, dob, account) {
  const fmt = account.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  const stars = '⭐'.repeat(Math.min(5, Math.floor(r.overallScore / 20)));
  const el = ELEMENT_INFO;

  document.getElementById('report').innerHTML = `

    <!-- BANNER -->
    <div class="report-banner">
      <div class="banner-subtitle">Thuyết Minh Phong Thủy Số Tài Khoản</div>
      <div class="account-num-display">${fmt}</div>
      <div class="stars-row">${stars}</div>
      <div class="score-row">
        <div class="score-item">
          <div class="score-circle"><span class="score-val">${r.overallScore}</span><span class="score-unit">/100</span></div>
          <div class="score-label">Tổng Vận</div>
        </div>
        <div class="score-item">
          <div class="score-circle"><span class="score-val">${r.relation.pct}</span><span class="score-unit">%</span></div>
          <div class="score-label">Hợp Mệnh</div>
        </div>
        <div class="score-item">
          <div class="score-circle"><span class="score-val">${r.accountNum}</span><span class="score-unit"></span></div>
          <div class="score-label">Số Vận</div>
        </div>
        <div class="score-item">
          <div class="score-circle"><span class="score-val">${r.foundSeqs.length}</span><span class="score-unit">chuỗi</span></div>
          <div class="score-label">Chuỗi May</div>
        </div>
      </div>
    </div>

    <!-- VERDICT (ĐẦU TIÊN) -->
    <div class="verdict-card">
      <div class="verdict-title">✦ Kết Luận Tổng Quan ✦</div>
      <div class="verdict-statement">
        Số tài khoản <em>${fmt}</em> là một <em>tài sản phong thủy</em> đặc biệt dành riêng cho bạn.
        Với số vận <em>${r.accountNum}</em> và độ tương hợp <em>${r.relation.pct}%</em> với bản mệnh,
        đây là con số mang lại <em>${renderVerdictKeywords(r)}</em> — người bạn đồng hành tài chính đáng tin cậy và bền lâu.
      </div>
      <div class="tcb-highlight verdict-tcb-narrative">
        <strong>✦ TƯƠNG QUAN BẢN MỆNH × TECHCOMBANK:</strong><br>
        ${renderTCBAccountNarrative(r, fmt)}
      </div>
      <div class="tag-row" style="justify-content:center">
        <span class="tag-pill">Tài Vận ${r.overallScore}/100</span>
        <span class="tag-pill">${r.relation.label}</span>
        <span class="tag-pill">Số Vận ${r.accountNum} — ${r.accountNumInfo?.meaning?.split(' ')[0] || 'Cát Tường'}</span>
        ${r.foundSeqs.length > 0 ? `<span class="tag-pill">${r.foundSeqs.length} Chuỗi Cát Tường</span>` : ''}
      </div>
    </div>

    <!-- TABS -->
    <div class="tab-wrapper">
      <nav class="tab-nav">
        <button class="tab-btn active" onclick="switchTab(this,'tab-numerology')">
          <span class="tab-icon">🔢</span> Thần Số Học
        </button>
        <button class="tab-btn" onclick="switchTab(this,'tab-fengshui')">
          <span class="tab-icon">☯️</span> Phong Thủy
        </button>
        <button class="tab-btn" onclick="switchTab(this,'tab-elements')">
          <span class="tab-icon">⚡</span> Ngũ Hành
        </button>
        <button class="tab-btn" onclick="switchTab(this,'tab-sequences')">
          <span class="tab-icon">🀄</span> Chuỗi Số
        </button>
        <button class="tab-btn" onclick="switchTab(this,'tab-iching')">
          <span class="tab-icon">📖</span> Kinh Dịch
        </button>
        <button class="tab-btn tab-tcb" onclick="switchTab(this,'tab-tcb')">
          <span class="tab-icon">🔥</span> T***bank
        </button>
      </nav>

      <div class="tab-panels">

        <!-- TAB 1: THẦN SỐ HỌC -->
        <div class="tab-panel active" id="tab-numerology">
          <div class="section-header">
            <span class="section-icon">🔢</span>
            <div>
              <div class="section-title">Thần Số Học</div>
              <div class="section-subtitle">Numerology — Giải Mã Năng Lượng Số</div>
            </div>
          </div>
          <div class="gold-divider"><span>✦</span></div>

          <div class="key-insight">
            Số đường đời của bạn là <em>${r.lifePath}</em> — <em>${r.lifePathInfo?.name || 'Số Vận Mệnh ' + r.lifePath}</em>.
            Số vận tài khoản là <em>${r.accountNum}</em> (<em>${r.accountNumInfo?.meaning || ''}</em>).
            Hai con số này ${renderCompatNote(r.lifePathSingle, r.accountNum)}.
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
            <div>
              <p style="font-size:0.8rem;color:var(--text-dim);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em">Số Đường Đời (Ngày Sinh)</p>
              <div class="result-chip">
                <div class="r-num">${r.lifePath}</div>
                <div class="r-info">
                  <div class="r-name">${r.lifePathInfo?.name || 'Số Vận Mệnh ' + r.lifePath}</div>
                  <div class="r-desc">${r.lifePathInfo?.element || ''}</div>
                </div>
              </div>
            </div>
            <div>
              <p style="font-size:0.8rem;color:var(--text-dim);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em">Số Vận Tài Khoản</p>
              <div class="result-chip">
                <div class="r-num">${r.accountNum}</div>
                <div class="r-info">
                  <div class="r-name">${r.accountNumInfo?.meaning || 'Số Vận ' + r.accountNum}</div>
                  <div class="r-desc">${r.accountNumInfo?.sound ? '"' + r.accountNumInfo.sound.toUpperCase() + '"' : ''}</div>
                </div>
              </div>
            </div>
          </div>

          <p style="font-size:0.8rem;color:var(--text-dim);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.06em">Phân tích từng chữ số</p>
          <div class="digit-row">
            ${r.digits.map(d => `
              <div class="digit-chip">
                <span class="d-num">${d}</span>
                <span class="d-label">${SINGLE_NUM_INFO[d]?.sound || ''}</span>
              </div>
            `).join('<div class="arrow-chip">·</div>')}
            <div class="arrow-chip">→</div>
            <div class="digit-chip" style="border-color:var(--gold-dim);background:rgba(201,162,39,0.08)">
              <span class="d-num" style="color:var(--gold-light)">${r.accountNum}</span>
              <span class="d-label">Số vận</span>
            </div>
          </div>

          <div class="highlight-box">
            <strong>✦ Ý nghĩa số vận ${r.accountNum} — "${(r.accountNumInfo?.sound || '').toUpperCase()}":</strong>
            ${r.accountNumInfo?.fengshui || ''}<br><br>
            <strong>${r.accountNumInfo?.meaning || ''}</strong> — đây là mã năng lượng chủ đạo định hình toàn bộ tài vận gắn liền với số tài khoản này.
          </div>

          <div class="analysis-text">
            <p>${r.lifePathInfo?.desc || ''}</p>
          </div>

          ${r.lifePathInfo?.keywords ? `<div class="tag-row">${r.lifePathInfo.keywords.map(k => `<span class="tag-pill">${k}</span>`).join('')}</div>` : ''}
        </div>

        <!-- TAB 2: PHONG THỦY -->
        <div class="tab-panel" id="tab-fengshui">
          <div class="section-header">
            <span class="section-icon">☯️</span>
            <div>
              <div class="section-title">Phong Thủy Học</div>
              <div class="section-subtitle">Feng Shui — Dòng Chảy Năng Lượng Tài Vận</div>
            </div>
          </div>
          <div class="gold-divider"><span>✦</span></div>

          <div class="key-insight">
            Số tài khoản <em>${fmt}</em> mang trong mình <em>${renderFengShuiOpen(r)}</em> — tạo thành trường khí cát tường bao quanh chủ nhân.
          </div>

          ${r.eightCount > 0 ? `
          <div class="gold-highlight">
            <strong>🎯 Phát Hiện Số 8 × ${r.eightCount} — "BÁT PHÁT":</strong><br>
            Số 8 trong tiếng Hán phát âm gần với chữ <strong>"Phát"</strong> (phát tài, phát lộc). Tài khoản chứa <strong>${r.eightCount} chữ số 8</strong> — mỗi lần giao dịch đều kích hoạt năng lượng phát tài, điềm báo cực kỳ cát tường.
          </div>` : ''}

          ${r.sixCount > 0 ? `
          <div class="highlight-box">
            <strong>🌟 Phát Hiện Số 6 × ${r.sixCount} — "LỘC TÀI":</strong><br>
            Số 6 đồng âm với <strong>"Lộc"</strong> — tài lộc, phú quý. Tài khoản mang <strong>${r.sixCount} chữ 6</strong> như dòng lộc chảy không ngừng nghỉ, sung túc miên trường.
          </div>` : ''}

          ${r.nineCount > 0 ? `
          <div class="highlight-box">
            <strong>♾️ Phát Hiện Số 9 × ${r.nineCount} — "CỬU TRÙNG":</strong><br>
            Số 9 tượng trưng cho <strong>sự trường tồn, vĩnh cửu</strong> — con số cao quý nhất Á Đông, biểu trưng cho thiên tử và vạn năm trường thịnh.
          </div>` : ''}

          <div class="analysis-text">
            <p>${renderDigitByDigitFengShui(r)}</p>
            <p>Theo lý thuyết phong thủy <strong>Lạc Thư — Hà Đồ</strong>, vị trí các chữ số trong chuỗi tài khoản tạo nên một <strong>ma trận năng lượng</strong> đặc biệt, thu hút dòng chảy tài vận từ bốn phương tám hướng về phía chủ nhân.</p>
          </div>
        </div>

        <!-- TAB 3: NGŨ HÀNH -->
        <div class="tab-panel" id="tab-elements">
          <div class="section-header">
            <span class="section-icon">⚡</span>
            <div>
              <div class="section-title">Ngũ Hành Tương Sinh</div>
              <div class="section-subtitle">Five Elements — Kim Mộc Thủy Hỏa Thổ</div>
            </div>
          </div>
          <div class="gold-divider"><span>✦</span></div>

          <div class="key-insight">
            Bản mệnh <em>${el[r.birthElement].name} ${el[r.birthElement].emoji}</em> và số tài khoản hành <em>${el[r.dominantAccountElement].name} ${el[r.dominantAccountElement].emoji}</em>
            — quan hệ <em>${r.relation.label}</em>, độ tương hợp <em>${r.relation.pct}%</em>.
          </div>

          <div class="elements-display">
            ${['kim','moc','thuy','hoa','tho'].map(e => `
              <div class="elem-badge elem-${e} ${e === r.birthElement ? 'active' : ''}">
                <span class="e-icon">${el[e].emoji}</span>
                <span class="e-name">${el[e].name}</span>
                <span class="e-nums">${el[e].nums}</span>
                ${e === r.birthElement ? '<span style="font-size:0.7rem;margin-top:4px">● Bản Mệnh</span>' : ''}
              </div>
            `).join('')}
          </div>

          <div class="analysis-text" style="margin-top:20px">
            <p>Bạn sinh năm <strong>${r.birthYear}</strong>, bản mệnh thuộc hành <strong>${el[r.birthElement].name} (${el[r.birthElement].emoji})</strong> — ${el[r.birthElement].desc}</p>
            <p>Số tài khoản có trường khí chủ đạo hành <strong>${el[r.dominantAccountElement].name}</strong>, tạo nên mối quan hệ <strong>${r.relation.label}</strong> với bản mệnh bạn.</p>
          </div>

          <div class="compat-bar-wrap" style="margin:20px 0">
            <div class="compat-label">
              <span>Độ Tương Hợp Ngũ Hành</span>
              <span>${r.relation.pct}%</span>
            </div>
            <div class="compat-bar">
              <div class="compat-fill" data-pct="${r.relation.pct}" style="width:0%"></div>
            </div>
          </div>

          <div class="gold-highlight">
            <strong>✦ ${r.relation.label}:</strong><br>${r.relation.desc}
          </div>

          <div class="analysis-text">
            <p>${renderElementNarrative(r)}</p>
          </div>
        </div>

        <!-- TAB 4: CHUỖI SỐ -->
        <div class="tab-panel" id="tab-sequences">
          <div class="section-header">
            <span class="section-icon">🀄</span>
            <div>
              <div class="section-title">Chuỗi Số Cát Tường</div>
              <div class="section-subtitle">Lucky Sequences — Tổ Hợp Số Phong Thủy</div>
            </div>
          </div>
          <div class="gold-divider"><span>✦</span></div>

          ${r.foundSeqs.length > 0 ? `
          <div class="key-insight">
            Tìm thấy <em>${r.foundSeqs.length} chuỗi số cát tường</em> trong tài khoản của bạn!
            Mỗi chuỗi là một <em>"lớp phúc"</em> chồng lên nhau, tạo sức mạnh tổng hợp vượt bậc.
          </div>` : `
          <div class="key-insight">
            Mỗi tổ hợp số đều mang ý nghĩa phong thủy riêng. Dưới đây là bảng tra cứu các <em>chuỗi số cát tường</em> phổ biến nhất trong văn hóa Á Đông.
          </div>`}

          <div class="sequences-grid">
            ${renderSequences(r)}
          </div>
        </div>

        <!-- TAB 5: KINH DỊCH -->
        <div class="tab-panel" id="tab-iching">
          <div class="section-header">
            <span class="section-icon">📖</span>
            <div>
              <div class="section-title">Kinh Dịch Luận Số</div>
              <div class="section-subtitle">I Ching — 64 Quẻ & Tài Vận</div>
            </div>
          </div>
          <div class="gold-divider"><span>✦</span></div>

          <div class="key-insight">
            Chiếu theo pháp số Kinh Dịch, tài khoản của bạn ứng với quẻ <em>${r.hexagram.name}</em> —
            <em>${r.hexagram.meaning}</em>.
          </div>

          <div class="hexagram-display">
            <div class="hex-lines">
              ${r.hexagram.lines.map(solid => `<div class="hex-line ${solid ? '' : 'broken'}"></div>`).join('')}
            </div>
            <div class="hex-name">${r.hexagram.name}</div>
            <div class="hex-meaning">${r.hexagram.meaning}</div>
          </div>

          <div class="analysis-text">
            <p>Trong hệ thống <strong>64 quẻ Kinh Dịch</strong>, mỗi quẻ là một trạng thái năng lượng của vũ trụ. Quẻ <strong>${r.hexagram.name}</strong> xuất hiện như điềm lành: người gắn bó lâu dài với số tài khoản này sẽ nhận được sự phù trợ của <strong>thiên thời, địa lợi và nhân hòa</strong> trong mọi quyết định tài chính.</p>
            <p>Kinh Dịch dạy rằng sự <strong>kiên trì và bền bỉ</strong> mới là chìa khóa để hiện thực hóa tiềm năng của quẻ số — giữ vững số tài khoản là giữ vững nguồn năng lượng tích lũy theo thời gian.</p>
          </div>
        </div>

        <!-- TAB 6: TECHCOMBANK -->
        <div class="tab-panel" id="tab-tcb">
          <div class="section-header">
            <span class="section-icon">🔥</span>
            <div>
              <div class="section-title" style="color:var(--tcb-red-light)">Phong Thủy T***bank</div>
              <div class="section-subtitle">Hỏa · Thổ · Kim — Tam Trụ Ngân Hàng</div>
            </div>
          </div>
          <div class="gold-divider"><span>✦</span></div>

          <div class="key-insight">
            T***bank mang <em style="color:var(--tcb-red-light)">mệnh Hỏa</em> — ngọn lửa của khát vọng bứt phá và tăng trưởng.
            Bản mệnh <em>${ELEMENT_INFO[r.birthElement].name} ${ELEMENT_INFO[r.birthElement].emoji}</em> của bạn
            kết hợp với Hỏa T***bank theo quan hệ <em style="color:var(--tcb-red-light)">${r.tcbRelation.title.split('—')[0].trim()}</em>.
          </div>

          <!-- Tri-pillars -->
          <p style="font-size:0.8rem;color:var(--text-dim);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.06em">Ba Trụ Cột Phong Thủy T***bank</p>
          <div class="tcb-pillars">
            ${TCB_PILLARS.map(p => `
              <div class="tcb-pillar tcb-pillar-${p.key}">
                <div class="p-icon">${p.icon}</div>
                <div class="p-name">${p.name}</div>
                <div class="p-sub">${p.sub}</div>
                <div class="p-desc">${p.desc}</div>
              </div>
            `).join('')}
          </div>

          <!-- TCB × Customer relation -->
          <p style="font-size:0.8rem;color:var(--text-dim);margin:20px 0 12px;text-transform:uppercase;letter-spacing:0.06em">Tương Quan Bản Mệnh × T***bank</p>
          <div class="tcb-relation-card">
            <div class="tcb-relation-title">${r.tcbRelation.title}</div>
            <div class="tcb-relation-score">🔥 Chỉ số tương hợp: ${r.tcbRelation.score}/100</div>
            <div class="compat-bar-wrap" style="margin-bottom:16px">
              <div class="compat-bar">
                <div class="compat-fill compat-fill-tcb" data-pct="${r.tcbRelation.score}" style="width:0%"></div>
              </div>
            </div>
            <div class="tcb-relation-desc">${r.tcbRelation.desc}</div>
            <div class="tcb-relation-advice">💡 ${r.tcbRelation.advice}</div>
          </div>

          <div class="analysis-text">
            <p>Ba trụ cột <strong style="color:var(--hoa-color)">Hỏa — Thổ — Kim</strong> của T***bank không chỉ là triết lý kinh doanh mà còn là bộ khung phong thủy bảo vệ và phát triển tài sản cho từng khách hàng. Mỗi giao dịch qua tài khoản này là một lần năng lượng ba hành được kích hoạt đồng thời.</p>
            <p>Số tài khoản <strong>${fmt}</strong> được trao bởi T***bank không phải ngẫu nhiên — đây là con số mang trong mình dấu ấn của Hỏa năng lượng, Thổ ổn định và Kim tin cậy, trở thành người bạn đồng hành tài chính vừa có lửa bứt phá vừa có nền vững chắc.</p>
          </div>
        </div>

      </div><!-- end tab-panels -->
    </div><!-- end tab-wrapper -->

    <!-- ACTION ROW -->
    <div class="action-row">
      <button class="btn-print" onclick="window.print()">🖨️ In / Lưu PDF</button>
      <button class="btn-secondary" onclick="document.getElementById('report').style.display='none';window.scrollTo({top:0,behavior:'smooth'})">← Phân Tích Số Khác</button>
    </div>
  `;

  setTimeout(() => {
    document.querySelectorAll('.compat-fill').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }, 400);
}

// ── Tab switching ──────────────────────────────────────────────
function switchTab(btn, panelId) {
  btn.closest('.tab-wrapper').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.closest('.tab-wrapper').querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');

  if (panelId === 'tab-elements' || panelId === 'tab-tcb') {
    setTimeout(() => {
      document.querySelectorAll('.compat-fill').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    }, 100);
  }
}

// ── Render helpers ─────────────────────────────────────────────
function renderCompatNote(lp, an) {
  const pairs = {
    '1-8': 'tạo nên sức mạnh kép giữa ý chí tiên phong và tài lộc vô biên',
    '2-6': 'hợp thành một cặp hài hòa hoàn hảo giữa sự nhạy cảm và phú quý',
    '3-9': 'cộng hưởng sức sáng tạo với sự viên mãn, tạo ra thành công dài lâu',
    '6-8': 'là một trong những tổ hợp tài vận mạnh nhất — lộc gặp phát, phú quý song toàn',
    '8-8': 'nhân đôi năng lượng phát tài, bội phần thịnh vượng',
    '9-9': 'trường thịnh vĩnh cửu, viên mãn không có điểm kết',
  };
  const key1 = `${Math.min(lp, an)}-${Math.max(lp, an)}`;
  return pairs[key1] || `tạo nên một tổ hợp năng lượng độc đáo, hỗ trợ lẫn nhau để tạo ra sự cân bằng và phát triển bền vững trong cuộc sống tài chính`;
}

function renderFengShuiOpen(r) {
  const count8 = r.eightCount, count6 = r.sixCount, count9 = r.nineCount;
  const parts = [];
  if (count8 > 0) parts.push(`${count8} chữ số 8 (Bát Phát Đại Cát)`);
  if (count6 > 0) parts.push(`${count6} chữ số 6 (Lộc Tài)`);
  if (count9 > 0) parts.push(`${count9} chữ số 9 (Trường Tồn)`);
  if (parts.length === 0) {
    return `một chuỗi năng lượng cân bằng, hài hòa với thiên nhiên và vũ trụ, thu hút dòng chảy tài lộc theo cách tinh tế và bền vững`;
  }
  return `${parts.join(', ')} — những biểu tượng phong thủy cực kỳ may mắn`;
}

function renderDigitByDigitFengShui(r) {
  const phrases = r.digits.slice(0, 6).map((d, i) => {
    const info = SINGLE_NUM_INFO[d];
    return `Chữ số ${d} ở vị trí ${i + 1} (${info?.meaning || ''}) mang năng lượng ${info?.fengshui || 'cân bằng'}`;
  });
  return phrases.join('. ') + '. Toàn bộ chuỗi số hợp thành một trường khí cát tường, phù hợp với người muốn xây dựng nền tảng tài chính vững bền.';
}

function renderElementNarrative(r) {
  const el = ELEMENT_INFO;
  const birth = el[r.birthElement];
  const acc = el[r.dominantAccountElement];
  const msgs = {
    generate: `Hành ${acc.name} của tài khoản sinh dưỡng hành ${birth.name} của bạn. Tương tự như ${acc.name === 'Thủy' ? 'nước tưới cho cây xanh' : acc.name === 'Mộc' ? 'gỗ nuôi lửa' : acc.name === 'Hỏa' ? 'lửa nung đất' : acc.name === 'Thổ' ? 'đất sinh kim' : 'kim tụ thủy'}, số tài khoản này liên tục bổ sung năng lượng tích cực cho bản mệnh bạn.`,
    generated: `Bản mệnh ${birth.name} của bạn đang "nuôi dưỡng" hành ${acc.name} của tài khoản. Điều này tượng trưng cho việc bạn đang đầu tư vào một công cụ tài chính sẽ sinh sôi và tạo ra tài lộc phong phú theo thời gian.`,
    same: `Bản mệnh và tài khoản cùng hành ${birth.name} — đây là sự cộng hưởng tần số hoàn hảo. Khi hai năng lượng cùng tần số gặp nhau, sức mạnh tăng lên theo cấp số nhân, không chỉ cộng mà còn nhân.`,
    control: `Hành ${acc.name} điều tiết hành ${birth.name} một cách hài hòa — không phải áp đặt mà là định hướng. Giống như người thầy thuốc giỏi, sự điều tiết này giúp năng lượng của bạn lưu thông đúng hướng, tránh lãng phí tài nguyên.`,
    controlled: `Bản mệnh ${birth.name} của bạn chủ động điều phối hành ${acc.name} của tài khoản, cho thấy bạn là người nắm quyền kiểm soát tài chính của mình. Đây là dấu hiệu của một chủ nhân tài giỏi, biết sử dụng công cụ một cách thông minh.`,
  };
  return msgs[r.relation.type] || msgs.same;
}

function renderSequences(r) {
  const allSeqs = LUCKY_SEQUENCES.slice(0, 12);
  const foundSet = new Set(r.foundSeqs.map(s => s.seq));

  return allSeqs.map(s => {
    const isFound = foundSet.has(s.seq);
    return `
      <div class="seq-card ${isFound ? 'found' : ''}">
        <div class="seq-num">${s.seq}</div>
        <div class="seq-name">${s.name}</div>
        <div class="seq-mean">${s.meaning}</div>
        ${isFound ? '<span class="seq-badge">✓ Có trong tài khoản</span>' : ''}
      </div>
    `;
  }).join('');
}

function renderTCBAccountNarrative(r, fmt) {
  const el = ELEMENT_INFO[r.birthElement];
  const tcbMap = {
    hoa:  `Hỏa gặp Hỏa — tài khoản ${fmt} của bạn tại T***bank như hai ngọn lửa hội tụ, bùng cháy mạnh mẽ và trường tồn. Năng lượng Hỏa từ ngân hàng cộng với Hỏa bản mệnh tạo nên sức nóng đủ để "nung chảy" mọi rào cản tài chính.`,
    moc:  `Mộc bản mệnh của bạn là nguồn nhiên liệu quý giúp ngọn lửa T***bank cháy sáng hơn. Đổi lại, Hỏa T***bank sẽ tiếp tục sưởi ấm và thúc đẩy Mộc của bạn sinh trưởng — vòng tương sinh này tạo ra tài vận ngày càng lớn mạnh theo năm tháng.`,
    tho:  `Hỏa T***bank sinh dưỡng trực tiếp vào Thổ bản mệnh bạn — mỗi đồng tiết kiệm, mỗi khoản đầu tư qua tài khoản này đều được "nung nóng" bởi năng lượng Hỏa, giúp Thổ của bạn thêm màu mỡ và tích lũy bền vững.`,
    kim:  `Lửa T***bank tôi luyện Kim bản mệnh bạn ngày một tinh thuần hơn. Tài khoản ${fmt} là chiếc lò rèn quý — mỗi năm gắn bó, Kim của bạn được lọc bỏ tạp chất và trở nên sắc bén, có giá trị cao hơn trong mọi giao dịch tài chính.`,
    thuy: `Thủy bản mệnh gặp Hỏa T***bank — như khi nước biển gặp ánh mặt trời, sinh ra hơi nước vận hành cả vũ trụ. Tài khoản ${fmt} là nơi hai nguồn năng lượng đối cực giao thoa, tạo ra sức mạnh tiềm tàng vượt trội hơn bất kỳ mệnh đơn lẻ nào.`,
  };
  return tcbMap[r.birthElement] || tcbMap.hoa;
}

function renderVerdictKeywords(r) {
  const keywords = [];
  if (r.eightCount > 0) keywords.push('tài lộc phát sinh');
  if (r.sixCount > 0) keywords.push('phú quý trường thịnh');
  if (r.nineCount > 0) keywords.push('viên mãn trường cửu');
  if (r.foundSeqs.length > 0) keywords.push(`${r.foundSeqs.length} chuỗi may mắn`);
  keywords.push(r.relation.label.toLowerCase());
  return keywords.join(', ');
}

// ── Particles ─────────────────────────────────────────────────
function initParticles() {
  const container = document.getElementById('particles-bg');
  if (!container) return;
  const symbols = ['✦', '◆', '☯', '卍', '∞', '◈', '❋'];
  const colors = ['#c9a227', '#00875a', '#4a90e8', '#c83c1e'];

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 8 + Math.random() * 16;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${12 + Math.random() * 20}s;
      animation-delay:${Math.random() * 15}s;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    container.appendChild(p);
  }
}
