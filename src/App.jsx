import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  IcArrowLeft, IcArrowRight, IcChevRight, IcChevLeft, IcChevUp, IcChevDown,
  IcClose, IcCheck, IcDownload, IcEye, IcGrid, IcRows, IcColumns, IcClock,
  IcTable, IcSlides, IcDoc, IcSpark, IcPlay, IcSettings,
} from './icons.jsx';
import { exportPDF, exportPPTX, exportCSV } from './exportUtils.js';
import './styles.css';

/* =========================================================
   Data
   ========================================================= */

const FIELDS = [
  { key: "name",     label: "שגרה ניהולית",   long: false },
  { key: "forum",    label: "הפורום",           long: true  },
  { key: "content",  label: "התוכן הרלוונטי",   long: true  },
  { key: "timing",   label: "תזמון ומשך",       long: false },
  { key: "prep",     label: "הכנות / טכנולוגיה", long: false },
  { key: "goal",     label: "מטרה",             long: false },
  { key: "metric",   label: "מדד הצלחה",        long: true  },
];

const EMPTY = { name: "", forum: "", content: "", timing: "", prep: "", goal: "", metric: "" };

// Exact original copy — "סרקו את הברקוד" line removed per user direction.
const INSTRUCTIONS = [
  "התחלקו לקבוצות",
  "הגדירו 2-3 שגרות שאתם מאמצים כנבחרת הנהלה בכירה כדי לחזק את הסנכרון והביצוע:",
  "השתמשו בניתוח ה-STAR והפרופיל הצוותי כדי לבחור שגרות שיגשרו על הפערים שזיהינו.",
  "בסיום הורידו כקובץ PDF.",
  "כל קבוצה תציג את התוצר שלה במליאה.",
];


const PROGRESS_STEPS = [
  { id: "opening", label: "פתיחה" },
  { id: "filling", label: "מילוי" },
  { id: "result",  label: "תוצר" },
  { id: "export",  label: "ייצוא" },
];

const STORAGE_KEY = 'dmroutines_v1';

/* =========================================================
   Brand mark
   ========================================================= */

function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark" aria-label="Delek Motors">
        <span className="bm-bar" />
        <span className="bm-letters">DM</span>
      </div>
      <div className="brand-divider" />
      <div className="brand-name">
        <span>לוח שגרות</span>
        <span className="tagline">Worksheet</span>
      </div>
    </div>
  );
}

/* =========================================================
   Progress
   ========================================================= */

function ProgressBar({ current, onGo }) {
  const curIdx = PROGRESS_STEPS.findIndex(x => x.id === current);
  return (
    <div className="progress" role="tablist">
      {PROGRESS_STEPS.map((s, i) => {
        const state = i < curIdx ? "done" : i === curIdx ? "active" : "";
        return (
          <React.Fragment key={s.id}>
            <button
              role="tab"
              className={`progress-step ${state}`}
              onClick={() => onGo && onGo(s.id)}
            >
              <span className="num">0{i + 1}</span>
              <span className="dot" />
              {s.label}
            </button>
            {i < PROGRESS_STEPS.length - 1 && <span className="progress-connector" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* =========================================================
   Opening screen
   ========================================================= */

function OpeningScreen({ onStart }) {
  return (
    <main className="screen">
      <div className="shell">
        <div className="opening-grid">
          <section className="opening-hero">
            <span className="eyebrow"><span className="pip" />סדנת נבחרת הנהלה · דלק מוטורס</span>
            <h1>
              <span className="mark">לוח שגרות</span>
              <span className="latin">Worksheet · Personal Edition</span>
            </h1>
            <p className="opening-lede">
              דף עבודה אישי לאיפיון השגרות הניהוליות שאתם מאמצים כנבחרת ההנהלה הבכירה — מילוי בנוח, תצוגה בכמה אופנים, וייצוא מקצועי לפני ההצגה במליאה.
            </p>
            <div className="opening-cta-row">
              <button className="btn btn-primary btn-lg" onClick={onStart}>
                התחילו למלא
                <IcArrowLeft size={18} className="arr" />
              </button>
            </div>
            <div className="meta-row">
              <div><span className="k">משך מוערך</span><span className="v">10–15 דקות</span></div>
              <div><span className="k">מספר שגרות</span><span className="v">2–3</span></div>
              <div><span className="k">תוצרים</span><span className="v">PDF · PPTX · CSV</span></div>
            </div>
          </section>

          <aside className="opening-aside">
            <article className="instruction-card">
              <header className="ic-header">
                <div className="ic-title">הוראות דף העבודה</div>
                <span className="ic-tag"><IcDoc size={11} /> Worksheet</span>
              </header>

              <ol className="ic-list">
                <li><span>{INSTRUCTIONS[0]}</span></li>
                <li><span>{INSTRUCTIONS[1]}</span></li>
                <li><span className="hl">{INSTRUCTIONS[2]}</span></li>
                <li><span>בסיום הורידו כקובץ <span className="pdf-pill">PDF</span></span></li>
                <li><span>{INSTRUCTIONS[4]}</span></li>
              </ol>

              <div className="brand-strip">
                <span className="bs-label">נבחרת ההנהלה</span>
                <span className="bs-chip">Executive</span>
                <span className="bs-chip">2026</span>
                <span className="bs-chip">v1.0</span>
              </div>
            </article>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   Field
   ========================================================= */

function Field({ field, value, onChange, fullWidth = false }) {
  return (
    <div className={"field " + (fullWidth ? "full" : "")}>
      <label className="field-label">{field.label}</label>
      {field.long ? (
        <textarea
          className="field-area"
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={field.key === "content" ? 3 : 2}
        />
      ) : (
        <input
          className="field-input"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/* =========================================================
   Filling screen
   ========================================================= */

function completionOf(r) {
  const filled = FIELDS.filter(f => (r[f.key] || "").trim()).length;
  return { filled, total: FIELDS.length, pct: Math.round((filled / FIELDS.length) * 100) };
}

function FillingScreen({ routines, setRoutines, active, setActive, onShowResult }) {
  const r = routines[active];
  const updateField = (key, val) => {
    setRoutines(rs => rs.map((x, i) => i === active ? { ...x, [key]: val } : x));
  };

  const comp = completionOf(r);

  return (
    <main className="screen">
      <div className="shell">
        <header className="section-head">
          <div>
            <span className="eyebrow"><span className="pip" />מילוי אישי · שגרה {active + 1} מתוך 3</span>
            <h2>בנו את לוח השגרות שלכם</h2>
            <p>מלאו כל שגרה בנפרד. אפשר לעבור בין הטאבים בכל עת.</p>
          </div>
          <div className="result-actions">
            <button className="btn btn-primary" onClick={onShowResult}>
              הצג תוצר <IcArrowLeft size={16} className="arr" />
            </button>
          </div>
        </header>

        <nav className="routine-tabs" role="tablist" style={{marginBottom: 24}}>
          {routines.map((rt, i) => {
            const c = completionOf(rt);
            return (
              <button key={i}
                role="tab"
                className={`routine-tab ${i === active ? "active" : ""}`}
                style={{ "--p": c.pct }}
                onClick={() => setActive(i)}>
                <span className="ring" />
                <span className="num">0{i + 1}</span>
                שגרה {i + 1}
              </button>
            );
          })}
        </nav>

        <article className="editor-card fade-swap" key={active}>
          <div className="editor-tabline">
            <span className="pin" />
            <span className="routine-mono">שגרה {String(active + 1).padStart(2, "0")} · עריכה</span>
            <div className="completion">
              <span>{comp.filled} / {comp.total}</span>
              <div className="dots">
                {FIELDS.map((f) => (
                  <span key={f.key} className={"d " + ((r[f.key] || "").trim() ? "on" : "")} />
                ))}
              </div>
            </div>
          </div>

          <div className="fields-grid">
            <Field field={FIELDS[0]} value={r.name} onChange={(v) => updateField("name", v)} fullWidth />
            <Field field={FIELDS[1]} value={r.forum} onChange={(v) => updateField("forum", v)} />
            <Field field={FIELDS[2]} value={r.content} onChange={(v) => updateField("content", v)} />
            <Field field={FIELDS[3]} value={r.timing} onChange={(v) => updateField("timing", v)} />
            <Field field={FIELDS[4]} value={r.prep} onChange={(v) => updateField("prep", v)} />
            <Field field={FIELDS[5]} value={r.goal} onChange={(v) => updateField("goal", v)} />
            <Field field={FIELDS[6]} value={r.metric} onChange={(v) => updateField("metric", v)} fullWidth />
          </div>

          <div className="editor-footer">
            <div className="nav">
              <button className="icon-btn" disabled={active === 0}
                onClick={() => setActive(active - 1)} aria-label="שגרה קודמת">
                <IcChevRight size={14} />
              </button>
              <span className="of">{active + 1} / {routines.length}</span>
              <button className="icon-btn" disabled={active === routines.length - 1}
                onClick={() => setActive(active + 1)} aria-label="שגרה הבאה">
                <IcChevLeft size={14} />
              </button>
            </div>
            <button className="btn btn-soft btn-sm"
              onClick={() => setRoutines(rs => rs.map((x, i) => i === active ? { ...EMPTY } : x))}>
              ניקוי שגרה
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}

/* =========================================================
   Display mode tabs
   ========================================================= */

const DISPLAY_MODES = [
  { id: "cards",        label: "כרטיסים", icon: IcRows },
  { id: "board",        label: "לוח",      icon: IcColumns },
  { id: "timeline",     label: "ציר זמן",  icon: IcClock },
  { id: "table",        label: "טבלה",     icon: IcTable },
  { id: "presentation", label: "מצגת",     icon: IcSlides },
];

function DisplayTabs({ mode, setMode }) {
  return (
    <div className="display-tabs" role="tablist">
      {DISPLAY_MODES.map(m => {
        const Ic = m.icon;
        return (
          <button key={m.id}
            role="tab"
            className={`display-tab ${mode === m.id ? "active" : ""}`}
            onClick={() => setMode(m.id)}>
            <Ic size={14} />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   Display mode views
   ========================================================= */

function MaybeEmpty({ v, ph = "—" }) {
  if (v && v.trim()) return v;
  return <span style={{color:"var(--ink-4)", fontStyle:"italic"}}>{ph}</span>;
}

function CardsView({ routines }) {
  return (
    <div className="cards-view">
      {routines.map((r, i) => (
        <article className="summary-card" key={i}>
          <div>
            <div className="sc-num">שגרה {String(i+1).padStart(2,"0")} / {String(routines.length).padStart(2,"0")}</div>
            <h3 className="sc-title"><MaybeEmpty v={r.name} ph="שגרה ניהולית" /></h3>
            <div>
              <span className="sc-goal"><MaybeEmpty v={r.goal} ph="מטרה" /></span>
            </div>
          </div>
          <div className="sc-content">
            <span className="sc-content-label">התוכן הרלוונטי</span>
            <MaybeEmpty v={r.content} />
          </div>
          <div className="sc-meta">
            <div><span className="k">תזמון ומשך</span><span className="v"><MaybeEmpty v={r.timing} /></span></div>
            <div><span className="k">הפורום</span><span className="v"><MaybeEmpty v={r.forum} /></span></div>
            <div><span className="k">הכנות / טכנולוגיה</span><span className="v"><MaybeEmpty v={r.prep} /></span></div>
            <div><span className="k">מדד הצלחה</span><span className="v"><MaybeEmpty v={r.metric} /></span></div>
          </div>
        </article>
      ))}
    </div>
  );
}

function BoardView({ routines }) {
  return (
    <div className="board-view">
      {routines.map((r, i) => (
        <article className="board-card" key={i}>
          <span className="bc-corner" />
          <header className="bc-header">
            <div className="bc-num">שגרה {String(i+1).padStart(2,"00")}</div>
            <h3 className="bc-title"><MaybeEmpty v={r.name} ph="שגרה ניהולית" /></h3>
            <span className="bc-when"><IcClock size={11} /><MaybeEmpty v={r.timing} ph="תזמון ומשך" /></span>
          </header>
          <div className="bc-body">
            <div className="bc-goal"><MaybeEmpty v={r.goal} ph="מטרה" /></div>
            <div className="bc-sections">
              <div>
                <div className="k">הפורום</div>
                <div className="v"><MaybeEmpty v={r.forum} /></div>
              </div>
              <div>
                <div className="k">התוכן הרלוונטי</div>
                <div className="v"><MaybeEmpty v={r.content} /></div>
              </div>
              <div>
                <div className="k">הכנות / טכנולוגיה</div>
                <div className="v"><MaybeEmpty v={r.prep} /></div>
              </div>
              <div>
                <div className="k">מדד הצלחה</div>
                <div className="v"><MaybeEmpty v={r.metric} /></div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function TimelineView({ routines }) {
  return (
    <div className="timeline-view">
      <span className="timeline-axis" />
      {routines.map((r, i) => (
        <div className="timeline-row" key={i}>
          <div className="tl-when">
            <span className="k">תזמון ומשך</span>
            <MaybeEmpty v={r.timing} ph="—" />
          </div>
          <div className="tl-body">
            <h3 className="tl-title"><MaybeEmpty v={r.name} ph="שגרה ניהולית" /></h3>
            <div className="tl-goal"><strong>מטרה </strong>· <MaybeEmpty v={r.goal} /></div>
            <div className="tl-content"><MaybeEmpty v={r.content} ph="התוכן הרלוונטי" /></div>
            <div className="tl-expand">
              <div><span className="k">הפורום</span><span className="v"><MaybeEmpty v={r.forum} /></span></div>
              <div><span className="k">הכנות / טכנולוגיה</span><span className="v"><MaybeEmpty v={r.prep} /></span></div>
              <div><span className="k">מדד הצלחה</span><span className="v"><MaybeEmpty v={r.metric} /></span></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Reordered per user feedback: שגרה ניהולית on the RIGHT (first in source = first column in RTL),
// מדד הצלחה on the LEFT (last column in RTL).
const TABLE_COLS = [
  { key: "name",    label: "שגרה ניהולית" },
  { key: "forum",   label: "הפורום" },
  { key: "content", label: "התוכן הרלוונטי" },
  { key: "timing",  label: "תזמון ומשך" },
  { key: "prep",    label: "הכנות / טכנולוגיה" },
  { key: "goal",    label: "מטרה" },
  { key: "metric",  label: "מדד הצלחה" },
];

function TableView({ routines }) {
  return (
    <div className="table-view scroll-x">
      <table className="routines-table">
        <thead>
          <tr>
            {TABLE_COLS.map(c => <th key={c.key}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {routines.map((r, i) => (
            <tr key={i}>
              {TABLE_COLS.map(c => (
                <td key={c.key}>
                  {c.key === "name" ? (
                    <>
                      <span className="routine-num">שגרה {String(i+1).padStart(2,"0")}</span>
                      <span className="routine-name"><MaybeEmpty v={r.name} ph="שגרה ניהולית" /></span>
                    </>
                  ) : (
                    <MaybeEmpty v={r[c.key]} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   Presentation
   ========================================================= */

function PresentationDeck({ routines, fullscreen, onExit }) {
  const [idx, setIdx] = useState(0);
  const safe = Math.min(idx, routines.length - 1);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setIdx(i => Math.min(routines.length - 1, i + 1));
      else if (e.key === "ArrowRight") setIdx(i => Math.max(0, i - 1));
      else if (e.key === "Escape") onExit && onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, routines.length, onExit]);

  const stage = (
    <div className="deck-stage-wrap">
      {routines.map((r, i) => (
        <section className={"slide " + (i === safe ? "active" : "")} key={i}>
          <div className="slide-body">
            <div>
              <div className="slide-eyebrow">
                <span className="acc">שגרה {String(i+1).padStart(2,"0")}</span>
                <span> · {String(routines.length).padStart(2,"0")} סה״כ · DELEK MOTORS</span>
              </div>
              <h2 className="slide-title"><MaybeEmpty v={r.name} ph="שגרה ניהולית" /></h2>
              <span className="slide-goal"><MaybeEmpty v={r.goal} ph="מטרה" /></span>
            </div>
            <div className="slide-content">
              <span className="k">התוכן הרלוונטי</span>
              <MaybeEmpty v={r.content} />
            </div>
          </div>
          <div className="slide-meta-row">
            <div><span className="k">תזמון ומשך</span><span className="v"><MaybeEmpty v={r.timing} /></span></div>
            <div><span className="k">הפורום</span><span className="v"><MaybeEmpty v={r.forum} /></span></div>
            <div><span className="k">הכנות / טכנולוגיה</span><span className="v"><MaybeEmpty v={r.prep} /></span></div>
            <div><span className="k">מדד הצלחה</span><span className="v"><MaybeEmpty v={r.metric} /></span></div>
          </div>
        </section>
      ))}
      <div className="deck-controls">
        <span className="deck-num">{String(safe+1).padStart(2,"0")} / {String(routines.length).padStart(2,"0")}</span>
        <div className="deck-nav">
          <button className="deck-btn" disabled={safe === 0}
            onClick={() => setIdx(i => Math.max(0, i - 1))} aria-label="קודם">
            <IcChevRight size={16} />
          </button>
          <button className="deck-btn" disabled={safe === routines.length - 1}
            onClick={() => setIdx(i => Math.min(routines.length - 1, i + 1))} aria-label="הבא">
            <IcChevLeft size={16} />
          </button>
        </div>
        {fullscreen
          ? <button className="deck-exit" onClick={onExit}>סיום מצגת</button>
          : <button className="deck-exit" onClick={onExit}><IcPlay size={11} /> מסך מלא</button>}
      </div>
    </div>
  );

  return fullscreen
    ? <div className="deck-fullscreen">{stage}</div>
    : stage;
}

/* =========================================================
   Result screen
   ========================================================= */

function ResultScreen({ routines, mode, setMode, onExport, onBack }) {
  const [fs, setFs] = useState(false);
  const visible = routines.filter(r => Object.values(r).some(v => v && v.trim()));
  const data = visible.length ? visible : routines;

  let body = null;
  if (mode === "cards") body = <CardsView routines={data} />;
  else if (mode === "board") body = <BoardView routines={data} />;
  else if (mode === "timeline") body = <TimelineView routines={data} />;
  else if (mode === "table") body = <TableView routines={data} />;
  else if (mode === "presentation") body = <PresentationDeck routines={data} fullscreen={false} onExit={() => setFs(true)} />;

  return (
    <main className="screen">
      <div className="shell">
        <header className="section-head">
          <div>
            <span className="eyebrow"><span className="pip" />תצוגה · {DISPLAY_MODES.find(d => d.id === mode)?.label}</span>
            <h2>התוצר שלי</h2>
            <p>בחרו אופן תצוגה — אותו המידע, חמש שפות הצגה שונות.</p>
          </div>
          <div className="result-actions">
            <button className="btn btn-soft" onClick={onBack}>
              <IcChevRight size={14} /> חזרה למילוי
            </button>
            <button className="btn btn-accent" onClick={onExport}>
              <IcDownload size={16} /> ייצוא התוצר
            </button>
          </div>
        </header>

        <div style={{marginBottom: 24}}>
          <DisplayTabs mode={mode} setMode={setMode} />
        </div>

        <section className="view-frame" key={mode}>
          <span className="doc-tag">{DISPLAY_MODES.find(d => d.id === mode)?.label} · תצוגה</span>
          {body}
        </section>

        {fs && mode === "presentation" && (
          <PresentationDeck routines={data} fullscreen={true} onExit={() => setFs(false)} />
        )}
      </div>
    </main>
  );
}

/* =========================================================
   Export panel
   ========================================================= */

function ExportPanel({ onClose, onBack, routines }) {
  const [format, setFormat] = useState("PDF");
  const [loading, setLoading] = useState(false);

  const filled = routines.filter(r => Object.values(r).some(v => v && v.trim()));
  const data = filled.length ? filled : routines;

  const handleDownload = async () => {
    setLoading(true);
    try {
      if (format === 'CSV') {
        exportCSV(data);
      } else if (format === 'PPTX') {
        await exportPPTX(data);
      } else if (format === 'PDF') {
        await exportPDF(data);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { id: "PDF",  name: "PDF",  desc: "דף סיכום מעוצב לשיתוף ולהצגה.",
      icon: (
        <svg viewBox="0 0 80 90" fill="none" className="ex-icon">
          <rect x="6" y="3" width="58" height="80" rx="2" fill="#FFFFFF" stroke="#C8C3B7" strokeWidth="1.4" />
          <path d="M55 3v15h15" stroke="#C8C3B7" strokeWidth="1.4" fill="#EEEBE2" />
          <rect x="14" y="30" width="34" height="3" rx="0.5" fill="#0A0908" />
          <rect x="14" y="38" width="42" height="2" rx="0.5" fill="#C8C3B7" />
          <rect x="14" y="44" width="42" height="2" rx="0.5" fill="#C8C3B7" />
          <rect x="14" y="50" width="32" height="2" rx="0.5" fill="#C8C3B7" />
          <rect x="14" y="58" width="42" height="2" rx="0.5" fill="#C8C3B7" />
          <rect x="14" y="64" width="22" height="2" rx="0.5" fill="#C8C3B7" />
          <rect x="42" y="70" width="22" height="11" rx="1.5" fill="#C8102E" />
          <text x="53" y="78" textAnchor="middle" fontSize="6.5" fontFamily="JetBrains Mono, monospace" fontWeight="700" fill="white">PDF</text>
        </svg>
      ) },
    { id: "PPTX", name: "PPTX", desc: "מצגת אקזקיוטיב מוכנה למליאה.",
      icon: (
        <svg viewBox="0 0 80 90" fill="none" className="ex-icon">
          <rect x="6" y="14" width="62" height="44" rx="2" fill="#FFFFFF" stroke="#C8C3B7" strokeWidth="1.4" />
          <rect x="6" y="14" width="62" height="5" rx="2" fill="#0A0908" />
          <rect x="6" y="14" width="14" height="5" fill="#C8102E" />
          <rect x="14" y="28" width="30" height="3" rx="0.5" fill="#0A0908" />
          <rect x="14" y="36" width="38" height="2" rx="0.5" fill="#C8C3B7" />
          <rect x="14" y="42" width="32" height="2" rx="0.5" fill="#C8C3B7" />
          <rect x="50" y="36" width="14" height="14" fill="#FFD23F" />
          <path d="M37 60v6M37 66l-6 6M37 66l6 6" stroke="#A19D95" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="6" y="74" width="62" height="9" rx="1.5" fill="#EEEBE2" />
        </svg>
      ) },
    { id: "CSV",  name: "CSV",  desc: "מידע גולמי מובנה לעיבוד נוסף.",
      icon: (
        <svg viewBox="0 0 80 90" fill="none" className="ex-icon">
          <rect x="6" y="6" width="62" height="76" rx="2" fill="#FFFFFF" stroke="#C8C3B7" strokeWidth="1.4" />
          <rect x="6" y="6" width="62" height="10" fill="#0A0908" />
          <rect x="6" y="6" width="14" height="10" fill="#C8102E" />
          <path d="M6 28h62M6 40h62M6 52h62M6 64h62M6 76h62 M22 16v66 M44 16v66 M60 16v66" stroke="#E5E2D9" strokeWidth="1" />
          <rect x="22" y="28" width="22" height="12" fill="#FFF1B0" />
          <rect x="44" y="40" width="16" height="12" fill="#FBE7EA" />
        </svg>
      ) },
  ];

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className="export-modal" onClick={e => e.stopPropagation()}>
        <header className="export-head">
          <div>
            <span className="eyebrow"><span className="pip" />שלב 4 · ייצוא</span>
            <h3>ייצוא התוצר</h3>
            <div className="sub">בחרו פורמט מועדף — האריזה הסופית של לוח השגרות שלכם.</div>
          </div>
          <button className="export-close" onClick={onClose} aria-label="סגירה"><IcClose size={16} /></button>
        </header>

        <div className="export-grid">
          {options.map(o => (
            <button key={o.id}
              className={`export-card ${format === o.id ? "selected" : ""}`}
              onClick={() => setFormat(o.id)}>
              <span className="ex-check"><IcCheck size={12} /></span>
              {o.icon}
              <span className="ex-name">{o.name}</span>
              <span className="ex-desc">{o.desc}</span>
            </button>
          ))}
        </div>

        <footer className="export-foot">
          <div className="summary">
            <strong>{data.length}</strong> שגרות · פורמט <strong>{format}</strong>
          </div>
          <div style={{display:"flex", gap:8}}>
            <button className="btn btn-soft" onClick={onBack}>חזרה לתוצר</button>
            <button
              className="btn btn-accent"
              onClick={handleDownload}
              disabled={loading}
              style={loading ? { opacity: 0.7, cursor: 'wait' } : {}}
            >
              <IcDownload size={16} />
              {loading ? 'מייצא...' : 'הורדה'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* =========================================================
   App root
   ========================================================= */

export default function App() {
  const [screen, setScreen] = useState("opening");
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState("cards");
  const [exportOpen, setExportOpen] = useState(false);

  // Load from localStorage on first mount, seed with examples if empty
  const [routines, setRoutines] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [{ ...EMPTY }, { ...EMPTY }, { ...EMPTY }];
  });

  // Auto-save whenever routines change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
    } catch {}
  }, [routines]);

  const progressId = exportOpen ? "export" : screen;

  const goto = (id) => {
    if (id === "export") { setScreen("result"); setExportOpen(true); }
    else { setExportOpen(false); setScreen(id); }
  };

  return (
    <div className="app">
      <header className="topbar">
        <Brand />
        <ProgressBar current={progressId} onGo={goto} />
        <div className="topbar-actions">
          <button className="icon-btn" aria-label="הגדרות"><IcSettings size={14} /></button>
        </div>
      </header>

      {screen === "opening" && (
        <OpeningScreen onStart={() => setScreen("filling")} />
      )}

      {screen === "filling" && (
        <FillingScreen
          routines={routines} setRoutines={setRoutines}
          active={active} setActive={setActive}
          onShowResult={() => { setMode("cards"); setScreen("result"); }}
        />
      )}

      {screen === "result" && (
        <ResultScreen
          routines={routines}
          mode={mode} setMode={setMode}
          onExport={() => setExportOpen(true)}
          onBack={() => setScreen("filling")}
        />
      )}

      {exportOpen && (
        <ExportPanel
          routines={routines}
          onClose={() => setExportOpen(false)}
          onBack={() => setExportOpen(false)}
        />
      )}
    </div>
  );
}
