import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import pptxgen from 'pptxgenjs';

/* ============================================================
   CSV Export
   ============================================================ */

export function exportCSV(routines) {
  const cols = [
    { key: 'name',    label: 'שגרה ניהולית' },
    { key: 'forum',   label: 'הפורום' },
    { key: 'content', label: 'התוכן הרלוונטי' },
    { key: 'timing',  label: 'תזמון ומשך' },
    { key: 'prep',    label: 'הכנות / טכנולוגיה' },
    { key: 'goal',    label: 'מטרה' },
    { key: 'metric',  label: 'מדד הצלחה' },
  ];
  const esc = (v) => `"${(v || '').replace(/"/g, '""')}"`;
  const rows = [
    ['שגרה', ...cols.map((c) => c.label)],
    ...routines.map((r, i) => [`שגרה ${i + 1}`, ...cols.map((c) => r[c.key] || '')]),
  ];
  // UTF-8 BOM ensures Hebrew opens correctly in Excel
  const csv = '﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: 'routine-board.csv',
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ============================================================
   PDF Export — one A4 landscape page per routine
   ============================================================ */

function buildCardElement(routine, index, total) {
  const c = {
    bg: '#FFFFFF',
    ink: '#0A0908',
    ink2: '#2A2723',
    ink3: '#6A6660',
    ink4: '#A19D95',
    accent: '#C8102E',
    line: '#E5E2D9',
    surface2: '#F4F2EC',
  };

  const wrap = document.createElement('div');
  wrap.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 1122px;
    height: 794px;
    overflow: hidden;
    background: ${c.bg};
    font-family: 'Heebo', Arial, sans-serif;
    direction: rtl;
    text-align: right;
    box-sizing: border-box;
  `;

  wrap.innerHTML = `
    <div style="width:1122px;height:794px;display:flex;flex-direction:column;box-sizing:border-box;border:3px solid ${c.ink};">

      <!-- Top bar -->
      <div style="background:${c.ink};padding:16px 48px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(246,244,238,0.5);font-weight:600;">לוח שגרות · Worksheet · DELEK MOTORS</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(246,244,238,0.5);font-weight:600;">שגרה ${String(index + 1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span>
      </div>

      <!-- Red accent line -->
      <div style="height:4px;background:${c.accent};flex-shrink:0;"></div>

      <!-- Content area -->
      <div style="flex:1;display:grid;grid-template-columns:1fr 320px;overflow:hidden;">

        <!-- Left: name + goal + content -->
        <div style="padding:36px 44px;display:flex;flex-direction:column;gap:18px;border-left:1px solid ${c.line};overflow:hidden;">
          <div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${c.ink4};font-weight:600;margin-bottom:8px;">שגרה ניהולית</div>
            <div style="font-size:34px;font-weight:800;letter-spacing:-0.025em;line-height:1.05;color:${c.ink};">${escHtml(routine.name) || '—'}</div>
          </div>
          <div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${c.accent};font-weight:600;margin-bottom:6px;">מטרה</div>
            <div style="font-size:15px;color:${c.ink2};line-height:1.55;font-weight:500;">${escHtml(routine.goal) || '—'}</div>
          </div>
          <div style="flex:1;background:${c.surface2};border-radius:8px;padding:18px 22px;overflow:hidden;">
            <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${c.ink4};font-weight:600;margin-bottom:8px;">התוכן הרלוונטי</div>
            <div style="font-size:13px;color:${c.ink3};line-height:1.6;">${escHtml(routine.content) || '—'}</div>
          </div>
        </div>

        <!-- Right: metadata -->
        <div style="padding:36px 32px;display:flex;flex-direction:column;gap:22px;background:${c.surface2};">
          ${[
            { label: 'תזמון ומשך',         value: routine.timing },
            { label: 'הפורום',             value: routine.forum },
            { label: 'הכנות / טכנולוגיה', value: routine.prep },
            { label: 'מדד הצלחה',         value: routine.metric },
          ].map(f => `
            <div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:${c.ink4};font-weight:600;margin-bottom:5px;">${f.label}</div>
              <div style="font-size:12px;color:${c.ink2};line-height:1.5;">${escHtml(f.value) || '—'}</div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;

  return wrap;
}

function escHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function exportPDF(routines) {
  // Wait for fonts to be ready before capturing
  await document.fonts.ready;

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = pdf.internal.pageSize.getWidth();   // 297mm landscape
  const H = pdf.internal.pageSize.getHeight();  // 210mm landscape

  for (let i = 0; i < routines.length; i++) {
    if (i > 0) pdf.addPage();

    const el = buildCardElement(routines[i], i, routines.length);
    document.body.appendChild(el);

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        width: 1122,
        height: 794,
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.93);
      // Fit the captured image into the A4 landscape page
      const imgAspect = canvas.height / canvas.width;
      const imgH = W * imgAspect;

      if (imgH <= H) {
        // Image fits on one page — center vertically
        pdf.addImage(imgData, 'JPEG', 0, (H - imgH) / 2, W, imgH);
      } else {
        // Scale to fit height
        const scaledW = H / imgAspect;
        pdf.addImage(imgData, 'JPEG', (W - scaledW) / 2, 0, scaledW, H);
      }
    } finally {
      document.body.removeChild(el);
    }
  }

  pdf.save('routine-board.pdf');
}

/* ============================================================
   PPTX Export — one slide per routine, dark executive theme
   ============================================================ */

export async function exportPPTX(routines) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';  // 10" × 5.625"

  // Resolved at runtime — pptxgen instance exposes ShapeType
  const RECT = pptx.ShapeType ? pptx.ShapeType.rect : 'rect';

  routines.forEach((r, idx) => {
    const slide = pptx.addSlide();
    slide.background = { color: '0A0908' };

    // Red accent bar on right edge
    slide.addShape(RECT, {
      x: 9.45, y: 0, w: 0.55, h: 5.625,
      fill: { color: 'C8102E' },
      line: { color: 'C8102E', width: 0 },
    });

    // Dark metadata column background (right side, before the accent bar)
    slide.addShape(RECT, {
      x: 6.1, y: 0, w: 3.35, h: 5.625,
      fill: { color: '111110' },
      line: { color: '111110', width: 0 },
    });

    // Eyebrow — slide number
    slide.addText(
      `שגרה ${String(idx + 1).padStart(2, '0')} · ${String(routines.length).padStart(2, '0')} סה"כ · DELEK MOTORS`,
      {
        x: 0.35, y: 0.28, w: 5.6, h: 0.32,
        fontSize: 9, color: 'A19D95',
        fontFace: 'Arial', align: 'right', rtlMode: true,
      }
    );

    // Divider line
    slide.addShape(RECT, {
      x: 0.35, y: 0.68, w: 5.6, h: 0.02,
      fill: { color: '2A2723' },
      line: { color: '2A2723', width: 0 },
    });

    // Routine name (large title)
    slide.addText(r.name || `שגרה ${idx + 1}`, {
      x: 0.35, y: 0.82, w: 5.6, h: 1.5,
      fontSize: 32, bold: true, color: 'F6F4EE',
      fontFace: 'Arial', align: 'right', rtlMode: true,
      valign: 'top',
    });

    // Goal label
    slide.addText('מטרה', {
      x: 0.35, y: 2.45, w: 5.6, h: 0.25,
      fontSize: 8, color: 'C8102E',
      fontFace: 'Arial', align: 'right', rtlMode: true,
      bold: true,
    });

    // Goal value
    slide.addText(r.goal || '—', {
      x: 0.35, y: 2.74, w: 5.6, h: 0.52,
      fontSize: 13, color: 'F6F4EE',
      fontFace: 'Arial', align: 'right', rtlMode: true,
    });

    // Content label
    slide.addText('התוכן הרלוונטי', {
      x: 0.35, y: 3.38, w: 5.6, h: 0.25,
      fontSize: 8, color: 'A19D95',
      fontFace: 'Arial', align: 'right', rtlMode: true,
      bold: true,
    });

    // Content value
    slide.addText(r.content || '—', {
      x: 0.35, y: 3.67, w: 5.6, h: 1.55,
      fontSize: 11, color: 'C8C3B7',
      fontFace: 'Arial', align: 'right', rtlMode: true,
      valign: 'top',
    });

    // Metadata fields in right column
    const meta = [
      { label: 'תזמון ומשך',         value: r.timing },
      { label: 'הפורום',             value: r.forum },
      { label: 'הכנות / טכנולוגיה', value: r.prep },
      { label: 'מדד הצלחה',         value: r.metric },
    ];

    meta.forEach((m, mi) => {
      const yBase = 0.45 + mi * 1.18;
      slide.addText(m.label, {
        x: 6.2, y: yBase, w: 3.05, h: 0.26,
        fontSize: 8, color: 'A19D95',
        fontFace: 'Arial', align: 'right', rtlMode: true,
        bold: true,
      });
      slide.addText(m.value || '—', {
        x: 6.2, y: yBase + 0.3, w: 3.05, h: 0.7,
        fontSize: 11, color: 'F6F4EE',
        fontFace: 'Arial', align: 'right', rtlMode: true,
        valign: 'top',
      });
    });

    // Footer
    slide.addText('DELEK MOTORS  ·  לוח שגרות Worksheet  ·  2026', {
      x: 0, y: 5.33, w: 9.45, h: 0.28,
      fontSize: 7, color: '4A4743',
      fontFace: 'Arial', align: 'center',
    });
  });

  await pptx.writeFile({ fileName: 'routine-board.pptx' });
}
