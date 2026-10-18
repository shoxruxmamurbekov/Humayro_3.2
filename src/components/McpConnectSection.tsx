import React, { useCallback, useState } from 'react';
import { Check, Copy, ExternalLink, Plug, RefreshCw } from 'lucide-react';

const COUNTRY_OPTIONS = [
  { code: 'UZ', label: 'O‘zbekiston' },
  { code: 'KZ', label: 'Qozog‘iston' },
  { code: 'KG', label: 'Qirg‘iziston' },
  { code: 'TJ', label: 'Tojikiston' },
  { code: 'TM', label: 'Turkmaniston' },
  { code: 'AZ', label: 'Ozarbayjon' },
  { code: 'TR', label: 'Turkiya' },
  { code: 'RU', label: 'Rossiya' },
  { code: 'KR', label: 'Janubiy Koreya' },
  { code: 'SA', label: 'Saudiya Arabistoni' },
  { code: 'IR', label: 'Eron' },
  { code: 'US', label: 'AQSH' },
  { code: 'GB', label: 'Buyuk Britaniya' }
];

const TOPIC_OPTIONS = [
  { id: 'iqtisodiyot', label: 'Iqtisodiyot' },
  { id: 'texnologiya', label: 'Texnologiya' },
  { id: 'energiya', label: 'Energiya' },
  { id: 'siyosat', label: 'Siyosat' },
  { id: 'fan', label: 'Fan' }
];

const TOOLS = [
  { name: 'get_digest', text: 'Kunlik yoki haftalik shaxsiy yangilik xulosasi uchun material' },
  { name: 'get_latest_news', text: 'Tanlangan mavzular bo‘yicha oxirgi soatlardagi sarlavhalar' },
  { name: 'search_articles', text: 'Erkin matn bo‘yicha yangilik qidirish' },
  { name: 'list_options', text: 'Qo‘llab-quvvatlanadigan mamlakat, mavzu va tillar' }
];

interface PreviewArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface PreviewSection {
  label: string;
  articles: PreviewArticle[];
}

function mcpUrl(): string {
  try {
    return `${window.location.origin}/api/mcp`;
  } catch {
    return '/api/mcp';
  }
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const CopyBox: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the text stays selectable in the box.
    }
  };

  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500">{label}</p>
      <div className="mt-1.5 flex items-start gap-2 rounded-lg border border-white/[0.08] bg-[#05070A] p-3">
        <code className="min-w-0 flex-1 select-all whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-slate-200">
          {value}
        </code>
        <button
          onClick={copy}
          aria-label="Nusxa olish"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-white/[0.1] px-2.5 py-1.5 text-[11px] text-slate-300 hover:border-white/25"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Nusxalandi' : 'Nusxa'}
        </button>
      </div>
    </div>
  );
};

export const McpConnectSection: React.FC = () => {
  const url = mcpUrl();
  const [country, setCountry] = useState('UZ');
  const [topics, setTopics] = useState<string[]>([]);
  const [sections, setSections] = useState<PreviewSection[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTopic = (id: string) =>
    setTopics(t => (t.includes(id) ? t.filter(x => x !== id) : [...t, id]));

  // Calls the same MCP tool a connected AI would call, so the preview shows real server output.
  const preview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: { name: 'get_digest', arguments: { period: 'daily', country, topics, per_topic: 3 } }
        })
      });
      const json = await res.json();
      const text = json?.result?.content?.[0]?.text;
      if (!res.ok || !text || json.result.isError) throw new Error('preview failed');
      setSections((JSON.parse(text).sections || []) as PreviewSection[]);
    } catch {
      setSections(null);
      setError('Namuna yuklanmadi. Keyinroq urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  }, [country, topics]);

  const examplePrompt =
    `Humayro MCP serveri orqali har kuni ertalab men uchun yangiliklar xulosasini tayyorla. ` +
    `Mamlakat: ${country}, mavzular: ${topics.length ? topics.join(', ') : 'umumiy'}. ` +
    `Faqat serverdan kelgan maqolalarga tayan va har bir fakt uchun havolani ber.`;

  const claudeCodeCommand = `claude mcp add --transport http humayro ${url}`;

  return (
    <section id="newsroom" className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0C1118] p-4 sm:p-6">
        <header className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/[0.08] text-[#FF6A00]">
            <Plug size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-['Space_Grotesk'] text-lg font-semibold tracking-[0.08em] text-[#F5F7FA]">
                AI‘ngizni ulang
              </h2>
              <span className="rounded border border-white/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.16em] text-slate-400">
                MCP
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              O‘z AI yordamchingizni ulang: u qiziqishlaringizga qarab kunlik yoki haftalik yangiliklarni tayyorlab beradi
            </p>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <CopyBox label="MCP MANZILI" value={url} />

            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500">QANDAY ULANADI</p>
              <ol className="mt-2 list-decimal space-y-2 ps-5 text-xs leading-relaxed text-slate-300">
                <li>
                  <span className="font-semibold text-slate-100">Claude:</span> sozlamalardagi “Connectors” bo‘limida
                  maxsus connector qo‘shib, yuqoridagi manzilni kiriting.
                </li>
                <li>
                  <span className="font-semibold text-slate-100">Boshqa MCP klientlar:</span> “remote MCP server”
                  (Streamable HTTP) sifatida shu manzilni qo‘shing. Kalit yoki login kerak emas.
                </li>
                <li>
                  AI’ga qiziqishlaringizni ayting va kunlik yoki haftalik xulosani so‘rang. Rejalashtirishni
                  AI’ning o‘zi qiladi (masalan, har kuni ertalab).
                </li>
              </ol>
            </div>

            <CopyBox label="CLAUDE CODE UCHUN" value={claudeCodeCommand} />

            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500">MAVJUD TOOLLAR</p>
              <ul className="mt-2 space-y-1.5">
                {TOOLS.map(t => (
                  <li key={t.name} className="text-xs leading-relaxed text-slate-400">
                    <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-sky-300">{t.name}</code>{' '}
                    {t.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[200px_1fr]">
              <label className="flex flex-col gap-1 text-[11px] text-slate-400">
                Mamlakat
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="rounded-lg border border-white/[0.1] bg-[#05070A] px-3 py-2 text-sm text-slate-200"
                >
                  {COUNTRY_OPTIONS.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </label>
              <div className="flex flex-col gap-1 text-[11px] text-slate-400">
                Qiziqishlar (tanlamasangiz, umumiy)
                <div className="flex flex-wrap gap-2 pt-1">
                  {TOPIC_OPTIONS.map(t => {
                    const on = topics.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTopic(t.id)}
                        className={
                          'rounded-full border px-3 py-1.5 text-[11px] transition-colors ' +
                          (on ? 'border-orange-400/40 bg-orange-400/[0.1] text-orange-200' : 'border-white/[0.08] text-slate-400 hover:text-slate-200')
                        }
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <CopyBox label="AI’GA BERISH UCHUN NAMUNA SO‘ROV" value={examplePrompt} />

            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500">AI NIMA OLADI (NAMUNA)</p>
              <button
                onClick={preview}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-white/[0.1] px-3 py-2 text-[11px] text-slate-300 hover:border-white/25 disabled:opacity-50"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                Sinab ko‘rish
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.05] p-3 text-xs text-rose-300">{error}</div>
            )}

            {sections && sections.every(s => s.articles.length === 0) && (
              <p className="py-4 text-center text-xs text-slate-500">
                Hozircha maqola topilmadi. Boshqa mamlakat yoki mavzu sinab ko‘ring.
              </p>
            )}

            {sections?.map(section =>
              section.articles.length > 0 ? (
                <div key={section.label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{section.label}</p>
                  <ul className="mt-2 space-y-2">
                    {section.articles.map(a => (
                      <li key={a.url} className="text-xs leading-relaxed text-slate-300">
                        {a.title}{' '}
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-sky-300 hover:underline"
                        >
                          <ExternalLink size={10} /> {hostOf(a.url)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        </div>

        <p className="mt-6 border-t border-white/[0.06] pt-4 text-[10px] leading-relaxed text-slate-600">
          Server faqat ochiq manbalardan sarlavha va qisqa tavsiflarni beradi. Xulosani sizning AI’ingiz yozadi, shuning
          uchun uni asl manbada tekshirib chiqing. Qiziqishlaringiz bu saytda saqlanmaydi.
        </p>
      </div>
    </section>
  );
};

export default McpConnectSection;
