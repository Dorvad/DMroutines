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
   PDF Export — one routine per A4 page via html2canvas
   ============================================================ */

function buildCardElement(routine, index, total) {
  const colors = {
    bg: '#FFFFFF',
    ink: '#0A0908',
    ink2: '#2A2723',
    ink3: '#6A6660',
    ink4: '#A19D95',
    accent: '#C8102E',
    accentTint: '#FBE7EA',
    line: '#E5E2D9',
    lineStrong: '#C8C3B7',
    surface2: '#F8F7F2',
    marker: '#FFD23F',
  };

  const el = document.createElement('div');
  el.style.cssText = `
    width: 1120px;
    background: ${colors.bg};
    font-family: Heebo, Arial, sans-serif;
    direction: rtl;
    text-align: right;
    box-sizing: border-box;
    padding: 0;
    position: fixed;
    left: -9999px;
    top: 0;
  `;

  el.innerHTML = `
    <div style="
      border-top: 4px solid ${colors.ink};
      border-left: 4px solid ${colors.ink};
      border-right: 4px solid ${colors.ink};
      border-bottom: 4px solid ${colors.ink};
      background: ${colors.bg};
      height: 794px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    ">
      <!-- Header bar -->
      <div style="
        background: ${colors.ink};
        color: #F6F4EE;
        padding: 20px 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      ">
        <div style="
          font-family: JetBrains Mono, monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(246,244,238,0.55);
          font-weight: 500;
        ">לוח שגרות · Worksheet · DELEK MOTORS</div>
        <div style="
          font-family: JetBrains Mono, monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(246,244,238,0.55);
          font-weight: 600;
        ">שגרה ${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</div>
      </div>

      <!-- Accent line -->
      <div style="height: 4px; background: ${colors.accent}; flex-shrink: 0;"></div>

      <!-- Main content -->
      <div style="
        flex: 1;
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 0;
        overflow: hidden;
      ">
        <!-- Left column: name + goal + content -->
        <div style="
          padding: 40px 48px 36px;
          border-left: 1px solid ${colors.line};
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow: hidden;
        ">
          <div>
            <div style="
              font-family: JetBrains Mono, monospace;
              font-size: 10px;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: ${colors.ink4};
              font-weight: 600;
              margin-bottom: 10px;
            ">שגרה ניהולית</div>
            <div style="
              font-size: 36px;
              font-weight: 800;
              letter-spacing: -0.025em;
              line-height: 1.05;
              color: ${colors.ink};
            ">${routine.name || '—'}</div>
          </div>

          <div>
            <div style="
              font-family: JetBrains Mono, monospace;
              font-size: 10px;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: ${colors.accent};
              font-weight: 600;
              margin-bottom: 8px;
            ">מטרה</div>
            <div style="
              font-size: 15px;
              color: ${colors.ink2};
              line-height: 1.55;
              font-weight: 500;
            ">${routine.goal || '—'}</div>
          </div>

          <div style="
            flex: 1;
            background: ${colors.surface2};
            border-radius: 8px;
            padding: 20px 24px;
            overflow: hidden;
          ">
            <div style="
              font-family: JetBrains Mono, monospace;
              font-size: 10px;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: ${colors.ink4};
              font-weight: 600;
              margin-bottom: 10px;
            ">התוכן הרלוונטי</div>
            <div style="
              font-size: 14px;
              color: ${colors.ink3};
              line-height: 1.6;
            ">${routine.content || '—'}</div>
          </div>
        </div>

        <!-- Right column: metadata -->
        <div style="
          padding: 40px 36px 36px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: ${colors.surface2};
        ">
          ${[
            { label: 'תזמון ומשך', value: routine.timing },
            { label: 'הפורום', value: routine.forum },
            { label: 'הכנות / טכנולוגיה', value: routine.prep },
            { label: 'מדד הצלחה', value: routine.metric },
          ].map((f) => `
            <div>
              <div style="
                font-family: JetBrains Mono, monospace;
                font-size: 9px;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: ${colors.ink4};
                font-weight: 600;
                margin-bottom: 6px;
              ">${f.label}</div>
              <div style="
                font-size: 13px;
                color: ${colors.ink2};
                line-height: 1.5;
                font-weight: 400;
              ">${f.value || '—'}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  return el;
}

export async function exportPDF(routines) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = pdf.internal.pageSize.getWidth();  // 297mm
  const H = pdf.internal.pageSize.getHeight(); // 210mm

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
        width: 1120,
        height: 794,
        windowWidth: 1120,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.93);
      const imgAspect = canvas.height / canvas.width;
      const imgH = W * imgAspect;

      if (imgH <= H) {
        pdf.addImage(imgData, 'JPEG', 0, (H - imgH) / 2, W, imgH);
      } else {
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
   PPTX Export — one slide per routine
   ============================================================ */

export async function exportPPTX(routines) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  routines.forEach((r, i) => {
    const slide = pptx.addSlide();
    slide.background = { color: '0A0908' };

    // Red accent bar on right edge
    slide.addShape(pptx.ShapeType.rect, {
      x: 9.5, y: 0, w: 0.5, h: 5.625,
      fill: { color: 'C8102E' },
      line: { color: 'C8102E' },
    });

    // Slide number / eyebrow
    slide.addText(
      `שגרה ${String(i + 1).padStart(2, '0')} · ${String(routines.length).padStart(2, '0')} סה״כ`,
      {
        x: 0.4, y: 0.3, w: 5.5, h: 0.35,
        fontSize: 10, color: 'A19D95',
        fontFace: 'Arial', align: 'right', rtlMode: true,
        bold: false,
      }
    );

    // Divider line visual — thin rect
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.4, y: 0.75, w: 5.5, h: 0.02,
      fill: { color: '2A2723' },
      line: { color: '2A2723' },
    });

    // Routine name (title)
    slide.addText(r.name || `שגרה ${i + 1}`, {
      x: 0.4, y: 0.9, w: 5.5, h: 1.5,
      fontSize: 36, bold: true, color: 'F6F4EE',
      fontFace: 'Arial', align: 'right', rtlMode: true,
      valign: 'top',
    });

    // Goal label
    slide.addText('מטרה', {
      x: 0.4, y: 2.55, w: 5.5, h: 0.28,
      fontSize: 8, color: 'C8102E',
      fontFace: 'Arial', align: 'right', rtlMode: true,
      bold: true, charSpacing: 3,
    });

    // Goal value
    slide.addText(r.goal || '—', {
      x: 0.4, y: 2.88, w: 5.5, h: 0.55,
      fontSize: 13, color: 'F6F4EE',
      fontFace: 'Arial', align: 'right', rtlMode: true,
    });

    // Content label
    slide.addText('התוכן הרלוונטי', {
      x: 0.4, y: 3.55, w: 5.5, h: 0.28,
      fontSize: 8, color: 'A19D95',
      fontFace: 'Arial', align: 'right', rtlMode: true,
      bold: true, charSpacing: 3,
    });

    // Content value
    slide.addText(r.content || '—', {
      x: 0.4, y: 3.88, w: 5.5, h: 1.2,
      fontSize: 11, color: 'C8C3B7',
      fontFace: 'Arial', align: 'right', rtlMode: true,
      valign: 'top',
    });

    // Right metadata column background
    slide.addShape(pptx.ShapeType.rect, {
      x: 6.2, y: 0, w: 3.3, h: 5.625,
      fill: { color: '111110' },
      line: { color: '111110' },
    });

    // Metadata fields
    const metaFields = [
      { label: 'תזמון ומשך',         value: r.timing },
      { label: 'הפורום',             value: r.forum },
      { label: 'הכנות / טכנולוגיה', value: r.prep },
      { label: 'מדד הצלחה',         value: r.metric },
    ];

    metaFields.forEach((f, fi) => {
      const baseY = 0.55 + fi * 1.2;
      slide.addText(f.label, {
        x: 6.3, y: baseY, w: 3.0, h: 0.28,
        fontSize: 8, color: 'A19D95',
        fontFace: 'Arial', align: 'right', rtlMode: true,
        bold: true, charSpacing: 2,
      });
      slide.addText(f.value || '—', {
        x: 6.3, y: baseY + 0.32, w: 3.0, h: 0.7,
        fontSize: 11, color: 'F6F4EE',
        fontFace: 'Arial', align: 'right', rtlMode: true,
        valign: 'top',
      });
    });

    // Footer
    slide.addText('DELEK MOTORS  ·  לוח שגרות Worksheet  ·  2026', {
      x: 0, y: 5.35, w: 9.5, h: 0.28,
      fontSize: 7, color: '4A4743',
      fontFace: 'Arial', align: 'center',
    });
  });

  await pptx.writeFile({ fileName: 'routine-board.pptx' });
}
