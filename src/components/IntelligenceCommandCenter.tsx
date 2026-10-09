import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, Archive, ArrowUpRight, CheckCircle2, ChevronRight, Globe2, Radar, RotateCcw, ShieldAlert, SlidersHorizontal, Sparkles } from 'lucide-react';

type Region = 'global' | 'central-asia' | 'europe' | 'east-asia';
type ResponseMode = 'investigate' | 'monitor' | 'contain' | 'escalate';

const signals = [
  { id: 1, region: 'central-asia' as Region, title: 'Energiya tarmog‘idagi beqarorlik', area: 'Markaziy Osiyo', type: 'ENERGIYA', risk: 78, status: 'YUQORI', detail: 'Elektr yuklamasidagi noodatiy tebranishlarni tekshirish kerak.' },
  { id: 2, region: 'europe' as Region, title: 'Ta’minot zanjiridagi uzilish', area: 'Yevropa', type: 'IQTISODIYOT', risk: 54, status: 'O‘RTA', detail: 'Logistika yo‘nalishlaridagi kechikishlar kuzatuv talab qiladi.' },
  { id: 3, region: 'east-asia' as Region, title: 'Aloqa signalidagi anomaliya', area: 'Sharqiy Osiyo', type: 'ALOQA', risk: 91, status: 'KRITIK', detail: 'Signal naqshidagi o‘zgarish chuqur tahlil uchun belgilandi.' }
];
const regionNames: Record<Region, string> = { global: 'Global', 'central-asia': 'Markaziy Osiyo', europe: 'Yevropa', 'east-asia': 'Sharqiy Osiyo' };
const responseNames: Record<ResponseMode, string> = { investigate: 'Chuqur tekshiruv', monitor: 'Kuzatuvni davom ettirish', contain: 'Xavfni cheklash', escalate: 'Yuqori darajaga yuborish' };

export const IntelligenceCommandCenter: React.FC = () => {
  const [region, setRegion] = useState<Region>('global');
  const [sensitivity, setSensitivity] = useState(65);
  const [response, setResponse] = useState<ResponseMode>('investigate');
  const [assessment, setAssessment] = useState<{ score: number; recommendation: string; time: string } | null>(null);
  const [archive, setArchive] = useState<{ score: number; region: string; time: string }[]>([]);
  const [showArchive, setShowArchive] = useState(false);
  const visible = useMemo(() => region === 'global' ? signals : signals.filter(s => s.region === region), [region]);
  const highestRisk = Math.max(...visible.map(s => s.risk));
  const riskScore = Math.max(0, Math.min(100, Math.round(highestRisk * (0.55 + sensitivity / 150))));
  const clock = () => new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

  const runAssessment = () => {
    const recommendation = response === 'investigate' ? 'Manbalarni solishtiring va asosiy sabablarni chuqur tekshiring.'
      : response === 'monitor' ? 'Signalni kuzatishda davom eting; yangi dalil kelganda qayta baholang.'
      : response === 'contain' ? 'Ta’sir doirasini aniqlang va ehtiyot choralarini baholang.'
      : 'Natijani mas’ul tahlilchi ko‘rib chiqishi uchun yuqori darajaga yuboring.';
    setAssessment({ score: riskScore, recommendation, time: clock() });
  };
  const reset = () => { setRegion('global'); setSensitivity(65); setResponse('investigate'); setAssessment(null); setShowArchive(false); };
  const saveAssessment = () => {
    if (!assessment) return;
    setArchive(prev => [{ score: assessment.score, region: regionNames[region], time: assessment.time }, ...prev].slice(0, 5));
    setShowArchive(true);
  };
  const riskTone = (risk: number) => risk >= 85 ? 'text-rose-300' : risk >= 70 ? 'text-orange-300' : 'text-sky-300';
  const riskBar = (risk: number) => risk >= 85 ? 'bg-rose-400' : risk >= 70 ? 'bg-orange-400' : 'bg-sky-400';

  return (
    <section id="command-center" className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#080B10] shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/[0.08] text-[#FF6A00]"><Radar size={22} /></div>
            <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-['Space_Grotesk'] text-lg font-semibold tracking-[0.1em] text-[#F5F7FA]">HUMAYRO</h2><span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.16em] text-slate-400">GLOBAL INTELLIGENCE</span></div><p className="mt-1 text-xs text-slate-500">Tahliliy markaz <span className="mx-1 text-slate-700">/</span> Vaziyat paneli</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-amber-300"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> SIMULYATSIYA</span><span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] font-mono text-slate-400"><Activity size={12} className="text-sky-400" /> INTERAKTIV REJIM</span></div>
        </header>

        <div className="grid grid-cols-2 border-b border-white/[0.08] sm:grid-cols-4">
          {[
            { label: 'FAOL HODISALAR', value: String(visible.length).padStart(2, '0'), sub: 'namunaviy signallar', icon: <Activity size={15} />, tone: 'text-sky-400' },
            { label: 'ENG YUQORI XAVF', value: highestRisk + '/100', sub: 'xavf indikatori', icon: <ShieldAlert size={15} />, tone: 'text-orange-400' },
            { label: 'SEZGIRLIK', value: sensitivity + '%', sub: 'tahlil parametri', icon: <SlidersHorizontal size={15} />, tone: 'text-blue-400' },
            { label: 'TIZIM HOLATI', value: 'BARQAROR', sub: 'simulyatsiya faol', icon: <CheckCircle2 size={15} />, tone: 'text-emerald-400' }
          ].map((item, i) => <div key={item.label} className={'min-w-0 px-4 py-4 sm:px-6 sm:py-5 ' + (i % 2 === 0 ? 'border-r border-white/[0.06]' : '') + (i < 2 ? ' border-b border-white/[0.06] sm:border-b-0' : '') + (i === 1 || i === 2 ? ' sm:border-r' : '')}><div className="flex items-center justify-between gap-2 text-[9px] font-semibold tracking-[0.13em] text-slate-500 sm:text-[10px]"><span>{item.label}</span><span className={item.tone}>{item.icon}</span></div><div className={'mt-3 truncate font-[Space_Grotesk] text-xl font-semibold tracking-tight sm:text-2xl ' + item.tone}>{item.value}</div><div className="mt-1 text-[10px] text-slate-600">{item.sub}</div></div>)}
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-0 xl:grid-cols-[1.15fr_0.95fr_0.8fr]">
          <div className="min-w-0 border-b border-white/[0.08] p-4 sm:p-6 xl:border-b-0 xl:border-r">
            <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">01 / GLOBAL RADAR</p><h3 className="mt-1 text-sm font-semibold text-slate-100">Global vaziyat xaritasi</h3></div><span className="rounded-md border border-white/[0.08] px-2 py-1 font-mono text-[9px] text-slate-500">2D • SCHEMATIC</span></div>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#05080D]">
              <div className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(100,116,139,.08) 1px, transparent 1px),linear-gradient(90deg,rgba(100,116,139,.08) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
              <svg viewBox="0 0 600 310" className="relative z-[1] block w-full" role="img" aria-label="Sxematik dunyo xaritasi va signal nuqtalari">
                <defs><pattern id="humayro-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".75" fill="#475569" opacity=".7" /></pattern><radialGradient id="humayro-radar"><stop offset="0%" stopColor="#3B82F6" stopOpacity=".12" /><stop offset="100%" stopColor="#3B82F6" stopOpacity="0" /></radialGradient></defs>
                <circle cx="300" cy="155" r="135" fill="url(#humayro-radar)" />{[55,100,145].map(r => <circle key={r} cx="300" cy="155" r={r} fill="none" stroke="#334155" strokeOpacity=".34" strokeDasharray="3 7" />)}
                {[65,125,185,245,305,365,425,485,545].map(x => <line key={x} x1={x} y1="12" x2={x} y2="298" stroke="#334155" strokeOpacity=".16" />)}{[55,105,155,205,255].map(y => <line key={y} x1="10" y1={y} x2="590" y2={y} stroke="#334155" strokeOpacity=".16" />)}
                <g fill="url(#humayro-dots)" stroke="#475569" strokeOpacity=".6" strokeWidth="1.1"><path d="M54 67 L79 42 112 35 143 48 160 65 153 83 134 87 127 107 105 118 96 141 77 134 69 112 52 96Z" /><path d="M133 149 L154 157 166 183 157 215 145 249 130 228 125 197 111 177Z" /><path d="M249 61 L270 48 294 52 306 67 296 82 274 84 260 77Z" /><path d="M300 88 L324 72 361 69 386 83 419 79 447 94 466 91 488 110 473 130 445 127 431 145 405 139 389 155 366 147 351 125 325 126 315 108Z" /><path d="M325 139 L354 132 378 149 387 177 371 205 357 237 338 224 326 197 309 171Z" /><path d="M468 215 L492 207 515 220 512 237 486 244 470 233Z" /><path d="M526 90 L550 96 562 111 547 122 529 112Z" /></g>
                <g stroke="#FF6A00" strokeOpacity=".38" strokeDasharray="4 5" fill="none"><path d="M142 92 Q265 24 356 104" /><path d="M356 104 Q412 72 486 103" /><path d="M356 104 Q337 162 353 190" /></g>
                {([{ x: 142, y: 92, id: 'central-asia' as Region, risk: 78 }, { x: 356, y: 104, id: 'europe' as Region, risk: 54 }, { x: 486, y: 103, id: 'east-asia' as Region, risk: 91 }]).map(pin => <g key={pin.id} className="cursor-pointer" onClick={() => setRegion(pin.id)}><circle cx={pin.x} cy={pin.y} r={region === pin.id ? 17 : 12} fill={pin.risk >= 85 ? '#FB7185' : pin.risk >= 70 ? '#FB923C' : '#60A5FA'} fillOpacity=".12" /><circle cx={pin.x} cy={pin.y} r={region === pin.id ? 7 : 5} fill={pin.risk >= 85 ? '#FB7185' : pin.risk >= 70 ? '#FB923C' : '#60A5FA'} /><circle cx={pin.x} cy={pin.y} r="13" fill="none" stroke={pin.risk >= 85 ? '#FB7185' : pin.risk >= 70 ? '#FB923C' : '#60A5FA'} strokeOpacity=".45"><animate attributeName="r" values="8;15;8" dur="3s" repeatCount="indefinite" /><animate attributeName="stroke-opacity" values=".5;.08;.5" dur="3s" repeatCount="indefinite" /></circle></g>)}
                <text x="142" y="74" fill="#FDBA74" fontSize="10" fontFamily="monospace" textAnchor="middle">CA / 78</text><text x="356" y="84" fill="#93C5FD" fontSize="10" fontFamily="monospace" textAnchor="middle">EU / 54</text><text x="486" y="83" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="middle">EA / 91</text><text x="18" y="292" fill="#64748B" fontSize="9" fontFamily="monospace">SCHEMATIC MAP • NOT LIVE TELEMETRY</text>
              </svg>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.06] px-4 py-3 text-[10px] text-slate-500"><span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-sky-400" /> O‘rta</span><span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-orange-400" /> Yuqori</span><span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Kritik</span><span className="ml-auto font-mono text-slate-600">3 TA NAMUNA SIGNAL</span></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">{(['global','central-asia','europe','east-asia'] as Region[]).map(key => <button key={key} onClick={() => setRegion(key)} className={'rounded-lg border px-3 py-2 text-left text-[11px] transition-colors ' + (region === key ? 'border-orange-400/35 bg-orange-400/[0.08] text-orange-200' : 'border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200')}>{regionNames[key]}</button>)}</div>
          </div>

          <div className="min-w-0 border-b border-white/[0.08] p-4 sm:p-6 xl:border-b-0 xl:border-r">
            <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">02 / SIGNAL FEED</p><h3 className="mt-1 text-sm font-semibold text-slate-100">Tahlil talab qiluvchi hodisalar</h3></div><span className="font-mono text-[10px] text-slate-600">{String(visible.length).padStart(2,'0')} ITEMS</span></div>
            <div className="space-y-2.5">{visible.map(item => <button key={item.id} onClick={() => setRegion(item.region)} className="group w-full rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-left transition-all hover:border-white/[0.15] hover:bg-white/[0.04]"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><span className={'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ' + (item.risk >= 85 ? 'bg-rose-400/10 text-rose-300' : item.risk >= 70 ? 'bg-orange-400/10 text-orange-300' : 'bg-sky-400/10 text-sky-300')}><AlertTriangle size={15} /></span><div className="min-w-0"><div className="mb-1 flex flex-wrap items-center gap-2"><span className="font-mono text-[9px] tracking-[0.1em] text-slate-600">SIG-{String(item.id).padStart(3,'0')}</span><span className={'rounded px-1.5 py-0.5 font-mono text-[8px] tracking-wider ' + (item.risk >= 85 ? 'bg-rose-400/10 text-rose-300' : item.risk >= 70 ? 'bg-orange-400/10 text-orange-300' : 'bg-sky-400/10 text-sky-300')}>{item.status}</span></div><p className="text-xs font-semibold leading-relaxed text-slate-200 group-hover:text-white">{item.title}</p><p className="mt-1 text-[10px] text-slate-500">{item.area} <span className="mx-1 text-slate-700">·</span> {item.type}</p></div></div><ChevronRight size={14} className="mt-1 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5" /></div><div className="mt-3 flex items-center gap-3"><div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.07]"><div className={'h-full rounded-full ' + riskBar(item.risk)} style={{ width: String(item.risk) + '%' }} /></div><span className={'w-10 text-right font-mono text-[10px] ' + riskTone(item.risk)}>{item.risk}/100</span></div></button>)}</div>
            <p className="mt-3 flex items-start gap-2 text-[10px] leading-relaxed text-slate-600"><AlertTriangle size={12} className="mt-0.5 shrink-0" /> Bu hodisalar maketdagi interaksiyalarni ko‘rsatish uchun yaratilgan namunaviy ma’lumotlardir.</p>
          </div>

          <div className="min-w-0 p-4 sm:p-6">
            <div className="mb-4"><p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">03 / ANALYSIS CONTROLS</p><h3 className="mt-1 text-sm font-semibold text-slate-100">Tahlil parametrlarini sozlash</h3></div>
            <label className="mb-2 block text-[11px] font-medium text-slate-300" htmlFor="humayro-region">Tahlil hududi</label>
            <select id="humayro-region" value={region} onChange={e => { setRegion(e.target.value as Region); setAssessment(null); }} className="w-full rounded-xl border border-white/[0.09] bg-[#0D121A] px-3 py-3 text-xs text-slate-200 outline-none transition focus:border-orange-400/50">{Object.entries(regionNames).map(([key,value]) => <option key={key} value={key}>{value}</option>)}</select>
            <div className="mt-5"><div className="mb-2 flex items-center justify-between gap-2"><label htmlFor="humayro-sensitivity" className="text-[11px] font-medium text-slate-300">Xavfga sezgirlik</label><span className="font-mono text-xs text-orange-300">{sensitivity}%</span></div><input id="humayro-sensitivity" type="range" min="0" max="100" value={sensitivity} onChange={e => { setSensitivity(Number(e.target.value)); setAssessment(null); }} className="w-full cursor-pointer accent-[#FF6A00]" /><div className="mt-1 flex justify-between text-[9px] text-slate-600"><span>Past</span><span>Muvozanatli</span><span>Yuqori</span></div></div>
            <div className="mt-5"><p className="mb-2 text-[11px] font-medium text-slate-300">Tavsiya etilgan harakat</p><div className="space-y-1.5">{([['investigate','Chuqur tekshiruv','Dalillarni tahlil qilish'],['monitor','Kuzatish','Signalni kuzatishda davom etish'],['contain','Cheklash','Ta’sirni kamaytirish chorasi'],['escalate','Yuqoriga yuborish','Mutaxassisga yo‘naltirish']] as [ResponseMode,string,string][]).map(([key,label,desc]) => <label key={key} className={'flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 transition-colors ' + (response === key ? 'border-orange-400/30 bg-orange-400/[0.06]' : 'border-white/[0.06] hover:border-white/[0.13]')}><input type="radio" name="humayro-response" value={key} checked={response === key} onChange={() => { setResponse(key); setAssessment(null); }} className="mt-0.5 accent-[#FF6A00]" /><span className="min-w-0"><span className="block text-[11px] font-medium text-slate-200">{label}</span><span className="mt-0.5 block text-[10px] text-slate-500">{desc}</span></span></label>)}</div></div>
            <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#0C1118] p-3.5"><div className="flex items-center justify-between text-[10px] text-slate-500"><span>HISOBLANGAN XAVF</span><span className="font-mono text-slate-300">{riskScore}/100</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className={'h-full rounded-full transition-all ' + riskBar(riskScore)} style={{ width: String(riskScore) + '%' }} /></div><p className="mt-2 text-[10px] leading-relaxed text-slate-500">Ko‘rsatkich tanlangan namunaviy signallar va sezgirlik sozlamasidan hisoblanadi.</p></div>
            <button onClick={runAssessment} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6A00] px-4 py-3 text-xs font-bold text-black transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300/50"><Sparkles size={15} /> Tahlilni ishga tushirish <ArrowUpRight size={14} /></button>
            <button onClick={reset} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-[11px] font-medium text-slate-400 transition hover:border-white/20 hover:text-white"><RotateCcw size={13} /> Parametrlarni tiklash</button>
            {assessment && <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-3.5"><div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-300"><CheckCircle2 size={14} /> Tahlil yakunlandi <span className="ml-auto font-mono text-[10px] text-slate-500">{assessment.time}</span></div><div className="mt-2 flex items-end gap-2"><span className="font-[Space_Grotesk] text-2xl font-semibold text-slate-100">{assessment.score}</span><span className="pb-1 text-[10px] text-slate-500">/ 100 xavf balli</span></div><p className="mt-2 text-[11px] leading-relaxed text-slate-300">{assessment.recommendation}</p><button onClick={saveAssessment} className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-emerald-300 hover:text-emerald-200"><Archive size={12} /> Natijani arxivlash</button></div>}
            {showArchive && <div className="mt-3 rounded-xl border border-white/[0.07] p-3"><div className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-wider text-slate-400"><Archive size={12} /> SAQLANGAN TAHLILLAR</div>{archive.length === 0 ? <p className="text-[10px] text-slate-600">Hozircha arxiv bo‘sh.</p> : archive.map((item,i) => <div key={item.time + '-' + i} className="flex items-center justify-between gap-3 border-t border-white/[0.06] py-2 text-[10px]"><span className="text-slate-400">{item.region} · {item.time}</span><span className="font-mono text-slate-200">{item.score}/100</span></div>)}</div>}
          </div>
        </div>
        <footer className="flex flex-col gap-2 border-t border-white/[0.07] px-5 py-3 text-[9px] text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-7"><span className="flex items-center gap-2"><Globe2 size={12} /> HUMAYRO INTELLIGENCE WORKSPACE</span><span>Namuna paneli · Ma’lumotlar simulyatsiya uchun · Jonli yangiliklar alohida oqimda</span></footer>
      </div>
    </section>
  );
};

export default IntelligenceCommandCenter;
