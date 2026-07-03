import { GlossaryTerm } from '../types';

// Applies a construction-materials glossary on top of Google Translate output.
// Google Translate's free widget cannot take a custom glossary, so after it renders
// English we walk the DOM text nodes and replace generic/mistranslated terms with the
// correct professional English. Only runs while the English translation is active.

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const hasNonAscii = (s: string) => {
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 127) return true;
  }
  return false;
};

interface CompiledGlossary {
  koRegex: RegExp | null;
  koMap: Record<string, string>;
  enRegex: RegExp | null;
  enMap: Record<string, string>; // keyed by lowercased `from`
}

const compile = (terms: GlossaryTerm[]): CompiledGlossary => {
  const clean = (terms || [])
    .filter(t => t && t.from && t.to && t.from !== t.to)
    // Longest first so "순환골재" wins over "골재", "coarse aggregate" over "aggregate".
    .sort((a, b) => b.from.length - a.from.length);

  const koTerms = clean.filter(t => hasNonAscii(t.from));
  const enTerms = clean.filter(t => !hasNonAscii(t.from));

  const koMap: Record<string, string> = {};
  koTerms.forEach(t => { if (!(t.from in koMap)) koMap[t.from] = t.to; });
  const enMap: Record<string, string> = {};
  enTerms.forEach(t => { const k = t.from.toLowerCase(); if (!(k in enMap)) enMap[k] = t.to; });

  const koRegex = koTerms.length
    ? new RegExp(koTerms.map(t => escapeRegex(t.from)).join('|'), 'g')
    : null;
  // Word boundaries so English terms are not replaced mid-word; case-insensitive.
  const enRegex = enTerms.length
    ? new RegExp('\\b(?:' + enTerms.map(t => escapeRegex(t.from)).join('|') + ')\\b', 'gi')
    : null;

  return { koRegex, koMap, enRegex, enMap };
};

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT', 'CODE']);

/**
 * Install the glossary corrector. Returns a cleanup function.
 * @param getTerms  returns the current glossary (read fresh so edits apply without reinstall)
 * @param isActive  returns true while the English translation is showing
 */
export function installGlossaryCorrector(
  getTerms: () => GlossaryTerm[],
  isActive: () => boolean,
): () => void {
  let compiled = compile(getTerms());
  let scheduled = false;
  let observer: MutationObserver | null = null;

  const apply = () => {
    scheduled = false;
    compiled = compile(getTerms());
    if (!isActive() || (!compiled.koRegex && !compiled.enRegex)) return;
    if (observer) observer.disconnect();
    try {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => {
          const parent = n.parentNode as HTMLElement | null;
          if (!parent || SKIP_TAGS.has(parent.nodeName)) return NodeFilter.FILTER_REJECT;
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      for (const node of nodes) {
        const original = node.nodeValue as string;
        let next = original;
        if (compiled.enRegex) next = next.replace(compiled.enRegex, (m) => compiled.enMap[m.toLowerCase()] ?? m);
        if (compiled.koRegex) next = next.replace(compiled.koRegex, (m) => compiled.koMap[m] ?? m);
        if (next !== original) node.nodeValue = next;
      }
    } catch (e) {
      // Never let DOM quirks break the page.
      console.error('Glossary corrector error', e);
    } finally {
      if (observer) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    setTimeout(apply, 150);
  };

  observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  // Initial passes (Google Translate renders asynchronously after load).
  schedule();
  const t1 = setTimeout(schedule, 800);
  const t2 = setTimeout(schedule, 2000);

  return () => {
    if (observer) observer.disconnect();
    clearTimeout(t1);
    clearTimeout(t2);
  };
}
