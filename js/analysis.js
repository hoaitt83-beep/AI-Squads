/**
 * Core analysis engine — Numerology, Feng Shui & Five Elements
 */

// ── Numerology ────────────────────────────────────────────────
const LIFE_PATH_INFO = {
  1: { name: 'Số 1 — Lãnh Đạo & Tiên Phong', element: 'Dương Hỏa', keywords: ['Tiên phong', 'Tự lập', 'Ý chí mạnh mẽ', 'Sáng tạo'], desc: 'Bạn là người sinh ra để dẫn dắt. Năng lượng số 1 mang trong mình sức mạnh của sự khởi đầu, ý chí không khuất phục và khả năng biến tầm nhìn thành hiện thực.' },
  2: { name: 'Số 2 — Hòa Hợp & Cân Bằng', element: 'Âm Thổ', keywords: ['Ngoại giao', 'Nhạy cảm', 'Hợp tác', 'Kiên nhẫn'], desc: 'Bạn là cầu nối giữa các thế giới, mang lại sự hòa giải và thấu cảm. Trực giác nhạy bén giúp bạn nhìn thấu mọi cơ hội tiềm ẩn.' },
  3: { name: 'Số 3 — Sáng Tạo & Thịnh Vượng', element: 'Dương Mộc', keywords: ['Biểu đạt', 'Lạc quan', 'Sáng tạo', 'Thịnh vượng'], desc: 'Năng lượng số 3 tràn đầy sức sống và niềm vui. Tài năng biểu đạt và tư duy sáng tạo mang lại cho bạn sức hút đặc biệt trong kinh doanh và giao tiếp.' },
  4: { name: 'Số 4 — Nền Tảng & Bền Vững', element: 'Âm Kim', keywords: ['Kiên định', 'Thực tế', 'Tin cậy', 'Bền vững'], desc: 'Số 4 là trụ cột vững chắc, nền móng của mọi thành công bền lâu. Bạn xây dựng tài sản từng bước, chắc chắn như kim cương.' },
  5: { name: 'Số 5 — Tự Do & Biến Chuyển', element: 'Dương Thổ', keywords: ['Linh hoạt', 'Phiêu lưu', 'Đổi mới', 'Năng động'], desc: 'Năng lượng số 5 là làn gió mới, mang theo những cơ hội bất ngờ và sự đổi mới không ngừng. Bạn thích nghi nhanh và nắm bắt thời cơ xuất sắc.' },
  6: { name: 'Số 6 — Lộc Tài & Nuôi Dưỡng', element: 'Âm Hỏa', keywords: ['Trách nhiệm', 'Yêu thương', 'Phú quý', 'Hài hòa'], desc: 'Số 6 mang năng lượng của sự sung túc, gia đình hòa thuận và tài lộc. Đây là con số của sự thịnh vượng và phúc lành bền vững.' },
  7: { name: 'Số 7 — Trí Tuệ & Huyền Bí', element: 'Dương Kim', keywords: ['Sâu sắc', 'Phân tích', 'Tâm linh', 'Trực giác'], desc: 'Số 7 là con số của những người tư duy sâu sắc. Trực giác mạnh mẽ và khả năng phân tích giúp bạn nhìn xa trông rộng trong mọi quyết định tài chính.' },
  8: { name: 'Số 8 — Phát Tài & Quyền Lực', element: 'Âm Thủy', keywords: ['Thịnh vượng', 'Quyền lực', 'Thành công', 'Phát đạt'], desc: 'Số 8 là biểu tượng của vô cực tài lộc trong văn hóa phương Đông. Năng lượng số 8 thu hút sự giàu có, địa vị và thành công vượt bậc.' },
  9: { name: 'Số 9 — Viên Mãn & Trường Tồn', element: 'Dương Thủy', keywords: ['Viên mãn', 'Nhân ái', 'Trí tuệ', 'Di sản'], desc: 'Số 9 là đỉnh cao của chu kỳ, mang theo sự viên mãn và tích lũy của một hành trình dài. Đây là con số của những người để lại dấu ấn lâu bền.' },
  11: { name: 'Số 11 — Số Chủ Nhân Ái', element: 'Siêu Linh', keywords: ['Trực giác', 'Truyền cảm hứng', 'Thấu thị', 'Thiêng liêng'], desc: 'Số 11 là con số bậc thầy, mang nguồn năng lượng tâm linh cao nhất. Bạn có khả năng truyền cảm hứng và tạo ra sự chuyển hóa tích cực trong cộng đồng.' },
  22: { name: 'Số 22 — Kiến Trúc Sư Vũ Trụ', element: 'Siêu Vật Chất', keywords: ['Tầm nhìn', 'Thực hiện', 'Di sản', 'Xây dựng'], desc: 'Số 22 là con số bậc thầy cao nhất — kiến trúc sư của những thứ vĩ đại. Năng lực xây dựng và thực thi những dự án tầm cỡ là đặc quyền của số này.' },
};

const SINGLE_NUM_INFO = {
  0: { sound: 'linh', meaning: 'Hư không sinh vạn vật', fengshui: 'Nguồn gốc của mọi tiềm năng, vô tận như vũ trụ', luck: 95 },
  1: { sound: 'nhất', meaning: 'Nhất thống sơn hà', fengshui: 'Đứng đầu, độc tôn, khởi đầu thuận lợi', luck: 90 },
  2: { sound: 'nhị', meaning: 'Song hỷ lâm môn', fengshui: 'Đôi lứa hòa hợp, phúc đến cùng đôi', luck: 85 },
  3: { sound: 'tam', meaning: 'Tam đa: phúc lộc thọ', fengshui: 'Ba điều cát lành hội tụ, sinh sôi phát triển', luck: 92 },
  4: { sound: 'tứ', meaning: 'Tứ trụ vững bền', fengshui: 'Bốn phương quy phục, nền tảng như bàn thạch', luck: 80 },
  5: { sound: 'ngũ', meaning: 'Ngũ hành viên mãn', fengshui: 'Ngũ hành đầy đủ, cân bằng hoàn hảo', luck: 88 },
  6: { sound: 'lục', meaning: 'Lộc phát vạn đại', fengshui: 'Tài lộc tuôn chảy, phú quý miên trường', luck: 93 },
  7: { sound: 'thất', meaning: 'Thất bảo trân quý', fengshui: 'Bảy báu vật thiên đình, trí tuệ uyên thâm', luck: 87 },
  8: { sound: 'bát', meaning: 'Bát phúc đại cát', fengshui: 'Phát tài phát lộc, con số may mắn nhất phương Đông', luck: 98 },
  9: { sound: 'cửu', meaning: 'Cửu trùng thiên tử', fengshui: 'Trường tồn vĩnh cửu, cao cả như thiên đình', luck: 95 },
};

// ── Five Elements (Ngũ Hành) ──────────────────────────────────
// Nạp Âm: hệ chuẩn người Việt dùng để xác định bản mệnh ngũ hành.
// 30 cặp năm trong chu kỳ 60 năm Can Chi, gốc 1984 = Giáp Tý (vị trí 0).
const NAP_AM = [
  { el:'kim',  name:'Hải Trung Kim' },    // 0: Giáp Tý / Ất Sửu
  { el:'hoa',  name:'Lô Trung Hỏa' },    // 1: Bính Dần / Đinh Mão
  { el:'moc',  name:'Đại Lâm Mộc' },     // 2: Mậu Thìn / Kỷ Tỵ
  { el:'tho',  name:'Lộ Bàng Thổ' },     // 3: Canh Ngọ / Tân Mùi
  { el:'kim',  name:'Kiếm Phong Kim' },   // 4: Nhâm Thân / Quý Dậu
  { el:'hoa',  name:'Sơn Đầu Hỏa' },     // 5: Giáp Tuất / Ất Hợi
  { el:'thuy', name:'Giản Hạ Thủy' },    // 6: Bính Tý / Đinh Sửu
  { el:'hoa',  name:'Thành Đầu Hỏa' },   // 7: Mậu Dần / Kỷ Mão
  { el:'kim',  name:'Bạch Lạp Kim' },    // 8: Canh Thìn / Tân Tỵ
  { el:'moc',  name:'Dương Liễu Mộc' },  // 9: Nhâm Ngọ / Quý Mùi
  { el:'thuy', name:'Tuyền Trung Thủy' },//10: Giáp Thân / Ất Dậu
  { el:'tho',  name:'Ốc Thượng Thổ' },   //11: Bính Tuất / Đinh Hợi
  { el:'hoa',  name:'Tích Lịch Hỏa' },   //12: Mậu Tý / Kỷ Sửu
  { el:'moc',  name:'Tùng Bách Mộc' },   //13: Canh Dần / Tân Mão
  { el:'thuy', name:'Trường Lưu Thủy' }, //14: Nhâm Thìn / Quý Tỵ
  { el:'kim',  name:'Sa Trung Kim' },     //15: Giáp Ngọ / Ất Mùi
  { el:'hoa',  name:'Sơn Hạ Hỏa' },     //16: Bính Thân / Đinh Dậu
  { el:'moc',  name:'Bình Địa Mộc' },    //17: Mậu Tuất / Kỷ Hợi
  { el:'tho',  name:'Bích Thượng Thổ' }, //18: Canh Tý / Tân Sửu
  { el:'kim',  name:'Kim Bạch Kim' },     //19: Nhâm Dần / Quý Mão
  { el:'hoa',  name:'Phú Đăng Hỏa' },    //20: Giáp Thìn / Ất Tỵ
  { el:'thuy', name:'Thiên Hà Thủy' },   //21: Bính Ngọ / Đinh Mùi
  { el:'tho',  name:'Đại Dịch Thổ' },    //22: Mậu Thân / Kỷ Dậu
  { el:'kim',  name:'Thoa Xuyến Kim' },   //23: Canh Tuất / Tân Hợi
  { el:'moc',  name:'Tang Đố Mộc' },     //24: Nhâm Tý / Quý Sửu
  { el:'thuy', name:'Đại Khê Thủy' },    //25: Giáp Dần / Ất Mão
  { el:'tho',  name:'Sa Trung Thổ' },    //26: Bính Thìn / Đinh Tỵ
  { el:'hoa',  name:'Thiên Thượng Hỏa' },//27: Mậu Ngọ / Kỷ Mùi
  { el:'moc',  name:'Thạch Lựu Mộc' },   //28: Canh Thân / Tân Dậu
  { el:'thuy', name:'Đại Hải Thủy' },    //29: Nhâm Tuất / Quý Hợi
];

function getNapAm(year) {
  const pos = ((year - 1984) % 60 + 60) % 60;
  return NAP_AM[Math.floor(pos / 2)];
}

const ELEMENT_BY_DIGIT = {
  1: 'thuy', 6: 'thuy',
  2: 'hoa',  7: 'hoa',
  3: 'moc',  8: 'moc',
  4: 'kim',  9: 'kim',
  0: 'tho',  5: 'tho',
};

const ELEMENT_INFO = {
  kim: { name: 'Kim', emoji: '⚙️', color: '#b0b0b0', nums: '0, 4, 9', desc: 'Sắc bén, vững chắc như kim loại quý. Kim chủ về tài lộc, nghị lực và sự bền bỉ.', generates: 'thuy', controls: 'moc' },
  moc: { name: 'Mộc', emoji: '🌿', color: '#00cc88', nums: '3, 8', desc: 'Sinh sôi nảy nở như cây xanh. Mộc chủ về tăng trưởng, sức sống và sự phát triển bền vững.', generates: 'hoa', controls: 'tho' },
  thuy: { name: 'Thủy', emoji: '💧', color: '#4a90e8', nums: '1, 6', desc: 'Linh hoạt như dòng nước, thu nạp tài lộc từ bốn phương. Thủy chủ về trí tuệ và sự lưu thông tài chính.', generates: 'moc', controls: 'hoa' },
  hoa: { name: 'Hỏa', emoji: '🔥', color: '#e85a3a', nums: '2, 7', desc: 'Nhiệt huyết và ánh sáng xua tan tăm tối. Hỏa chủ về danh tiếng, nhiệt tình và sự bứt phá.', generates: 'tho', controls: 'kim' },
  tho: { name: 'Thổ', emoji: '⛰️', color: '#c8a050', nums: '0, 5', desc: 'Dày dặn như đất mẹ, dung nạp và tích lũy. Thổ chủ về sự ổn định, tích lũy tài sản và uy tín.', generates: 'kim', controls: 'thuy' },
};

const ELEMENT_RELATION = {
  same: { label: 'Đồng Hành', pct: 85, desc: 'Số tài khoản cùng hành với bản mệnh tạo nên sự cộng hưởng mạnh mẽ — năng lượng nhân đôi, tài lộc tăng gấp bội.' },
  generate: { label: 'Tương Sinh', pct: 96, desc: 'Hành của tài khoản sinh dưỡng bản mệnh — như nguồn nước nuôi dưỡng vạn vật, mang lại sự thịnh vượng trường tồn.' },
  generated: { label: 'Được Dưỡng', pct: 90, desc: 'Bản mệnh sinh dưỡng hành của tài khoản — bạn đang "đầu tư" vào công cụ giúp tài lộc sinh trưởng không ngừng.' },
  control: { label: 'Tương Chế Hóa Lành', pct: 78, desc: 'Hành của tài khoản kiểm soát bản mệnh một cách lành mạnh — như bàn tay thầy thuốc điều tiết, giúp năng lượng lưu thông đúng hướng.' },
  controlled: { label: 'Chủ Động Dẫn Dắt', pct: 82, desc: 'Bản mệnh chủ động định hướng năng lượng tài khoản — bạn là người cầm lái, tài vận nằm trong tay bạn điều phối.' },
};

// ── Lucky sequences ───────────────────────────────────────────
const LUCKY_SEQUENCES = [
  { seq: '168', name: 'Nhất Lộc Bát', meaning: 'Một đường phát tài, lộc đến bất tận', tier: 'platinum' },
  { seq: '888', name: 'Tam Bát Đại Phát', meaning: 'Phát phát phát — tam hợp tài lộc', tier: 'platinum' },
  { seq: '999', name: 'Cửu Cửu Trường Tồn', meaning: 'Trường tồn vĩnh cửu, phúc thọ vô biên', tier: 'gold' },
  { seq: '618', name: 'Lộc Nhất Phát', meaning: 'Tài lộc khởi đầu, nhất nhất phát sinh', tier: 'gold' },
  { seq: '86', name: 'Bát Lộc', meaning: 'Phát tài có lộc, song hỷ lâm môn', tier: 'silver' },
  { seq: '68', name: 'Lộc Phát', meaning: 'Lộc trước phát sau, tài vận thăng tiến', tier: 'silver' },
  { seq: '88', name: 'Song Bát Phát', meaning: 'Gấp đôi may mắn, phát tài song song', tier: 'gold' },
  { seq: '66', name: 'Song Lộc', meaning: 'Tài lộc kép, phú quý hội tụ', tier: 'silver' },
  { seq: '99', name: 'Song Cửu', meaning: 'Trường thịnh, phúc lâu bền', tier: 'silver' },
  { seq: '18', name: 'Nhất Phát', meaning: 'Số một phát tài, khởi đầu tốt đẹp', tier: 'silver' },
  { seq: '189', name: 'Nhất Phát Cửu', meaning: 'Phát tài trường cửu, tài lộc không ngừng', tier: 'gold' },
  { seq: '369', name: 'Tam Lục Cửu', meaning: 'Tam đa hội tụ, lộc phúc trường thọ', tier: 'silver' },
  { seq: '528', name: 'Ngũ Song Phát', meaning: 'Ngũ hành cân bằng, song hỷ phát tài', tier: 'silver' },
  { seq: '168', name: 'Nhất Lộc Phát', meaning: 'Con đường nhất phát tài lộc', tier: 'platinum' },
  { seq: '8888', name: 'Tứ Bát Đại Cát', meaning: 'Tứ phương tài lộc, đại cát đại lợi', tier: 'platinum' },
  { seq: '138', name: 'Nhất Tam Phát', meaning: 'Nhất sinh tam, tam sinh vạn vật, phát tài', tier: 'gold' },
];

// ── I Ching hexagrams (simplified) ───────────────────────────
const HEXAGRAMS = [
  { name: '䷀ Kiền - Thuần Càn', lines: [true,true,true,true,true,true], meaning: 'Sức mạnh thiên thượng, tự lực cánh sinh, thời vận hưng thịnh tột đỉnh' },
  { name: '䷆ Sư - Địa Thủy', lines: [false,true,false,false,false,false], meaning: 'Trí tướng soái, lãnh đạo kỷ luật dẫn đến thắng lợi bền vững' },
  { name: '䷉ Lý - Thiên Trạch', lines: [true,false,true,true,true,true], meaning: 'Bước đi khéo léo, tiến thoái đúng lúc, hanh thông mọi nẻo' },
  { name: '䷙ Đại Súc - Sơn Thiên', lines: [true,false,false,true,true,true], meaning: 'Tích lũy lớn lao, nuôi dưỡng đức tài, thời cơ sẽ đến' },
  { name: '䷡ Đại Tráng - Lôi Thiên', lines: [true,true,false,false,true,true], meaning: 'Dũng mãnh như sấm, thế lực đang ở đỉnh cao thịnh vượng' },
  { name: '䷊ Thái - Địa Thiên', lines: [false,false,false,true,true,true], meaning: 'Thiên địa giao hòa, vạn vật thông suốt, đại cát đại lợi' },
  { name: '䷿ Ký Tế - Thủy Hỏa', lines: [true,false,true,false,true,false], meaning: 'Thành công viên mãn, mọi việc đã hoàn tất theo đúng trật tự' },
  { name: '䷃ Mông - Sơn Thủy', lines: [false,true,false,false,false,true], meaning: 'Khai minh học hỏi, nền tảng tri thức tạo nên vận mệnh vĩ đại' },
];

// ── T***bank Feng Shui ─────────────────────────────────────
const TCB_ELEMENT = 'hoa'; // T***bank mệnh Hỏa

const TCB_PILLARS = [
  {
    key: 'hoa', icon: '🔥', name: 'Hỏa', sub: 'Năng lượng & Bứt phá',
    desc: 'Sức bùng cháy của khát vọng, nhiệt huyết dẫn đường tới đỉnh cao tài chính.'
  },
  {
    key: 'tho', icon: '⛰️', name: 'Thổ', sub: 'Vững vàng & Tích lũy',
    desc: 'Nền tảng vững chắc, tích lũy bền bỉ — tài sản lớn lên từng ngày trên đất vững.'
  },
  {
    key: 'kim', icon: '💎', name: 'Kim', sub: 'Minh bạch & Tin cậy',
    desc: 'Chuẩn mực như kim cương, minh bạch như gương — uy tín là tài sản quý nhất.'
  },
];

const TCB_RELATION = {
  hoa: {
    title: 'Đồng Hành Hỏa × Hỏa — Nhiệt Huyết Song Trùng',
    score: 96,
    desc: 'Bạn và T***bank cùng mang mệnh Hỏa — hai luồng năng lượng cùng tần số gặp nhau, cộng hưởng và bùng cháy mạnh mẽ. Mỗi giao dịch là một lần nhiệt huyết được nhân đôi, tài lộc phát sinh theo cấp số nhân.',
    advice: 'Đây là sự gắn kết thiên định — bạn và T***bank sinh ra để đồng hành, cùng nhau chinh phục mọi đỉnh cao tài chính mà bạn hướng tới.',
  },
  moc: {
    title: 'Mộc Sinh Hỏa — Bạn Là Nguồn Cội Tăng Trưởng',
    score: 98,
    desc: 'Mộc là nhiên liệu thiết yếu của Hỏa — bản mệnh Mộc của bạn liên tục bổ sung năng lượng, nuôi dưỡng và làm bùng sáng ngọn lửa T***bank. Mối quan hệ tương sinh này tạo ra vòng tăng trưởng không ngừng: bạn cung cấp sức sống, ngân hàng trả lại bằng tài lộc.',
    advice: 'Mộc-Hỏa là cặp tương sinh mạnh nhất trong ngũ hành — người mệnh Mộc gắn bó với T***bank đang nắm giữ chìa khóa vàng của sự thịnh vượng bền vững.',
  },
  tho: {
    title: 'Hỏa Sinh Thổ — T***bank Vun Đắp Nền Tảng Của Bạn',
    score: 94,
    desc: 'Hỏa của T***bank sinh dưỡng Thổ bản mệnh bạn — như lửa nung đất sét thành gốm quý, như lò nhiệt luyện thành đất phì nhiêu. Mỗi năm gắn bó, năng lượng Hỏa từ T***bank liên tục bồi đắp bản mệnh Thổ của bạn thêm vững chắc, sung túc và giàu có.',
    advice: 'Người mệnh Thổ gắn với T***bank là đang hưởng Hỏa sinh Thổ — nền tảng tài chính ngày càng dày dặn, tích lũy bền vững theo đúng triết lý Thổ của ngũ hành.',
  },
  kim: {
    title: 'Hỏa Luyện Kim — Tôi Luyện Để Trở Nên Quý Giá',
    score: 88,
    desc: 'Hỏa tôi luyện Kim thành vật báu — đây không phải mâu thuẫn mà là quá trình hoàn thiện cao nhất. T***bank với năng lượng Hỏa bứt phá, minh bạch và chuẩn mực sẽ giúp bản mệnh Kim của bạn được "nung luyện", trở nên sắc bén, tinh thuần và có giá trị hơn theo từng giao dịch.',
    advice: 'Vàng thật không sợ lửa — người mệnh Kim gắn với T***bank đang bước qua lò nung luyện để trở thành kim cương không thể phá vỡ, tài sản bền vững không thể bào mòn.',
  },
  thuy: {
    title: 'Hỏa Thủy Tương Giao — Hơi Nước: Sức Mạnh Vô Hình',
    score: 90,
    desc: 'Khi Hỏa gặp Thủy, không phải triệt tiêu mà sinh ra hơi nước — nguồn năng lượng vĩ đại từng thay đổi lịch sử nhân loại. Bản mệnh Thủy linh hoạt và trí tuệ của bạn kết hợp với Hỏa nhiệt huyết của T***bank tạo ra sức mạnh vô hình nhưng bền bỉ, luôn chuyển động và không ngừng sinh sôi.',
    advice: 'Hơi nước (Thủy-Hỏa kết hợp) từng vận hành cả cuộc cách mạng công nghiệp — đây là dấu hiệu của một tài vận có chiều sâu, sức chuyển hóa lớn lao và tầm nhìn vượt thời đại.',
  },
};

function getTCBRelation(birthElement) {
  return TCB_RELATION[birthElement] || TCB_RELATION.hoa;
}

// ── Main analysis function ────────────────────────────────────
function analyzeAccount(dob, accountNumber) {
  const digits = accountNumber.replace(/\D/g, '').split('').map(Number);
  const dobParts = dob.split('/');
  const birthYear = parseInt(dobParts[2]);
  const birthDay = parseInt(dobParts[0]);
  const birthMonth = parseInt(dobParts[1]);

  // Life path number
  const dobDigits = dob.replace(/\D/g, '').split('').map(Number);
  let lifePathSum = dobDigits.reduce((a, b) => a + b, 0);
  let lifePath = reduceToMaster(lifePathSum);

  // Account destiny number
  let accountSum = digits.reduce((a, b) => a + b, 0);
  let accountNum = reduceToSingle(accountSum);

  // Five elements — dùng Nạp Âm (hệ chuẩn xác định bản mệnh người Việt)
  const napAm = getNapAm(birthYear);
  const birthElement = napAm.el;
  const birthNapAm = napAm.name;
  const accountElementCounts = {};
  digits.forEach(d => {
    const el = ELEMENT_BY_DIGIT[d];
    accountElementCounts[el] = (accountElementCounts[el] || 0) + 1;
  });
  const dominantAccountElement = Object.entries(accountElementCounts)
    .sort((a, b) => b[1] - a[1])[0][0];

  // Element relation
  const relation = getElementRelation(birthElement, dominantAccountElement);

  // Lucky sequences found
  const accountStr = accountNumber.replace(/\D/g, '');
  const foundSeqs = LUCKY_SEQUENCES.filter(s => accountStr.includes(s.seq));

  // I Ching hexagram (deterministic from account number)
  const hexIdx = (digits.reduce((a, b) => a + b, 0)) % HEXAGRAMS.length;
  const hexagram = HEXAGRAMS[hexIdx];

  // Numerology compatibility score
  const lifePathSingle = lifePath > 9 ? reduceToSingle(lifePath) : lifePath;
  const numCompat = calcNumerologyCompat(lifePathSingle, accountNum);

  // Overall luck score
  const seqBonus = Math.min(foundSeqs.length * 6, 24);
  const eightCount = digits.filter(d => d === 8).length;
  const sixCount = digits.filter(d => d === 6).length;
  const nineCount = digits.filter(d => d === 9).length;
  const luckyDigitBonus = eightCount * 4 + sixCount * 3 + nineCount * 3;
  const baseLuck = SINGLE_NUM_INFO[accountNum]?.luck || 85;
  const overallScore = Math.min(99, Math.round((baseLuck + seqBonus + luckyDigitBonus * 0.5 + relation.pct * 0.1) / 1.12));

  const tcbRelation = getTCBRelation(birthElement);

  return {
    digits, accountStr, birthYear, birthDay, birthMonth,
    lifePath, lifePathSingle, lifePathInfo: LIFE_PATH_INFO[lifePath] || LIFE_PATH_INFO[lifePathSingle],
    accountNum, accountNumInfo: SINGLE_NUM_INFO[accountNum],
    birthElement, birthNapAm, dominantAccountElement, accountElementCounts,
    relation, foundSeqs, hexagram,
    numCompat, overallScore,
    eightCount, sixCount, nineCount,
    tcbRelation,
  };
}

function reduceToSingle(n) {
  while (n > 9) {
    n = String(n).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
}

function reduceToMaster(n) {
  while (n > 9 && n !== 11 && n !== 22) {
    n = String(n).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
}

function getElementRelation(birthEl, accountEl) {
  const ei = ELEMENT_INFO;
  if (birthEl === accountEl) return { ...ELEMENT_RELATION.same, type: 'same' };
  if (ei[birthEl].generates === accountEl) return { ...ELEMENT_RELATION.generated, type: 'generated' };
  if (ei[accountEl].generates === birthEl) return { ...ELEMENT_RELATION.generate, type: 'generate' };
  if (ei[birthEl].controls === accountEl) return { ...ELEMENT_RELATION.controlled, type: 'controlled' };
  if (ei[accountEl].controls === birthEl) return { ...ELEMENT_RELATION.control, type: 'control' };
  return { ...ELEMENT_RELATION.same, type: 'same' };
}

function calcNumerologyCompat(lp, an) {
  const compatible = [[1,1],[1,5],[1,7],[2,4],[2,6],[2,8],[3,3],[3,6],[3,9],[4,8],[5,7],[6,6],[6,9],[7,9],[8,8],[9,9]];
  const pair = [Math.min(lp,an), Math.max(lp,an)];
  const isCompat = compatible.some(p => p[0] === pair[0] && p[1] === pair[1]);
  const base = isCompat ? 88 : 75;
  return Math.min(99, base + Math.floor(Math.random() * 0)); // deterministic
}
