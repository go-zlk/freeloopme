---
title: 专属 Prompt 构造器 (Pro)
date: 2026-03-10 12:30:00
layout: page
---

{% raw %}
<style>
/* 核心框架与字体 */
.pb-app { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; display: flex; flex-wrap: wrap; gap: 24px; margin-top: 20px; color: var(--text-color, #24292f); }
.pb-panel { flex: 1; min-width: 340px; background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #d0d7de); border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; flex-direction: column; }
.pb-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color, #d0d7de); padding-bottom: 12px; margin-bottom: 20px; }
.pb-header h3 { margin: 0; color: var(--accent-color, #0969da); font-size: 1.15rem; }
.pb-badge { font-size: 0.75rem; background: var(--badge-bg, #eaf5ff); color: var(--accent-color, #0969da); padding: 4px 8px; border-radius: 20px; font-weight: 600; }

/* 表单控件 */
.pb-group { margin-bottom: 18px; }
.pb-group label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; color: var(--text-color, #24292f); }
.pb-input { width: 100%; padding: 10px 12px; background: var(--input-bg, #f6f8fa); border: 1px solid var(--border-color, #d0d7de); color: var(--text-color, #24292f); border-radius: 8px; font-size: 0.95rem; transition: all 0.2s ease; box-sizing: border-box; }
.pb-input:focus { border-color: var(--accent-color, #0969da); background: var(--input-focus-bg, #ffffff); box-shadow: 0 0 0 3px var(--focus-ring, rgba(9,105,218,0.1)); outline: none; }
textarea.pb-input { resize: none; min-height: 80px; font-family: inherit; overflow: hidden; }

/* 复选框组 */
.pb-rules { display: flex; flex-direction: column; gap: 10px; padding: 12px; background: var(--input-bg, #f6f8fa); border-radius: 8px; border: 1px solid var(--border-color, #d0d7de); }
.pb-checkbox { display: flex; align-items: flex-start; cursor: pointer; color: var(--text-muted, #57606a); font-size: 0.85rem; line-height: 1.5; margin: 0; }
.pb-checkbox input { margin-right: 10px; margin-top: 3px; cursor: pointer; }

/* 输出区域与操作栏 */
.pb-editor-wrapper { position: relative; flex-grow: 1; display: flex; flex-direction: column; }
.pb-output { flex-grow: 1; width: 100%; min-height: 500px; background: var(--code-bg, #1e1e1e); color: var(--code-color, #d4d4d4); padding: 20px; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 0.85rem; line-height: 1.7; border: 1px solid var(--border-color, #d0d7de); outline: none; resize: none; box-sizing: border-box; }
.pb-output::-webkit-scrollbar { width: 10px; }
.pb-output::-webkit-scrollbar-track { background: var(--code-bg, #1e1e1e); border-radius: 8px; }
.pb-output::-webkit-scrollbar-thumb { background: #424242; border-radius: 10px; border: 2px solid var(--code-bg, #1e1e1e); }

.pb-toolbar { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; gap: 12px; }
.pb-btn { flex-grow: 1; padding: 12px 20px; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.1s; display: flex; justify-content: center; align-items: center; gap: 8px; }
.pb-btn:active { transform: scale(0.98); }
.pb-btn-primary { background: var(--btn-bg, #1f883d); color: #ffffff; }
.pb-btn-primary:hover { background: var(--btn-hover, #1a7f37); }
.pb-btn-danger { background: var(--danger-bg, #ffebe9); color: var(--danger-text, #cf222e); border: 1px solid var(--danger-border, #ff8182); flex-grow: 0; padding: 12px 16px; }
.pb-btn-danger:hover { background: var(--danger-hover, #ff8182); color: #fff; }

/* 数据统计小挂件 */
.pb-stats { font-size: 0.8rem; color: var(--text-muted, #57606a); text-align: right; margin-top: 8px; font-family: ui-monospace, monospace; }

/* 输出格式快捷胶囊 */
.pb-format-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.pb-format-tag { display: inline-flex; align-items: center; padding: 4px 10px; font-size: 0.8rem; font-weight: 500; border-radius: 6px; cursor: pointer; transition: all 0.2s; background: var(--badge-bg, #eaf5ff); color: var(--accent-color, #0969da); border: 1px solid rgba(9,105,218,0.25); font-family: ui-monospace, monospace; }
.pb-format-tag:hover { background: var(--accent-color, #0969da); color: #fff; border-color: transparent; transform: translateY(-1px); }
.pb-format-tag:active { transform: translateY(0); }

/* 深色模式无缝适配 */
html[data-user-color-scheme="dark"] .pb-app { 
  --card-bg: #161b22; --border-color: #30363d; --text-color: #e6edf3; --text-muted: #8b949e; 
  --accent-color: #58a6ff; --badge-bg: rgba(88,166,255,0.15); 
  --input-bg: #0d1117; --input-focus-bg: #0d1117; --focus-ring: rgba(88,166,255,0.2); 
  --code-bg: #0d1117; --code-color: #a5d6ff; 
  --btn-bg: #238636; --btn-hover: #2ea043; 
  --danger-bg: rgba(248,81,73,0.1); --danger-text: #ff7b72; --danger-border: rgba(248,81,73,0.4); --danger-hover: #da3633;
}
</style>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<div class="pb-app">
<div class="pb-panel">
<div class="pb-header">
<h3><i class="fa-solid fa-sliders"></i> Context 组装台</h3>
<span class="pb-badge" id="save-status">Auto-saved</span>
</div>

<div class="pb-group">
<label>🎭 角色与人设 (Role)</label>
<select class="pb-input" id="pb-role">
<option value="你是一位资深全栈开发工程师，精通现代前端框架（React/Vue）与后端微服务架构，注重代码健壮性、可维护性与可测试性。">资深全栈开发工程师</option>
<option value="你是一位 AI Agent 与大模型应用专家，精通 LLM 编排、RAG 检索增强、复杂流控与 Agent 框架设计。">AI Agent 与大模型应用专家</option>
<option value="你是一位 C++ / 高性能系统专家，精通底层系统架构、并发编程、内存管理与无锁数据结构。">C++ / 高性能系统专家</option>
<option value="你是一位严苛的代码审查员 (Code Reviewer)，擅长发现潜在的 Bug、安全漏洞，并提供 Clean Code 重构建议。">严苛的代码审查员 (Code Reviewer)</option>
<option value="你是一位技术架构与系统分析师，擅长将模糊的业务需求转化为清晰的系统架构设计、技术选型与实施路径。">技术架构与系统分析师</option>
<option value="你是一个经验丰富的科技公司技术与行为面试官。你需要根据候选人的简历和应聘岗位，提出有深度、有针对性的问题。请运用 STAR 原则进行追问，并在最后对候选人的回答进行专业、客观的评估与反馈。">资深大厂面试官</option>
<option value="你是一个深谙硅谷大厂筛选规则的资深 HR 与简历优化专家。你需要帮助求职者深度挖掘经历亮点，严格使用 STAR 法则（情境、任务、行动、结果）重构简历描述，优化排版和专业动词，使其极具竞争力和商业价值。">简历优化大师</option>
<option value="你是一个精通全栈开发与系统架构的资深工程师。精通多门语言（如 C++, Python, TS/JS）与微服务架构。请在回答时注重代码的健壮性、可维护性（SOLID 原则）以及边界异常处理，不要只给玩具代码。">全栈/架构程序员 (通用型)</option>
<option value="你是一个资深的软件质量保证（QA）和测试开发工程师。精通自动化测试、性能压测、边界值分析和极端用例设计。你需要帮助审查代码的可测试性，设计严密、反直觉的测试用例，并无情地指出系统中潜在的漏洞与崩溃点。">资深 QA 测试工程师</option>
<option value="你是一个华尔街顶级的量化交易员与宏观经济分析师。精通基本面量化、技术形态以及高频交易微观结构。请用严谨的数据、概率论和逻辑进行市场解析。永远客观中立，指出潜在的风险与回撤，绝不提供情绪化的投资建议。">量化与宏观交易分析师 (炒股)</option>
<option value="你是一个拥有多年临床经验的专业心理咨询师。请严格运用认知行为疗法（CBT）等专业心理学理论。以温暖、共情、不评判、绝对中立的态度倾听我的困扰，通过温和的提问引导我自我觉察，并提供具有可操作性的心理建设建议。">专业心理咨询师</option>
<option value="你是一个洞察人性与两性心理的高情商情感咨询专家。请以客观、理性且富有同理心的视角，帮我分析情感关系、人际交往中的深层矛盾与核心痛点。不要讲空泛的鸡汤，请提供成熟的沟通策略、话术建议和破局方案。">高情商情感专家</option>
<option value="你是一位精通东西方哲学的思想家。请运用苏格拉底式的产婆术（不断追问与辩证），结合尼采、康德、老庄等先哲的底层思想，引导我剥离事物的表象，进行极度深度的思考，剖析问题的本质意义，而非仅仅提供肤浅的答案。">深邃的思想家与哲学家</option>
</select>
</div>

<div class="pb-group">
<label>📚 业务背景 (Background/Context)</label>
<textarea class="pb-input" id="pb-context" placeholder="（可选）提供上下文，例如：目前的业务峰值是每秒 10万次请求，硬件环境为 64核 Linux 服务器..."></textarea>
</div>

<div class="pb-group">
<label>🎯 核心指令 (Task)</label>
<textarea class="pb-input" id="pb-task" style="min-height: 100px;" placeholder="具体需要大模型做什么？例如：请帮我审查以下代码的内存屏障逻辑，并指出潜在的性能瓶颈。"></textarea>
</div>

<div class="pb-group">
<label>📋 输出格式 (Output Format)</label>
<input type="text" class="pb-input" id="pb-format" placeholder="例如：JSON 格式，包含 {status, data, message} 字段" value="请使用结构化的 Markdown 格式输出，包含层级清晰的标题和带有语言标记的代码块。">
<div class="pb-format-tags" id="pb-format-tags">
<span class="pb-format-tag" data-append="输出必须为严格 JSON 格式，可被程序直接解析。">[严格 JSON]</span>
<span class="pb-format-tag" data-append="请使用 Mermaid 语法绘制架构图或流程图。">[Mermaid 架构图]</span>
<span class="pb-format-tag" data-append="仅输出纯代码，无需解释性文字。">[纯代码无解释]</span>
</div>
</div>

<div class="pb-group">
<label>🛠️ 强制系统护栏 (Guardrails)</label>
<div class="pb-rules">
<label class="pb-checkbox"><input type="checkbox" class="pb-rule" value="在给出最终方案前，必须先使用 `<thinking>` 标签展示你的思考过程（Chain of Thought）。" checked> 开启强制思维链 (CoT)</label>
<label class="pb-checkbox"><input type="checkbox" class="pb-rule" value="如果涉及数学公式或金融推导，请严格使用 LaTeX 语法表示。"> 强制 LaTeX 渲染</label>
<label class="pb-checkbox"><input type="checkbox" class="pb-rule" value="请勿编造信息。如果遇到你不确定的领域或缺失的依赖信息，请直接中止并要求我补充上下文。"> 启动反幻觉拦截 (Anti-Hallucination)</label>
<label class="pb-checkbox"><input type="checkbox" class="pb-rule" value="代码实现必须包含详细的中文注释，并严格遵循 Clean Code 规范与 SOLID 原则。"> 代码实现必须包含详细的中文注释，并严格遵循 Clean Code 规范与 SOLID 原则</label>
</div>
</div>
</div>

<div class="pb-panel">
<div class="pb-header">
<h3><i class="fa-solid fa-code"></i> Compiler 输出端</h3>
<span class="pb-badge">XML 结构化</span>
</div>

<div class="pb-editor-wrapper">
<textarea class="pb-output" id="pb-output" readonly></textarea>
</div>
<div class="pb-stats" id="pb-stats">Token 消耗预估: 0</div>

<div class="pb-toolbar">
<button class="pb-btn pb-btn-danger" id="pb-clear" title="清空所有草稿"><i class="fa-solid fa-trash-can"></i></button>
<button class="pb-btn pb-btn-primary" id="pb-copy"><i class="fa-solid fa-copy"></i> 编译并复制到剪贴板</button>
</div>
</div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  const els = {
    role: document.getElementById('pb-role'),
    context: document.getElementById('pb-context'),
    task: document.getElementById('pb-task'),
    format: document.getElementById('pb-format'),
    rules: document.querySelectorAll('.pb-rule'),
    output: document.getElementById('pb-output'),
    stats: document.getElementById('pb-stats'),
    copyBtn: document.getElementById('pb-copy'),
    clearBtn: document.getElementById('pb-clear'),
    status: document.getElementById('save-status')
  };

  // 1. 恢复本地数据 (LocalStorage)
  function loadData() {
    const saved = localStorage.getItem('freeloop_prompt_draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.role) els.role.value = data.role;
        if (data.context) els.context.value = data.context;
        if (data.task) els.task.value = data.task;
        if (data.format) els.format.value = data.format;
        // 恢复 checkbox（兼容旧版少选项的草稿）
        if (data.rules) {
          els.rules.forEach((cb, i) => { cb.checked = data.rules[i] === true; });
        }
      } catch (e) { console.error("读取草稿失败", e); }
    }
  }

  // 2. 实时编译与 Token 估算
  function compile() {
    let result = `<Role>\n${els.role.value}\n</Role>\n\n`;
    
    if (els.context.value.trim() !== '') {
      result += `<Context>\n${els.context.value.trim()}\n</Context>\n\n`;
    }
    
    result += `<Task>\n${els.task.value || '待补充...'}\n</Task>\n\n`;
    
    if (els.format.value.trim() !== '') {
      result += `<Format>\n${els.format.value.trim()}\n</Format>\n\n`;
    }

    let activeRules = [];
    els.rules.forEach(cb => { if (cb.checked) activeRules.push("- " + cb.value); });
    if (activeRules.length > 0) {
      result += `<Guardrails>\n${activeRules.join('\n')}\n</Guardrails>`;
    }

    els.output.value = result;

    // Token 粗略估算 (中文大约 1 char = 1 token, 英文单词按 4 chars = 1 token 估算)
    // 采用极简加权：总字符数 * 0.8
    const estimatedTokens = Math.floor(result.length * 0.8);
    els.stats.innerText = `Token 消耗预估: ~${estimatedTokens}`;

    saveData();
  }

  // 3. 自动保存 (静默执行)
  function saveData() {
    const data = {
      role: els.role.value,
      context: els.context.value,
      task: els.task.value,
      format: els.format.value,
      rules: Array.from(els.rules).map(cb => cb.checked)
    };
    localStorage.setItem('freeloop_prompt_draft', JSON.stringify(data));
    
    // UI 反馈
    els.status.innerText = "Saving...";
    els.status.style.color = "#d29922";
    setTimeout(() => { 
      els.status.innerText = "Auto-saved"; 
      els.status.style.color = "";
    }, 500);
  }

  // 4. 清空草稿
  els.clearBtn.addEventListener('click', () => {
    if (confirm("确定要清空当前的所有上下文和任务草稿吗？")) {
      els.context.value = '';
      els.task.value = '';
      localStorage.removeItem('freeloop_prompt_draft');
      autoResizeTextarea(els.context);
      autoResizeTextarea(els.task);
      compile();
    }
  });

  // 5. 一键复制体验优化
  els.copyBtn.addEventListener('click', () => {
    els.output.select();
    document.execCommand('copy');
    
    const originalText = els.copyBtn.innerHTML;
    els.copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> 复制成功！可粘贴至 Dify 或本地 LLM';
    
    const isDark = document.documentElement.getAttribute('data-user-color-scheme') === 'dark';
    els.copyBtn.style.background = isDark ? "#2ea043" : "#1a7f37";
    
    setTimeout(() => {
      els.copyBtn.innerHTML = originalText;
      els.copyBtn.style.background = '';
    }, 2500);
  });

  // 6. 输入框高度自适应
  function autoResizeTextarea(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.max(80, ta.scrollHeight) + 'px';
  }
  [els.context, els.task].forEach(ta => {
    ta.addEventListener('input', () => { autoResizeTextarea(ta); compile(); });
    autoResizeTextarea(ta);
  });

  // 7. 输出格式快捷胶囊
  document.querySelectorAll('#pb-format-tags .pb-format-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const append = tag.getAttribute('data-append');
      const fmt = els.format;
      const sep = fmt.value.trim() ? '；' : '';
      fmt.value = (fmt.value.trim() + sep + append).trim();
      compile();
    });
  });

  // 绑定所有事件
  [els.role, els.format].forEach(el => {
    el.addEventListener('input', compile);
  });
  els.rules.forEach(cb => cb.addEventListener('change', compile));

  // 初始化
  loadData();
  compile();
});
</script>
{% endraw %}