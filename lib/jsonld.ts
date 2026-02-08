/**
 * Safely serialize data for JSON-LD <script> injection.
 * Escapes `<` to prevent XSS when embedding in HTML.
 */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
