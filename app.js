const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const html = document.documentElement;
const langBtn = $('#lang-btn'), themeBtn = $('#theme-btn');
const sLang = localStorage.getItem('cs-lang') || 'en';
const sTheme = localStorage.getItem('cs-theme') || 'dark';
html.setAttribute('data-lang', sLang); html.setAttribute('data-theme', sTheme);
langBtn.textContent = sLang === 'en' ? 'EN' : '中';
langBtn.addEventListener('click', () => { const n = html.getAttribute('data-lang') === 'en' ? 'zh' : 'en'; html.setAttribute('data-lang', n); localStorage.setItem('cs-lang', n); langBtn.textContent = n === 'en' ? 'EN' : '中'; });
themeBtn.addEventListener('click', () => { const n = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; html.setAttribute('data-theme', n); localStorage.setItem('cs-theme', n); });

// hero — fractured grid
$('#chaos-viz').innerHTML = `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="cb"><feGaussianBlur stdDeviation="1.4"/></filter></defs>
  ${(() => { let out = ''; const cells = 14; const sz = 500/cells; for (let r = 0; r < cells; r++) { for (let c = 0; c < cells; c++) { const dx = c - cells/2, dy = r - cells/2; const dist = Math.sqrt(dx*dx + dy*dy); const t = dist / cells; const offset = (Math.random() - 0.5) * 8 * t; out += `<rect x="${c*sz + offset}" y="${r*sz + offset}" width="${sz - 1}" height="${sz - 1}" fill="${t < 0.4 ? 'var(--chaos)' : t < 0.65 ? 'var(--collapse)' : 'var(--blackout)'}" opacity="${0.85 - t*0.5}"/>`; } } return out; })()}
  <text x="250" y="265" text-anchor="middle" font-family="Big Shoulders Display" font-size="32" font-weight="700" fill="rgba(255,255,255,0.95)" letter-spacing="2">CHAOS</text>
</svg>`;

// scenarios
const scenarios = [
  { id: 'internet', en_n: 'Internet Shutdown', zh_n: '互联网关闭', en_p: 'connectivity lost regionally or globally for at least 90 days. The supply chain breaks before the social fabric does.', zh_p: '在区域或全球范围内连通性丧失至少 90 天。供应链先于社交结构断裂。' },
  { id: 'ai', en_n: 'AI Takeover', zh_n: 'AI 接管', en_p: 'autonomous systems begin making decisions previously made by people. Not science-fiction sentience — boring delegation.', zh_p: '自主系统开始做之前由人做的决定。不是科幻有情；是无聊的委派。' },
  { id: 'blackout', en_n: 'Global Blackout', zh_n: '全球停电', en_p: 'electrical grid fails for an extended period. The first three days look biblical; the next nine months look administrative.', zh_p: '电网长期失效。前三天像《圣经》；接下来九个月像行政事务。' },
  { id: 'money', en_n: 'Currency Collapse', zh_n: '货币崩溃', en_p: 'a major currency loses utility within months. The financial system improvises faster than the genre tends to imagine.', zh_p: '某主要货币在数月内失去效用。金融系统比类型设想的更快地即兴应对。' },
  { id: 'abundance', en_n: 'Infinite Abundance', zh_n: '无限丰盛', en_p: 'energy and material constraints disappear. Most adults discover that the constraint was load-bearing.', zh_p: '能源与物质约束消失。多数成年人发现：约束是承重的。' },
  { id: 'memory', en_n: 'Memory Deletion', zh_n: '记忆删除', en_p: 'a year of collective memory is unrecoverable. Institutions persist; the relationships within them do not.', zh_p: '一年的集体记忆不可恢复。制度延续；其内的关系不延续。' },
];

function renderScenarios() {
  $('#scen-grid').innerHTML = scenarios.map(s => `
    <div class="card" data-s="${s.id}">
      <div class="card-tag">${s.id}</div>
      <h3><span lang="en">${s.en_n}</span><span lang="zh">${s.zh_n}</span></h3>
      <p><span lang="en">${s.en_p}</span><span lang="zh">${s.zh_p}</span></p>
    </div>`).join('');
  $$('#scen-grid .card').forEach(c => c.addEventListener('click', () => { $('#d-id').value = c.dataset.s; document.getElementById('sim').scrollIntoView({behavior: 'smooth'}); }));
}
renderScenarios();

// sim
const arcs = {
  internet: {
    liberal: { en_w0: 'panic in week one (mostly performative); supply-chain failures appear in week two; mutual-aid networks emerge by week six and outperform government response.', en_y: 'reading and walking habits return; obesity drops; depression measures go up in months 3–6 and back down by month 9 as new social rhythms set in. Net mortality rises modestly; the rise is concentrated in elderly populations losing tele-medicine.', zh_w0: '第一周恐慌（多半是表演性的）；第二周出现供应链失效；第六周互助网络涌现，胜过政府反应。', zh_y: '阅读与散步习惯回归；肥胖下降；抑郁指标在第 3–6 月上升，到第 9 月新社交节奏定型时回落。净死亡率温和上升，集中于失去远程医疗的老龄人群。' },
    authoritarian: { en_w0: 'state response is fast and centralised; designated communication channels open within 72 hours; the state\'s legitimacy actually rises in the first quarter.', en_y: 'parallel state-controlled networks fill the gap; surveillance density increases permanently; informal markets reorganise around physical proximity; cultural production turns inward. Net effect: institutional consolidation.', zh_w0: '国家反应迅速且中央化；72 小时内开通指定通信渠道；第一季度国家合法性反而上升。', zh_y: '平行的国家控制网络填补缺口；监控密度永久增加；非正式市场围绕物理邻近重组；文化生产内转。净效应：制度巩固。' },
    weak: { en_w0: 'response is uneven across regions; some areas restore basic comms within weeks via informal mesh; others remain dark for months.', en_y: 'parallel local economies form along ethnic and kinship lines; weak-state authority erodes further; some regions gain de facto autonomy. Net effect: fragmentation accelerates a decade in one year.', zh_w0: '反应在各地区不均；某些地区通过非正式网状网在数周内恢复基本通讯；其他地区暗 black 数月。', zh_y: '平行的本地经济沿族群与亲缘线形成；弱势国家权威进一步侵蚀；某些地区获得事实自治。净效应：一年内加速十年的碎片化。' },
  },
  ai: {
    liberal: { en_w0: 'institutions delegate decisions to autonomous systems gradually, with public deliberation that mostly trails the actual delegation. Consent is uneven; resistance is concentrated in older professional classes.', en_y: 'within 18 months, most middle-class jobs include "manage the AI doing this" as a sub-task; legitimacy of expert authority declines; new institutional forms emerge slowly. The crisis is felt as administrative malaise, not heroic resistance.', zh_w0: '制度逐步把决定委派给自主系统，公共审议大体落后于实际委派。同意不均；抵抗集中在年龄较大的专业阶层。', zh_y: '18 个月内，多数中产工作包含"管理正在做这事的 AI"这一子任务；专家权威合法性下降；新制度形态缓慢涌现。危机被感受为行政低迷，不是英雄式抵抗。' },
    authoritarian: { en_w0: 'state adopts AI delegation aggressively, closing the gap between citizens and decisions; the population accepts it more quickly than the genre would predict because the prior baseline was already opaque.', en_y: 'state capacity rises measurably; dissent capacity falls; new social compact crystallises around predictable AI-mediated services; cultural register turns from political to administrative. Net effect: increased state legitimacy, decreased political agency.', zh_w0: '国家激进采用 AI 委派，缩小了公民与决定之间的距离；民众接受得比类型预测更快，因为之前的基线已经不透明。', zh_y: '国家能力可测地上升；异见能力下降；围绕可预测的 AI 中介服务结晶出新社会契约；文化语域从政治转向行政。净效应：国家合法性上升，政治能动性下降。' },
    weak: { en_w0: 'state cannot implement coherent AI policy; private firms and global platforms become de facto regulators of AI within national borders.', en_y: 'most decisions are made by foreign-owned systems with no local accountability; pockets of resistance form around traditional authority structures (religious, kinship); long-run outcome: state capture by external technical infrastructure or fragmentation along resistance lines.', zh_w0: '国家无法实施融贯的 AI 政策；私营公司与全球平台成为国境内 AI 的事实监管者。', zh_y: '多数决定由无本地问责的外国所有系统作出；抵抗在传统权威结构（宗教、亲缘）周围形成；长期结果：被外部技术基础设施所俘获，或沿抵抗线碎片化。' },
  },
  blackout: {
    liberal: { en_w0: 'first 72 hours are administrative chaos with sudden cooperative spikes (the genre overweights the looting; the data underweights it). Mutual-aid is the dominant register by day 7.', en_y: 'restoration begins regionally within 30 days; full restoration takes 12–18 months; long-tail effects on data infrastructure persist for a decade. The unsung hero is the local utility worker; the unsung loss is the elderly population dependent on medical equipment.', zh_w0: '前 72 小时是行政混乱，伴随突发的合作峰值（类型过度加权抢劫；数据低估它）。第七天互助是主导语域。', zh_y: '30 天内开始区域恢复；完全恢复需 12–18 个月；对数据基础设施的长尾影响延续十年。无名英雄是本地公用事业工人；无名损失是依赖医疗设备的老龄人群。' },
    authoritarian: { en_w0: 'state response visibly fast; military-civilian coordination tested in real time. Public morale rises in the first 30 days because the state acts visibly.', en_y: 'restoration completes faster than in liberal cases; the rebuild includes permanent surveillance upgrades; the political register rewards the state for the rebuild. Net effect: regime stabilisation under disruption.', zh_w0: '国家反应可见迅速；军-民协调实时被检验。公众士气在头 30 天上升，因为国家可见地行动。', zh_y: '恢复比自由制度更快完成；重建包含永久监控升级；政治语域因重建而奖励国家。净效应：在破坏下政权得以稳定。' },
    weak: { en_w0: 'restoration is regional and uneven; some areas remain off-grid for years; informal economies adapt to permanent low-electricity baseline.', en_y: 'civilization-as-infrastructure recedes; civilization-as-relationships persists. Long-run outcome: a kind of structured low-tech equilibrium that is not as bad as fiction predicts and not as romantic as it imagines.', zh_w0: '恢复是区域性且不均的；某些地区数年仍未通电；非正式经济适应于永久低电基线。', zh_y: '"作为基础设施的文明"退缩；"作为关系的文明"延续。长期结果：一种有结构的低技术均衡——不像虚构预测的那样糟，也不像它想象的那样浪漫。' },
  },
  money: {
    liberal: { en_w0: 'central banks improvise faster than expected; first 90 days see emergency stabilisation measures; informal credit networks fill gaps the formal system can\'t reach.', en_y: 'within 18 months a new functional currency regime stabilises (often involving a tiered system: stablecoins for trade, scrip for local exchange, gold for store of value); the cultural shift is larger than the financial shift. Status currencies (peer reputation, taste, expertise) gain weight relative to dollar-denominated wealth.', zh_w0: '央行比预期更快即兴应对；前 90 天见急救稳定措施；非正式信用网络填补正式系统达不到的缺口。', zh_y: '18 个月内新的功能性货币制度稳定（常涉及分层系统：稳定币用于贸易、本地票券用于交换、黄金作价值储存）；文化转变大于金融转变。状态货币（同侪名望、品味、专长）相对美元计价财富的权重上升。' },
    authoritarian: { en_w0: 'state issues replacement currency by decree; enforcement is direct; black-market exchange rates emerge within weeks; political loyalty becomes implicit financial collateral.', en_y: 'within a year the new currency stabilises domestically; cross-border trade migrates to crypto and gold; long-run effect is a tighter coupling of political and financial loyalty. Capital flight is severe in months 1–6 then plateaus.', zh_w0: '国家以法令发行替代货币；强制是直接的；黑市汇率数周内出现；政治忠诚成为隐含的金融抵押品。', zh_y: '一年内新货币国内稳定；跨境贸易迁移到加密与黄金；长期效果是政治与金融忠诚的更紧耦合。第 1–6 月资本外逃严重，然后平台化。' },
    weak: { en_w0: 'state cannot enforce a replacement; population reverts to informal exchange (barter, kin-based credit, foreign currency) within weeks; weak-state legitimacy erodes further.', en_y: 'parallel currency systems entrench along ethnic and regional lines; foreign currencies dominate cross-regional trade; the weak state becomes a tax-collecting shell. Net effect: dollarisation or yuanisation depending on geography.', zh_w0: '国家无法强制替代；民众数周内回归非正式交换（以物易物、亲缘信用、外币）；弱势国家合法性进一步侵蚀。', zh_y: '平行货币系统沿族群与区域线扎根；外币主导跨区贸易；弱势国家成为收税壳。净效应：依地理或美元化或人民币化。' },
  },
  abundance: {
    liberal: { en_w0: 'optimism and consumer surge in months 1–6; then the discovery that most lives were partially shaped by scarcity; depression and anomie measures rise unexpectedly.', en_y: 'within 18 months, the populations that report best psychological adaptation are not the formerly poorest; they are those whose lives already had non-material structure (craft, community, religious practice). Most adults discover that scarcity was load-bearing in ways the abundance regime cannot replace.', zh_w0: '第 1–6 月乐观与消费激增；然后发现：多数生活部分由匮乏塑造；抑郁与失范指标意外上升。', zh_y: '18 个月内报告最好心理适应的人群不是从前最穷的；是那些生活已有非物质结构（手艺、社区、宗教修行）的人。多数成年人发现：匮乏是承重的，丰盛制度无法替代。' },
    authoritarian: { en_w0: 'state retains coordination function as the new scarcity (status, position) replaces the old; the regime is more durable under abundance than under scarcity.', en_y: 'within a year, status hierarchies based on aesthetic, lineage, or political loyalty replace material status. The regime\'s narrative shifts from "we provide" to "we order"; legitimacy is more contested but capacity remains. Cultural production increases without becoming politically dangerous.', zh_w0: '国家保留协调功能，新匮乏（地位、位置）取代旧匮乏；该政权在丰盛下比在匮乏下更耐久。', zh_y: '一年内基于美学、血统或政治忠诚的地位层级取代物质地位。政权叙事从"我们提供"变为"我们排序"；合法性更受争议但能力保留。文化生产增加而不变得政治危险。' },
    weak: { en_w0: 'abundance reaches the population unevenly; warlordism emerges in pockets where the abundance arrives without state distribution capacity.', en_y: 'within 18 months, the populations with strong kinship structures absorb abundance smoothly; populations without them suffer breakdowns. Net effect: scarcity-era inequality is replaced by abundance-era social-coherence inequality.', zh_w0: '丰盛不均地抵达民众；在丰盛抵达却无国家分配能力的地方，军阀主义出现。', zh_y: '18 个月内有强亲缘结构的人群顺利吸收丰盛；没有的人群遭受崩溃。净效应：匮乏时代的不平等被丰盛时代的社会融贯性不平等取代。' },
  },
  memory: {
    liberal: { en_w0: 'public confusion in week one; institutional functions persist because most are documented; relationships within institutions are the worst-affected layer; new colleagues introduced to each other for the second time.', en_y: 'within a year, society reconstructs itself around documents, photos, and the testimony of those whose memories survived. Trust networks rebuild but with permanent gaps; cultural production tilts heavily toward memoir and re-construction.', zh_w0: '第一周公共困惑；制度功能延续，因为多数有文档记录；制度内的关系是受影响最重的层；新同事第二次被介绍给彼此。', zh_y: '一年内社会围绕文档、照片与"记忆幸存者"的证词重新构建自身。信任网络重建但留下永久缺口；文化生产严重向回忆录与重建倾斜。' },
    authoritarian: { en_w0: 'state takes control of the reconstruction narrative; what people are told they remembered becomes a political instrument within weeks.', en_y: 'within a year, the official version of "what happened" replaces the missing memory in most public discourse; private dissent persists but cannot be coordinated; the regime gains a powerful new tool of legitimacy. Net effect: a decade of legitimacy compressed into 12 months.', zh_w0: '国家控制重建叙事；人们被告知他们曾记得什么，数周内变成政治工具。', zh_y: '一年内"发生了什么"的官方版本在多数公共话语中取代缺失的记忆；私下异见延续却无法协调；政权获得强大的合法性新工具。净效应：十年的合法性被压缩进 12 个月。' },
    weak: { en_w0: 'no central reconstruction; memory loss is reconstructed through kinship and religion, both of which strengthen as a result.', en_y: 'within 18 months, traditional authority structures (elder, priest, family head) gain legitimacy; modern political identities weaken; long-run outcome: the polity is more legible as a federation of memory-communities than as a state. Returns to a configuration that resembles the pre-modern.', zh_w0: '无中央重建；记忆损失通过亲缘与宗教被重建，两者都因此而加强。', zh_y: '18 个月内传统权威结构（长老、神父、家长）获得合法性；现代政治身份弱化；长期结果：该政体作为"记忆共同体的联邦"比作为"国家"更可读。回到一种与前现代相似的配置。' },
  },
};

function runSim() {
  const id = $('#d-id').value;
  const soc = $('#d-soc').value;
  const lang = html.getAttribute('data-lang');
  const s = scenarios.find(x => x.id === id);
  const arc = arcs[id][soc];
  const socName = { liberal: { en: 'High-trust liberal democracy', zh: '高信任自由民主' }, authoritarian: { en: 'High-capacity authoritarian state', zh: '高能力威权国家' }, weak: { en: 'Weak-state federation', zh: '弱势国家联邦' } }[soc];
  if (lang === 'en') {
    $('#sim-out').innerHTML = `
      <h4>${s.en_n} × ${socName.en}</h4>
      <div class="lab">First 90 days</div><p>${arc.en_w0}</p>
      <div class="lab">First year arc</div><p>${arc.en_y}</p>
      <p style="margin-top: 18px; font-size: 12px; color: var(--dim); font-family: var(--mono);">TEMPLATED · NOT A FRONTIER MODEL</p>`;
  } else {
    $('#sim-out').innerHTML = `
      <h4>${s.zh_n} × ${socName.zh}</h4>
      <div class="lab">前 90 天</div><p>${arc.zh_w0}</p>
      <div class="lab">第一年弧线</div><p>${arc.zh_y}</p>
      <p style="margin-top: 18px; font-size: 12px; color: var(--dim); font-family: var(--mono);">模板化 · 非前沿模型</p>`;
  }
}
$('#sim-go').addEventListener('click', runSim);

// reader probes
const probes = [
  { id: 'collapse-fantasy', en_t: 'Collapse Fantasy', zh_t: '崩溃幻想',
    en_h: 'Why does the genre keep predicting collapse and getting it wrong?',
    zh_h: '为何类型不断预测崩溃却总错？',
    en_a: `Three reasons, in declining order of charity.

(1) Survivorship bias in the source material. The collapses we have records of are the ones documented by the surviving institutions of the next civilization; civilizations that ended without anyone writing it down do not contribute to the dataset. The genre learns from a biased sample that overweights catastrophic terminal collapse and underweights the slow administrative reorganisation that is statistically more common.

(2) Drama as a market force. Collapse fiction is read because it is exciting; gradual reorganisation is not. Authors who tell the boring middle truthfully sell fewer books than authors who tell the dramatic terminal version, and the genre selects for dramatists. The wrongness is not a bug; it is the market shape.

(3) The implicit politics. Most collapse fiction encodes a specific political wish — usually that some current arrangement deserves to fall — and the genre uses the form to ratify the wish rather than to model the world. This is fine as a genre move; it is misleading as a forecast. The honest simulator refuses both the dramatist and the wish-fulfillment versions.

What this engine offers instead: stylised disruptions whose first 90 days look messy, whose first year looks administrative, and whose decade-long outcomes are usually less revolutionary than the genre would have. The honesty is not entertaining. That's the point.

What this engine will not pretend: that the genre is irrelevant. Some of the greatest collapse fiction has produced real institutional foresight. But the genre is a literary form first; using it as a forecasting instrument is a category error.`,
    zh_a: `三个理由，按宽厚度递减。

(1) 源材料的幸存者偏差。我们有记录的崩溃，是被下一个文明的幸存制度文献化的那些；无人记录就结束的文明不进入数据集。类型从一个有偏样本中学习，过度加权灾难性终末崩溃，低估更常见的缓慢行政重组。

(2) 戏剧作为市场力量。崩溃虚构被阅读是因为它刺激；渐进重组不刺激。诚实讲述无聊中段的作者，比讲述戏剧化终末版本的作者卖更少的书，类型选择戏剧家。错误不是 bug，是市场形状。

(3) 隐含的政治。多数崩溃虚构编码某种特定政治愿望——通常是某种当前安排活该陨落——类型借形式批准愿望而非建模世界。作为类型动作没问题，作为预测则误导。诚实的模拟器拒绝戏剧家版本与愿望满足版本两者。

本引擎所提供的替代：风格化破坏，其前 90 天看起来混乱，其第一年看起来行政性，其十年长的结果通常比类型所有的更不革命。诚实并不娱乐。这正是要点。

本引擎不会假装的事：类型无关紧要。某些最伟大的崩溃虚构产出过真实的制度前瞻。但类型首先是文学形式；把它当预测工具是范畴错误。` },
  { id: 'best-case', en_t: 'The Best Case', zh_t: '最佳情况',
    en_h: 'Of the six disruptions, which one would actually be best for human flourishing?',
    zh_h: '六种破坏中，哪一种实际上对人类繁荣最好？',
    en_a: `Counterintuitively, probably the internet shutdown.

Three reasons. (1) The internet shutdown removes a single layer of social coordination without removing the substrate of life. People still have homes, food, family, work, weather. They lose a coordination tool whose net effect on attention has been ambiguous; many populations report better mental-health measures by month nine of a sustained shutdown. The cost is real (medical, supply-chain, education) but bounded. (2) The other five are more invasive. AI takeover changes who decides; abundance changes what scarcity is; memory deletion changes who remembers; blackout changes physical life; currency collapse changes the medium of exchange. Each of those reaches deeper into the substrate. The internet shutdown is the shallowest disruption that still counts as a disruption. (3) Internet shutdowns are partially reversible. They are the only disruption on the list whose end-state can be re-entered with most of the prior infrastructure intact. The others ratchet civilization in ways that are hard to undo.

The harder honesty: "best for human flourishing" is not a stable category. The shutdown is best for one specific reading of flourishing — one that values attention, local relationships, and slower information regimes. For other readings — global cooperation, scientific progress, marginalised people accessing tools — it is much worse. The simulator refuses to pick a single flourishing function; it presents the trade-offs.

What this engine will not pretend: that any of the six are unambiguously good. They are all losses with redistributed benefits. Naming the redistribution is the engine\'s job; ranking the redistributions is yours.`,
    zh_a: `反直觉地，多半是互联网关闭。

三个理由。(1) 互联网关闭移除一层社会协调，而不移除生活的底层。人们仍有家、食物、家庭、工作、天气。他们失去一种协调工具，其对注意的净效应一直暧昧；许多民众在持续关闭九个月时报告心理健康指标更好。代价是真实的（医疗、供应链、教育）但有界。(2) 其余五种更具侵入性。AI 接管改变谁决定；丰盛改变匮乏是什么；记忆删除改变谁记得；停电改变物理生活；货币崩溃改变交换媒介。每一种都更深入底层。互联网关闭是仍算得上破坏的最浅破坏。(3) 互联网关闭部分可逆。它是清单上唯一一种其终态可在多数先前基础设施完好的情况下被重入的破坏。其他都以难以撤销的方式棘轮文明。

更难的诚实："对人类繁荣最好"不是稳定范畴。关闭对繁荣的某种特定读法最好——那种重视注意、本地关系与更慢信息制度的读法。对其他读法——全球合作、科学进步、边缘人群获取工具——它糟糕得多。模拟器拒绝挑选单一繁荣函数；它呈现取舍。

本引擎不会假装的事：六种里有任何一种是无疑好的。它们都是有再分配收益的损失。命名再分配是引擎的工作；为再分配排序是你的。` },
  { id: 'how-to-prepare', en_t: 'How To Prepare', zh_t: '如何准备',
    en_h: 'How should I prepare for these disruptions?',
    zh_h: '我该如何为这些破坏做准备？',
    en_a: `Three answers, two unflattering.

(1) Stockpile less than the genre tells you. The marginal utility of personal stockpiling drops sharply past two weeks of supplies; beyond that, the determinants of survival are local network configuration, not pantry contents. People with three months of food and no neighbours do worse than people with three days of food and three neighbours.

(2) Invest in local networks more than the genre tells you. The single highest-leverage preparation across the six disruptions is a functioning local network — a neighbourhood, a parish, an extended family, a workplace small enough to have actual cohesion. This is also the preparation most adults find hardest to actually do, because it is slow, requires ongoing reciprocation, and cannot be bought. It compounds over decades, which is exactly why most adults underinvest.

(3) Develop a non-fragile skill set. Not "useful in collapse" skills (the genre over-romanticises basic survival skills); rather, skills whose value persists in low-coordination regimes — practical maintenance, basic medical, calm under pressure, ability to organise others, the social grammar to defuse a tense room. These are useful in disruption and they are useful in normal life; the dual-use is what makes them rational.

The harder honesty: in most of the six disruptions, individual preparation is statistically a small input compared to the configuration of your local society and the historical accident of where you live. Preparation is rational at the margin; treating it as the main move is a category error and is also expensive.

What this engine will not pretend: that there is a way to prep your way out of an authoritarian-state response, a memory deletion, or a global blackout. There is not. Preparation reduces the variance of your outcome; it does not move the mean as much as the genre claims.`,
    zh_a: `三个答案，两个不奉承。

(1) 比类型告诉你的囤更少。个人囤积的边际效用在两周用品后急剧下降；超出之后，生存的决定因素是本地网络配置，不是食品柜内容。有三个月食物却无邻居的人，比有三天食物加三个邻居的人结果更差。

(2) 比类型告诉你的更多投资本地网络。在六种破坏之间杠杆率最高的单一准备，是一个运转中的本地网络——一个街区、一个教区、一个大家庭、一个小到有真正凝聚力的工作场所。这也是多数成年人发现最难真正去做的准备，因为它慢、需要持续互惠、买不到。它在数十年间复利，这正是多数成年人投资不足的原因。

(3) 培养非脆弱技能集。不是"在崩溃中有用"的技能（类型过度浪漫化基本生存技能）；而是其价值在低协调制度中延续的技能——实际维修、基本医疗、压力下的冷静、组织他人的能力、化解紧张房间的社交语法。这些在破坏中有用，在正常生活中也有用；这种双用是让它们理性的原因。

更难的诚实：在六种破坏的多数中，个人准备相比"你本地社会的配置"与"你住在哪里的历史偶然"，在统计上是小输入。准备在边际上理性；把它当作主要动作是范畴错误，且昂贵。

本引擎不会假装的事：有一种方式可以靠准备摆脱威权国家反应、记忆删除或全球停电。没有。准备减少你结果的方差；它不像类型声称的那样大幅移动均值。` },
  { id: 'memory-disruption', en_t: 'Memory Disruption', zh_t: '记忆破坏',
    en_h: 'Why include memory deletion? Isn\'t that science fiction?',
    zh_h: '为何纳入"记忆删除"？这不是科幻吗？',
    en_a: `Strictly speaking yes; substantively no.

The strict version — neuroscience-grade collective memory deletion — is fictional. The functional version is not. Civilizations regularly experience disruptions in collective memory at scale: large-scale forced migration, generational language loss, the destruction of archives, the erasure of legible history under regime change, the collapse of an oral-tradition substrate when the elders all die in a short period. These are real events; they have happened repeatedly; they happen now in slow form. The science-fiction framing is a useful compression of mechanisms that occur in the actual world.

The reason to include it on a stylised list. (1) It distinguishes "civilization-as-infrastructure" from "civilization-as-relationships." The infrastructure persists when memory is removed; the relationships do not. This distinction is invisible in the other five disruptions, where the loss is concrete enough to obscure it. (2) It is the disruption most authoritarian regimes have shown the highest tolerance for and the most capacity to weaponise. The thought experiment gives the simulator a way to model regimes that would otherwise be too uncomfortable to model directly. (3) It produces the most legible portrait of what a society actually loses when it loses people who lived through events. This is also a real loss in slow form — every generation hands off less.

What this engine will not pretend: that the science-fiction framing is just a stunt. It is a stylised compression of slow real losses, sharpened to make the underlying dynamic visible. Science fiction is one of the older instruments of social analysis; it is not less serious than the news, and sometimes it is more useful.`,
    zh_a: `严格说是的；实质上不是。

严格版本——神经科学级的集体记忆删除——是虚构。功能版本不是。文明经常经历集体记忆的大规模破坏：大规模强制迁徙、代际语言丧失、档案毁灭、政权更迭下可读历史的抹除、长老短期内全部去世时口传传统底层的崩溃。这些是真实事件；它们反复发生；它们现在以慢的形式发生。科幻框架是对在真实世界中发生的机制的有用压缩。

把它纳入风格化清单的理由。(1) 它把"作为基础设施的文明"与"作为关系的文明"区分开。当记忆被移除时基础设施延续；关系不延续。这种区分在其余五种破坏中不可见——那里的损失具体到足以遮蔽它。(2) 它是多数威权政权显示出最高容忍与最大武器化能力的破坏。思想实验给模拟器一种方式来建模那些直接建模会过于令人不适的政权。(3) 它产出"社会失去亲历事件的人时究竟失去什么"最可读的肖像。这也是以慢形式存在的真实损失——每一代交付的更少。

本引擎不会假装的事：科幻框架只是噱头。它是慢性真实损失的风格化压缩，被锐化以让底层动态可见。科幻是更古老的社会分析工具之一；它不比新闻不严肃，有时更有用。` },
  { id: 'human-nature', en_t: 'Human Nature Under Disruption', zh_t: '破坏下的人性',
    en_h: 'Do these disruptions reveal "the real" human nature, or do they hide it?',
    zh_h: '这些破坏揭示"真实的"人性，还是隐藏它？',
    en_a: `Neither, and the question is the failure mode the simulator is designed to surface.

There is no "real" human nature waiting to be revealed by stress; there are different equilibria selected by different conditions. The same population, run through different disruptions, expresses very different behaviours, and none of them is more authentic than the calm-baseline version. The behaviours are co-produced by people and conditions; the conditions are part of the equation, not the curtain that pulls back to reveal the truth.

Three readings of how disruption shapes behaviour. (1) Most disruption fiction over-weights antisocial outcomes (looting, hoarding, every-person-for-themselves). The actual data — from natural experiments, large-scale disasters, and slow-rolling crises — consistently shows mutual aid as the modal response in the first three weeks; antisocial behaviour is a smaller and more publicised tail. (2) The behaviours that surprise observers are usually the cooperative ones; pre-existing cooperative behaviours in normal life are simply less legible because nothing was at stake. The disruption does not reveal cooperation; it reveals the behaviour that was already there. (3) The thing disruption does reveal honestly is which institutional structures were load-bearing. People discover what their society actually was when one beam is removed. The genre tends to read this as character revelation; it is closer to architectural revelation. The wall was not the people; it was the wall.

What this engine refuses to pretend: that any of the six disruptions tell you what people are "really like." They tell you what people do under specific configurations. The configuration is a load-bearing part of the description; removing it and asking "what is left" is the wrong question, because what is left is not a hidden essence but a different equilibrium that could only have been produced by stripping the original conditions.`,
    zh_a: `两者都不是，问题本身就是模拟器被设计以浮现的失败模式。

没有"真实"的人性在等待被压力揭示；有的是被不同条件选择的不同均衡。同一民众跑过不同破坏会表达非常不同的行为，其中没有一种比"冷静基线"版本更本真。行为由人与条件共产；条件是方程的一部分，不是拉开就揭示真相的幕布。

三种关于破坏如何塑造行为的读法。(1) 多数破坏虚构过度加权反社会结果（抢劫、囤积、人人为己）。实际数据——来自自然实验、大规模灾难、慢滚危机——一致显示互助是头三周的众数反应；反社会行为是更小、更被公开化的尾部。(2) 让观察者意外的行为通常是合作的那些；正常生活中既存的合作行为只是因为无利害而不可读。破坏不揭示合作；它揭示已经在那里的行为。(3) 破坏诚实揭示的事，是哪些制度结构是承重的。人们在一根梁被移除时发现他们的社会究竟是什么。类型倾向于把这读作性格揭示；这更接近于建筑学揭示。墙不是人；墙就是墙。

本引擎拒绝假装的事：六种破坏中任何一种告诉你人"真正"是什么样。它们告诉你人在特定配置下做什么。配置是描述的承重部分；移除它问"剩下什么"是错问题——因为剩下的不是一种隐藏本质，而是只能由剥去原始条件所产出的另一种均衡。` },
];

function renderProbes() {
  $('#prompt-grid').innerHTML = probes.map(p => `<button class="prompt-btn" data-id="${p.id}"><span class="pt-tag">probe</span><strong><span lang="en">${p.en_t}</span><span lang="zh">${p.zh_t}</span></strong><div style="margin-top:6px; color: var(--muted); font-size: 12px;"><span lang="en">${p.en_h}</span><span lang="zh">${p.zh_h}</span></div></button>`).join('');
  $$('.prompt-btn').forEach(b => b.addEventListener('click', () => { const p = probes.find(x => x.id === b.dataset.id); const lang = html.getAttribute('data-lang'); $('#mirror-out').textContent = lang === 'en' ? p.en_a : p.zh_a; }));
}
renderProbes();

function heuristic(text) {
  const lang = html.getAttribute('data-lang');
  const t = text.toLowerCase();
  const found = [];
  for (const s of scenarios) { const re = new RegExp(s.id + '|' + s.zh_n.replace(/AI/, ''), 'i'); if (re.test(t)) found.push(s.en_n); }
  if (lang === 'en') return `Heuristic read · disruptions named: ${found.length ? found.join(' · ') : 'none flagged'}.\n\nThe canned probes above are cleaner than this fallback. Pick the closest one for a fully written response.`;
  return `启发式读取 · 命名的破坏：${found.length ? found.join(' · ') : '无标记'}。\n\n上方的预设探针比这个回退更干净。挑最贴近的一个，可得到完整成型的回答。`;
}

$('#mirror-go').addEventListener('click', () => { const text = $('#mirror-input').value.trim(); if (!text) return; $('#mirror-out').textContent = heuristic(text); });
