import jsPDF from "jspdf";

export default function DocumentPreview({ document, setDocument, onReset }) {
  const handleDownload = () => {
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(document, 180);
    pdf.setFont("helvetica");
    pdf.setFontSize(11);
    pdf.text(lines, 15, 20);
    pdf.save("workbench_document.pdf");
  };

  return (
    <div className="preview">
      <div className="preview-header">
        <h2>Generated Document</h2>
        <div className="preview-actions">
          <button onClick={onReset} className="btn-ghost">New Document</button>
          <button onClick={handleDownload} className="btn-primary">Download PDF</button>
        </div>
      </div>
      <textarea
        className="editor"
        value={document}
        onChange={(e) => setDocument(e.target.value)}
        rows={28}
        spellCheck
      />
      <p className="hint">You can edit the document above before downloading.</p>
    </div>
  );
}
