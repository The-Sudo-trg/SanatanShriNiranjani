"use client";

import Link from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { buildSearchIndex, searchContent, type SearchHit } from "@/lib/site-search";

// Site search (brief Phase 7): debounced, keyboard-navigable list, aria-live
// announcements, highlighted terms, useful empty state. Local index — no
// network dependency, works offline.
const KIND_LABEL: Record<SearchHit["kind"], string> = {
  temple: "मन्दिर",
  mantra: "मंत्र",
  festival: "पर्व",
  wisdom: "प्रेरणा",
  page: "पृष्ठ",
};

function Highlight({ text, term }: { text: string; term: string }) {
  const q = term.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="rounded bg-saffronSoft px-0.5 text-charcoal">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function SiteSearch() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [index] = useState(buildSearchIndex);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDebounced(query);
      setActiveIdx(-1);
    }, 250);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  const hits = searchContent(index, debounced);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && hits[activeIdx]) {
      window.location.href = hits[activeIdx].href;
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
        <input suppressHydrationWarning
          ref={inputRef}
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="मन्दिर, मंत्र, पर्व, पृष्ठ खोजें…"
          aria-label="साइट में खोजें"
          aria-describedby="search-help"
          role="combobox"
          aria-expanded={hits.length > 0}
          aria-controls="search-results"
          className="w-full rounded-2xl border border-warmBorder bg-surface py-3.5 pl-12 pr-12 text-base text-charcoal shadow-sm placeholder:text-muted focus:border-saffron focus:outline-none"
        />
        {query && (
          <button suppressHydrationWarning
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="खोज साफ़ करें"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted hover:text-charcoal"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
        <p id="search-help" className="sr-only">
          ऊपर-नीचे तीर कुंजी से परिणाम चुनें, Enter से खोलें।
        </p>
      </div>

      <div id="search-results" aria-live="polite">
        <p role="status" className="text-xs text-muted">
          {debounced ? `${hits.length} परिणाम मिले` : "खोजने के लिए टाइप करें"}
        </p>
        {debounced && hits.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-warmBorder bg-surface p-10 text-center">
            <p className="font-heading text-lg font-bold text-charcoal">कुछ नहीं मिला</p>
            <p className="mt-1 text-sm text-muted">
              वर्तनी जाँचें, या हिन्दी/English दोनों आज़माएँ — जैसे &quot;कालकाजी&quot; या &quot;Kalkaji&quot;।
            </p>
          </div>
        )}
        <ul className="mt-3 space-y-2">
          {hits.map((hit, i) => (
            <li key={`${hit.kind}:${hit.slug}`}>
              <Link
                href={hit.href}
                onMouseEnter={() => setActiveIdx(i)}
                className={`block rounded-2xl border p-4 transition ${
                  activeIdx === i
                    ? "border-saffron bg-surface"
                    : "border-warmBorder bg-surface/60 hover:border-saffron"
                }`}
              >
                <span className="mr-2 rounded-full bg-tealSoft px-2 py-0.5 text-[10px] font-bold text-teal">
                  {KIND_LABEL[hit.kind]}
                </span>
                <span className="font-bold text-charcoal">
                  <Highlight text={hit.titleHi} term={debounced} />
                </span>
                {hit.titleEn && (
                  <span className="ml-2 text-xs text-muted">
                    <Highlight text={hit.titleEn} term={debounced} />
                  </span>
                )}
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                  <Highlight text={hit.snippet} term={debounced} />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
