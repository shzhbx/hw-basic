# hw-protocols 协议页编写规范（子 agent 必读）

本站是"硬件协议图解 · HW Protocol Lab"：面向嵌入式工程师的**单文件交互式 HTML 协议图解页**。
你负责新建一个 `docs/<proto>.html` 页面。写作前必须通读 `docs/sdio.html`（章节深度与代码风格的首要基准）与 `docs/uart.html`（波形动画的次要参考）。

## 硬性约束

- **单文件 HTML**：所有 CSS/JS/SVG 全部内联，除 Google Fonts 外**禁止任何外部资源**（无 CDN 脚本、无图片文件），双击直接打开 `file://` 也能完整运行。
- `<html lang="zh-CN">`，UTF-8，正文中文（专业术语保留英文）。
- 复用全站设计令牌（`:root` 变量与 `docs/index.html` 完全一致，直接复制）：

```css
:root{
  --bg:#070b09; --panel:#0d1510; --panel2:#101a13; --line:#1d2c22;
  --ink:#dcebe1; --dim:#8aa294; --faint:#5c7264;
  --green:#34e08a; --amber:#ffb02e; --cyan:#57d8f2;
  --mono:'IBM Plex Mono',ui-monospace,monospace;
  --disp:'Chakra Petch','Noto Sans SC',sans-serif;
}
body{font-family:'Noto Sans SC',-apple-system,sans-serif;}
```

字体引入（与现有页一致）：
`https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@300;400;500;700&display=swap`

- **只允许创建你负责的那一个文件**。禁止修改 `index.html`、`README.md`、`STYLE_GUIDE.md` 及任何已有页面——跨页导航、首页卡片由主 agent 统一维护。
- 原生 vanilla JS，无框架；JS 放 `</body>` 前；不产生 console 报错；所有 `id` 唯一。

## 页面骨架（从上到下，与 sdio.html 对齐）

1. **顶栏 nav**：`<nav><div class="nav-in">` 内两段 + 抽屉按钮：
   - `<div class="brand">XXX<b>·</b>LAB</div>`（XXX = 协议名，如 `SPI`、`CAN`、`JTAG`）
   - `<div class="nav-links">` 页内锚点（每章一个，精简到 6–9 个）
   - `<button class="pnav-open">☰ 协议</button>` 跨页抽屉导航（见下方"跨页导航"节）
2. **hero**：eyebrow（大写英文短语点题）→ `<h1>中文名<span class="en">ENGLISH FULL NAME</span></h1>` → `lead` 一段话（把协议讲成一个有悬念的故事）→ `hero-chips` 特性标签 → CTA 按钮 → **hero SVG 示意图动画**（两芯片/拓扑连线 + 流动的数据包，JS 驱动）。
3. **章节**：用 sdio.html 的编号节头模式：
   `<div class="sec-head reveal"><span class="no">01</span><h2>中文标题</h2><span class="en">ENGLISH</span></div>`
   建议 8–10 章：它是什么&为什么 → 物理层/信号 → 核心时序动画（交互实验室）→ 协议机制深挖 → 配置/枚举流程 → 计算器或对比 → Linux 实战（终端风格）→ 调试指南 → 踩坑指南（症状→病因表）→ 速查表。
4. **footer**：固定两栏结构（参考行 + `XXX·LAB` + 维护行），完整模板见下方"title 与 footer 规范"。
5. `reveal` 滚动进入动画：IntersectionObserver（照抄 sdio.html 的实现思路）。

## 交互底线（这是本站的灵魂，缺一不可）

1. **至少一个"逐位/逐包"核心时序动画**：示波器/逻辑分析仪视角的波形（SVG 绘制），带 ▶播放 / ⏸ / 单步 / 速度调节，采样沿、位窗口、状态跳变要随动画高亮并配文字解说。
2. **至少一个参数交互**：模式切换器（对比两种模式的同一过程）或可调参数计算器（输入 → 实时算出带宽/波特率/时隙等）。
3. **至少一个状态机或拓扑动画**（可点击步进）。
4. 表格用暗色面板 + 细边框风格；代码/终端块用 `--mono` 深色底、仿真终端外观（参考 sdio.html 的 Linux 章节）。

## 跨页导航（protocol-nav.js 抽屉）

全站跨页导航由 `docs/protocol-nav.js` 统一渲染，**不要在页面里手写跨页链接**：

1. 顶栏 `nav-in` 末尾放触发按钮（原样复制）：
   `<button class="pnav-open" aria-label="打开协议导航" title="全部协议">☰ 协议</button>`
2. `</body>` 前引入脚本：`<script src="protocol-nav.js" defer></script>`（放在页面自己的 `<script>` 之后）。
3. 新协议上线时由主 agent 在 `protocol-nav.js` 的 `PROTOCOLS` 数组里加一项（按分组），全部页面自动同步。

链接其他协议页讲过的知识点时，优先用 `<a href="xxx.html">` 跨页引用而不是重复展开。

## title 与 footer 规范（全站统一，勿自创格式）

- `<title>`：`<协议中文名> · 交互式图解`，中文名可带限定词（如 `RS-485 与 Modbus RTU · 交互式图解`），后缀固定不变，不要写成"时序图解/动画图解"或追加 `·XXX·LAB`。
- footer 结构固定为两栏：

```html
<footer>
  <div class="f-l">
    <b>参考</b> · <规范/数据手册/内核文档，3–6 条，可含跨页链接><br>
    本页为单文件交互式图解，可离线打开 · 波形由浏览器实时渲染
  </div>
  <div class="f-r">XXX·LAB<small>HW-PROTOCOLS · MAINTAINED WITH ♥ FOR EMBEDDED ENGINEERS</small></div>
</footer>
```

- 对应 CSS（复制自 spi.html，颜色变量换成各页自己的）：

```css
footer{border-top:1px solid var(--line);padding:44px 6vw 60px;margin-top:40px;display:flex;flex-wrap:wrap;gap:24px;align-items:baseline;justify-content:space-between}
footer .f-l{font-family:var(--mono);font-size:11.5px;color:var(--faint);line-height:2.1}
footer .f-l b{color:var(--dim);font-weight:500}
footer .f-r{font-family:var(--disp);font-weight:700;font-size:22px;color:var(--green)}
footer .f-r small{display:block;font-family:var(--mono);font-weight:400;font-size:10px;color:var(--faint);letter-spacing:.18em;text-align:right;margin-top:6px}
```

## 完成后自验（必做）

1. `python3` 用 `html.parser` 把整页走一遍，无异常、标签配平。
2. 写个小脚本检查：页内所有 `href="*.html"` 的目标都在 `protocol-nav.js` 的 `PROTOCOLS` 清单中（外加 `index.html`）；所有 `href="#xxx"` 都有对应 `id="xxx"`。
3. 若本机有 node：提取 `<script>` 内容存临时文件跑 `node --check`。
4. `git status`：你的产出必须只有一个新增 untracked 文件，不得出现对已跟踪文件的改动。
5. **页面含 canvas 电路图/波形实验室时（§07/§08 等），电路检查是必做项**：
   把每个场景×模式的断言注册进 `.check/circuit_check.py` 的 `PAGES`
   （轨迹必须真的压到自己画的阈值线且不越界、关键连线/抽头位置用游程断言、
   ⏸ 暂停必须真冻结画面），并在冒烟测试里补场景 readout 的数值/单位断言；
   然后跑 `python3 .check/verify_all.py <page>`，一条命令串完 结构 → node --check → 冒烟 → 电路检查，
   全绿才算交付。canvas 电路图的 8 类典型错误（电池极性画反、导线端点不落引脚、
   栅极参考接错、负载无回路、抽头从电阻身上引、波形模型碰不到自己的阈值线、
   电流动画方向反、回路缺口/导线短路器件）见项目记忆 hw-basic-site-conventions。
6. **canvas 读数/标注里的物理量禁止硬编码，必须与模型参数对账**：
   读数栏的 τ、f、Q、V 等一律由模型常量计算生成（`(R*C*1e3).toFixed(0)+' ms'`），
   不要手写 `"τ = RC = 100 µs"` 这类字面量——曾因手写单位差过 1000 倍而全部自动化关卡放行。
   hero 等封闭 IIFE 动画的读数也要纳入冒烟：rAF 用队列式 stub + 末段泵帧，
   ctxProxy 记录 `fillText` 后，从画面标注（"R = 1k" "C = 100µF"）解析参数
   断言读数 τ=RC、Q=C·V 逐帧一致（范例见 `.check/capacitor_smoke_test.js` hero 段）。
   所画拓扑必须支撑所算行为：常驻直流源旁边不能出现周期性放电反向电流——
   周期充放电要画方波源（低电平=0V 短接）或开关，源电平随状态切换显示。

## 交付报告格式

```
FILE: docs/<proto>.html
TITLE: <h1> 页面标题
CARD: <40–60 字首页卡片描述，仿 index.html 现有卡片文案：一句话卖点 + 涵盖的关键交互点>
DEMO: <3–5 条核心交互点>
ISSUES: <遗留问题，没有写"无">
```
