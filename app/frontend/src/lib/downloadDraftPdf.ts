const MM_MARGIN = 18;
const LINE_MM = 5.2;

/** Built-in PDF fonts cover Windows-1252 / Latin-1; normalize common Unicode punctuation. */
function normalizeForStandardPdfFont(text: string): string {
  return text
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u2014|\u2013/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00a0/g, " ");
}

function safePdfFileStem(file: string, templateLabel: string): string {
  const stem = (file.replace(/\.pdf$/i, "") || templateLabel).replace(/\s+/g, "_").replace(/[^\w.-]+/g, "");
  return stem.slice(0, 96) || "draft";
}

/** Builds a simple multi-page PDF from plain text (default Helvetica). Loads jsPDF on demand. */
export async function downloadTextAsPdf(options: {
  file: string;
  templateLabel: string;
  titleLine: string;
  body: string;
}): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const { file, templateLabel, titleLine, body } = options;
  const stem = safePdfFileStem(file, templateLabel);
  const title = normalizeForStandardPdfFont(titleLine);
  const textBody = normalizeForStandardPdfFont(body);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - MM_MARGIN * 2;

  let y = MM_MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  for (const t of doc.splitTextToSize(title, maxW)) {
    if (y > pageH - MM_MARGIN) {
      doc.addPage();
      y = MM_MARGIN;
    }
    doc.text(t, MM_MARGIN, y);
    y += LINE_MM * 1.35;
  }
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  for (const rawLine of textBody.split("\n")) {
    if (rawLine.trim() === "") {
      y += LINE_MM * 0.45;
      continue;
    }
    for (const w of doc.splitTextToSize(rawLine, maxW)) {
      if (y > pageH - MM_MARGIN) {
        doc.addPage();
        y = MM_MARGIN;
      }
      doc.text(w, MM_MARGIN, y);
      y += LINE_MM;
    }
  }

  doc.save(`${stem}_preview.pdf`);
}
