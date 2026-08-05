import { Product } from '../types';

/**
 * Builds a readable, Korean-friendly URL slug from a product name.
 * Keep this in sync with the same function in server/server.js (used for sitemap.xml).
 *
 *   "RPM WATER FIX (수경성)"   -> "rpm-water-fix-수경성"
 *   "미끄럼방지 포장재 (MMA)"  -> "미끄럼방지-포장재-mma"
 */
export const slugifyProduct = (name: string): string =>
  String(name || '')
    .toLowerCase()
    .replace(/[()[\]{}.,/\\|]/g, ' ')
    .replace(/[^0-9a-z가-힣ㄱ-ㅎㅏ-ㅣ\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');

/** Finds a product by its slug, falling back to a raw id match. */
export const findProductBySlug = (products: Product[], slug: string): Product | undefined => {
  if (!slug) return undefined;
  const decoded = decodeURIComponent(slug);
  return (
    products.find(p => slugifyProduct(p.name) === decoded) ||
    products.find(p => p.id === decoded)
  );
};
