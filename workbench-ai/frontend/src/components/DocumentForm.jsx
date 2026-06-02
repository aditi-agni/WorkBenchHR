import { useState } from "react";

export default function DocumentForm({ onGenerate, isLoading, docTypes }) {
  const [docType, setDocType] = useState("");
  const [fieldValues, setFieldValues] = useState({});

  const selectedDocType = docTypes.find((t) => t.value === docType) || null;

  const handleDocTypeChange = (e) => {
    setDocType(e.target.value);
    setFieldValues({});
  };

  const handleFieldChange = (key, value) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const requiredFieldsFilled =
    selectedDocType
      ? selectedDocType.fields
          .filter((f) => f.required)
          .every((f) => fieldValues[f.key] && fieldValues[f.key].trim() !== "")
      : false;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!docType || !selectedDocType) return;
    onGenerate(docType, fieldValues);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="field">
        <label>Document Type</label>
        <select value={docType} onChange={handleDocTypeChange} required>
          <option value="">Select type...</option>
          {docTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {selectedDocType &&
        selectedDocType.fields.map((field) => (
          <div className="field" key={field.key}>
            <label>{field.label}{field.required ? " *" : ""}</label>
            <input
              type="text"
              value={fieldValues[field.key] || ""}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              required={field.required}
              placeholder={field.label}
            />
          </div>
        ))}

      <button
        type="submit"
        disabled={isLoading || !docType || !requiredFieldsFilled}
      >
        {isLoading ? "Generating..." : "Generate Document"}
      </button>
    </form>
  );
}
