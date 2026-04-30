/** Escape text for use inside SVG. */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Stable hue offset 0–35 from filename for subtle preview variety */
function accentHueFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 33 + name.charCodeAt(i)) | 0;
  return Math.abs(h) % 36;
}

/**
 * Data-URI SVG that reads like a PDF page preview (no binary assets).
 * `pageIndex` is 0-based; visuals shift slightly per page for paging demos.
 */
export function docPagePreviewDataUri(fileName: string, pageIndex: number, totalPages: number): string {
  const total = Math.max(1, Math.min(99, totalPages));
  const idx = Math.max(0, Math.min(total - 1, pageIndex));
  const label = fileName.replace(/\.pdf$/i, "").slice(0, 36);
  const hue = 142 + accentHueFromName(fileName);
  const page = `hsl(${hue}, 18%, 97%)`;
  const stroke = `hsl(${hue},12%,88%)`;
  /** Low-saturation fills so preview chrome does not read as mint/green */
  const neutralBand = `hsl(${hue}, 5%, 92%)`;
  const seed = idx * 17 + fileName.length;
  const w1 = 160 + (seed % 90);
  const w2 = 200 + ((seed * 3) % 64);
  const w3 = 140 + ((seed * 5) % 100);
  const y0 = 56 + (idx % 4) * 6;

  const showHeader = idx === 0;
  const showFooter = idx === total - 1;
  const bodyLines = 6 + (idx % 3);

  let body = "";
  let y = y0;
  for (let i = 0; i < bodyLines; i += 1) {
    const w = i % 3 === 0 ? w1 : i % 3 === 1 ? w2 : w3;
    body += `<rect x="28" y="${y}" width="${Math.min(264, w)}" height="10" rx="3" fill="${page}" stroke="${stroke}" stroke-width="1"/>`;
    y += 18;
  }

  const headerBlock = showHeader
    ? `<rect x="28" y="36" width="264" height="18" rx="4" fill="${neutralBand}" stroke="${stroke}" stroke-width="1"/>`
    : `<text x="160" y="46" text-anchor="middle" fill="hsl(${hue},10%,38%)" font-family="system-ui,sans-serif" font-size="10" font-weight="600">${escapeXml(label)}</text>`;

  const footerBlock = showFooter
    ? `<text x="160" y="338" text-anchor="middle" fill="hsl(${hue},10%,48%)" font-family="system-ui,sans-serif" font-size="9">Signature / acknowledgment</text>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="420" viewBox="0 0 320 420">
  <defs><filter id="sh" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.12"/></filter></defs>
  <rect x="12" y="12" width="296" height="396" rx="10" fill="#fff" filter="url(#sh)"/>
  ${headerBlock}
  ${body}
  ${footerBlock}
  <rect x="24" y="372" width="272" height="28" rx="6" fill="${neutralBand}" stroke="${stroke}" stroke-width="1"/>
  <text x="160" y="384" text-anchor="middle" fill="hsl(${hue},18%,36%)" font-family="system-ui,sans-serif" font-size="11" font-weight="700">${escapeXml(`Page ${idx + 1} of ${total}`)}</text>
  <text x="160" y="398" text-anchor="middle" fill="hsl(${hue},8%,48%)" font-family="system-ui,sans-serif" font-size="10">PDF preview</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
