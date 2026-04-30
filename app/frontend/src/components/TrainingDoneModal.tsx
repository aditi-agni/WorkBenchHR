import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function TrainingDoneModal({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("button, a")?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="wb-training-done" role="dialog" aria-modal="true" aria-labelledby="wb-training-done-title">
      <button type="button" className="wb-training-done__backdrop" onClick={onClose} aria-label="Close" />
      <div ref={panelRef} className="wb-training-done__panel">
        <h2 id="wb-training-done-title" className="wb-training-done__title">
          HR DNA sync is complete
        </h2>
        <p className="wb-training-done__body">
          Your documents are indexed and ready. You can open your library anytime from the sidebar.
        </p>
        <div className="wb-training-done__actions">
          <Link to="/documents" className="wb-btn wb-btn--primary wb-training-done__primary" onClick={onClose}>
            View documents <span aria-hidden>›</span>
          </Link>
          <button type="button" className="wb-btn wb-btn--muted wb-training-done__secondary" onClick={onClose}>
            Not now
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
