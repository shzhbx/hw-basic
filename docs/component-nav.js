/* ============================================================
   component-nav.js — 全站器件抽屉导航
   新增器件页时只需在 COMPONENTS 里加一项，全部页面同步生效。
   ============================================================ */
(function () {
  'use strict';

  var COMPONENTS = [
    { group: '无源元件', items: [
      ['resistor.html', '电阻'],
      ['capacitor.html', '电容'],
      ['inductor.html', '电感']
    ]},
    { group: '分立半导体', items: [
      ['diode.html', '二极管'],
      ['transistor.html', '三极管'],
      ['mosfet.html', 'MOSFET']
    ]},
    { group: '集成电路', items: [
      ['opamp.html', '运算放大器']
    ]},
    { group: '电源与储能', items: [
      ['battery.html', '电池']
    ]},
    { group: '机电与连接', items: [
      ['speaker.html', '扬声器/蜂鸣器']
    ]},
    { group: '显示与指示', items: [
      ['sevenseg.html', '数码管']
    ]}
  ];

  var CSS = [
    /* 按主题变量自适应各页配色，缺省值兜底 */
    '#pnav-drawer{--pa:var(--ph,var(--green,var(--sda,#3ce08e)));',
    '  --pam:var(--amber,#f0b35c);--pl:var(--line,var(--line2,#263730));--pd:var(--dim,var(--mut,#a9bfb2))}',

    '.pnav-open{font-family:var(--mono,ui-monospace,Menlo,Consolas,monospace);font-size:11px;',
    '  letter-spacing:.1em;color:var(--pa,#3ce08e);background:rgba(60,224,142,.07);',
    '  border:1px solid rgba(60,224,142,.35);padding:6px 12px;border-radius:5px;cursor:pointer;',
    '  white-space:nowrap;transition:background .18s,border-color .18s}',
    '.pnav-open:hover{background:rgba(60,224,142,.16);border-color:rgba(60,224,142,.6)}',

    '#pnav-mask{position:fixed;inset:0;background:rgba(3,7,6,.62);backdrop-filter:blur(3px);',
    '  z-index:9998;opacity:0;pointer-events:none;transition:opacity .25s}',
    '#pnav-mask.on{opacity:1;pointer-events:auto}',

    '#pnav-drawer{position:fixed;top:0;right:0;bottom:0;width:min(360px,90vw);z-index:9999;',
    '  background:#0a0f0d;color:var(--pd);border-left:1px solid rgba(60,224,142,.18);',
    '  box-shadow:-24px 0 60px rgba(0,0,0,.55);display:flex;flex-direction:column;',
    '  transform:translateX(103%);visibility:hidden;',
    '  transition:transform .28s cubic-bezier(.2,.85,.25,1),visibility .28s}',
    '#pnav-drawer.on{transform:none;visibility:visible}',
    'html.pnav-lock,html.pnav-lock body{overflow:hidden}',

    '.pnav-head{display:flex;align-items:center;justify-content:space-between;',
    '  padding:15px 18px 12px;border-bottom:1px solid rgba(60,224,142,.14)}',
    '.pnav-title{font-family:var(--mono,ui-monospace,Menlo,Consolas,monospace);font-size:11px;',
    '  letter-spacing:.26em;color:#8fa89a}',
    '.pnav-close{font-family:var(--mono,ui-monospace,Menlo,Consolas,monospace);font-size:12px;',
    '  color:var(--pd);background:none;border:1px solid var(--pl);border-radius:5px;',
    '  padding:5px 10px;cursor:pointer;transition:color .18s,border-color .18s}',
    '.pnav-close:hover{color:var(--pa);border-color:rgba(60,224,142,.5)}',

    '.pnav-home{display:block;margin:14px 18px 0;padding:9px 12px;',
    '  font-family:var(--mono,ui-monospace,Menlo,Consolas,monospace);font-size:11.5px;letter-spacing:.08em;',
    '  color:var(--pam);border:1px solid rgba(240,179,92,.35);border-radius:5px;text-decoration:none;',
    '  transition:background .18s}',
    '.pnav-home:hover{background:rgba(240,179,92,.1);text-decoration:none}',

    '.pnav-body{flex:1;overflow-y:auto;padding:4px 18px 30px;',
    '  padding-bottom:calc(30px + env(safe-area-inset-bottom))}',
    '.pnav-body::-webkit-scrollbar{width:5px}',
    '.pnav-body::-webkit-scrollbar-thumb{background:#22302a;border-radius:3px}',
    '.pnav-g{margin-top:18px}',
    '.pnav-g h4{margin:0 0 9px;font-family:var(--mono,ui-monospace,Menlo,Consolas,monospace);',
    '  font-size:10px;font-weight:600;letter-spacing:.26em;color:#6f8a7c}',
    '.pnav-items{display:flex;flex-wrap:wrap;gap:6px}',
    '.pnav-items a{font-family:var(--mono,ui-monospace,Menlo,Consolas,monospace);font-size:11.5px;',
    '  letter-spacing:.04em;color:var(--pd);text-decoration:none;border:1px solid var(--pl);',
    '  padding:6px 11px;border-radius:5px;transition:color .18s,border-color .18s,background .18s}',
    '.pnav-items a:hover{color:var(--pa);border-color:rgba(60,224,142,.55);background:rgba(60,224,142,.07)}',
    '.pnav-items a.cur{color:#07130c;background:var(--pa);border-color:var(--pa);font-weight:700;cursor:default}'
  ].join('\n');

  function buildDrawer() {
    var here = location.pathname.split('/').pop();

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var mask = document.createElement('div');
    mask.id = 'pnav-mask';

    var d = document.createElement('aside');
    d.id = 'pnav-drawer';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-label', '全部器件导航');
    d.setAttribute('aria-hidden', 'true');

    var html = [
      '<div class="pnav-head">',
      '  <span class="pnav-title">全部器件 / COMPONENTS</span>',
      '  <button class="pnav-close" aria-label="关闭导航">✕ ESC</button>',
      '</div>',
      '<a class="pnav-home" href="index.html">« 返回主页</a>',
      '<div class="pnav-body">'
    ];
    COMPONENTS.forEach(function (g) {
      if (!g.items.length) return;
      html.push('<div class="pnav-g"><h4>' + g.group + '</h4><div class="pnav-items">');
      g.items.forEach(function (it) {
        var cls = it[0] === here ? ' class="cur" title="当前页面"' : '';
        html.push('<a href="' + it[0] + '"' + cls + '>' + it[1] + '</a>');
      });
      html.push('</div></div>');
    });
    html.push('</div>');
    d.innerHTML = html.join('\n');

    document.body.appendChild(mask);
    document.body.appendChild(d);
    return { mask: mask, drawer: d };
  }

  function init() {
    var btn = document.querySelector('.pnav-open');
    if (!btn) return;

    var ui = buildDrawer();
    var mask = ui.mask, d = ui.drawer;
    var closeBtn = d.querySelector('.pnav-close');

    function open() {
      mask.classList.add('on');
      d.classList.add('on');
      d.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('pnav-lock');
      closeBtn.focus();
    }
    function close() {
      mask.classList.remove('on');
      d.classList.remove('on');
      d.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('pnav-lock');
      if (d.contains(document.activeElement)) btn.focus();
    }
    function toggle() {
      d.classList.contains('on') ? close() : open();
    }

    btn.setAttribute('aria-haspopup', 'dialog');
    btn.addEventListener('click', toggle);
    closeBtn.addEventListener('click', close);
    mask.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && d.classList.contains('on')) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
