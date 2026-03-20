import React, { useRef, useState } from 'react';
import DOMPurify from 'dompurify';

// ── Markdown → HTML renderer ─────────────────────────────────────────────────
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-1 text-white">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2 text-white">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-black mt-6 mb-2 text-white">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-amber-500 pl-4 text-slate-400 italic my-3">$1</blockquote>')
    .replace(/```([\s\S]*?)```/gm, '<pre class="bg-black/40 rounded-lg p-3 text-xs text-emerald-400 my-3 overflow-x-auto">$1</pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-black/30 text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-300 italic">$1</em>')
    .replace(/~~(.+?)~~/g, '<del class="text-slate-500 line-through">$1</del>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-amber-400 underline hover:text-amber-300" target="_blank">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-slate-300 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-slate-300 list-decimal">$1</li>')
    .replace(/(<li[\s\S]+?<\/li>)/g, '<ul class="my-2 space-y-1">$1</ul>')
    .replace(/^(?!<[h1-6|ul|ol|li|blockquote|pre|div])(.+)$/gm, '<p class="text-slate-300 leading-relaxed my-2">$1</p>')
    .replace(/\n\n/g, '')
    .trim();
}

// ── Cursor insertion helpers ──────────────────────────────────────────────────
function insertAtCursor(ta: HTMLTextAreaElement, prefix: string, suffix = '', placeholder = '', setter: (v: string) => void) {
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = ta.value.substring(start, end);
  const insert = `${prefix}${selected || placeholder}${suffix}`;
  const next = ta.value.substring(0, start) + insert + ta.value.substring(end);
  setter(next);
  setTimeout(() => {
    ta.focus();
    const cursor = start + prefix.length + (selected || placeholder).length + suffix.length;
    ta.setSelectionRange(cursor, cursor);
  }, 0);
}

function insertLine(ta: HTMLTextAreaElement, line: string, setter: (v: string) => void) {
  const start = ta.selectionStart;
  const before = ta.value.substring(0, start);
  const lineStart = before.lastIndexOf('\n') + 1;
  const next = ta.value.substring(0, lineStart) + line + '\n' + ta.value.substring(lineStart);
  setter(next);
  setTimeout(() => { ta.focus(); ta.setSelectionRange(lineStart + line.length + 1, lineStart + line.length + 1); }, 0);
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Number of visible rows in textarea. Default: 8 */
  minRows?: number;
  /** Compact mode hides heading & advanced toolbar items. Default: false */
  compact?: boolean;
  /** Label shown above the editor */
  label?: React.ReactNode;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'İçerik giriniz...',
  minRows = 8,
  compact = false,
  label,
}) => {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const tb = (text: string, icon: string, tooltip: string, onClick: () => void) => (
    <button
      type="button"
      title={tooltip}
      onClick={onClick}
      className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all text-[11px] font-bold font-mono"
    >
      {icon && <i className={`fa-solid ${icon} text-[10px]`} />}
      {text && <span>{text}</span>}
    </button>
  );

  const ins = (prefix: string, suffix = '', placeholder = 'metin') => {
    if (taRef.current) insertAtCursor(taRef.current, prefix, suffix, placeholder, onChange);
  };
  const line = (l: string) => {
    if (taRef.current) insertLine(taRef.current, l, onChange);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          {label}
        </div>
      )}
      <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.02] focus-within:border-[var(--color-primary)]/40 transition-colors">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
          {/* Inline formatting */}
          <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
            {tb('', 'fa-bold', 'Kalın', () => ins('**', '**', 'kalın'))}
            {tb('', 'fa-italic', 'İtalik', () => ins('*', '*', 'italik'))}
            {tb('', 'fa-strikethrough', 'Üstü çizili', () => ins('~~', '~~', 'metin'))}
            {tb('', 'fa-code', 'İnline kod', () => ins('`', '`', 'kod'))}
          </div>

          {/* Headings — hidden in compact */}
          {!compact && (
            <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
              {tb('H1', '', 'Başlık 1', () => line('# Başlık 1'))}
              {tb('H2', '', 'Başlık 2', () => line('## Başlık 2'))}
              {tb('H3', '', 'Başlık 3', () => line('### Başlık 3'))}
            </div>
          )}

          {/* Block elements */}
          <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
            {tb('', 'fa-list-ul', 'Sırasız liste', () => line('- Liste öğesi'))}
            {tb('', 'fa-list-ol', 'Numaralı liste', () => line('1. Liste öğesi'))}
            {tb('', 'fa-quote-left', 'Alıntı', () => line('> Alıntı metni'))}
            {!compact && tb('', 'fa-square-code', 'Kod bloğu', () => line('```\nkod buraya\n```'))}
          </div>

          {/* Link & image — hidden in compact */}
          {!compact && (
            <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
              {tb('', 'fa-link', 'Link', () => ins('[', '](https://)', 'link metni'))}
              {tb('', 'fa-image', 'Resim', () => ins('![', '](https://resim-url)', 'açıklama'))}
            </div>
          )}

          <div className="flex-1" />

          {/* Preview toggle */}
          <button
            type="button"
            onClick={() => setShowPreview(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              showPreview
                ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${showPreview ? 'fa-pen' : 'fa-eye'} text-[10px]`} />
            {showPreview ? 'Düzenle' : 'Önizle'}
          </button>
        </div>

        {/* Edit / Preview */}
        {showPreview ? (
          <div
            className="p-4 text-sm overflow-y-auto"
            style={{ minHeight: `${minRows * 1.75}rem` }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                renderMarkdown(value) || '<p class="text-slate-700">İçerik girilmedi...</p>'
              ),
            }}
          />
        ) : (
          <textarea
            ref={taRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={minRows}
            className="w-full p-4 font-mono text-[13px] bg-transparent text-slate-200 outline-none resize-none leading-relaxed placeholder-slate-700"
            style={{ lineHeight: '1.75', caretColor: '#c5a059' }}
          />
        )}

        {/* Footer: char count */}
        <div className="flex items-center justify-end px-3 py-1.5 border-t border-white/[0.04]">
          <span className="text-[10px] text-slate-600 font-mono">{value.length} karakter</span>
        </div>
      </div>
    </div>
  );
};
