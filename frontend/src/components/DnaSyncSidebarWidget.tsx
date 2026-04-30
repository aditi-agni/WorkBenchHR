import { useCallback, useEffect, useRef, useState } from "react";
import { clearDnaSyncWidgetPending } from "../lib/dnaSyncWidget";

const TOTAL_DOCS = 13;
const SYNCED_START = 5;
const PCT_START = 30;
const PCT_END = 100;
const DURATION_MS = 72_000;
const TICK_MS = 120;

const R = 40;
const VB = 100;
const CX = VB / 2;
const CY = VB / 2;
const RING_LEN = 2 * Math.PI * R;

type Props = {
  onDismissed: () => void;
  /** Called only when the progress animation reaches 100% (not when the user dismisses early). */
  onTrainingFinished?: () => void;
};

function syncedForPct(pct: number): number {
  const t = Math.max(0, Math.min(1, (pct - PCT_START) / (PCT_END - PCT_START)));
  return Math.min(TOTAL_DOCS, Math.round(SYNCED_START + t * (TOTAL_DOCS - SYNCED_START)));
}

export function DnaSyncSidebarWidget({ onDismissed, onTrainingFinished }: Props) {
  const [pct, setPct] = useState(PCT_START);
  const intervalRef = useRef<number | null>(null);
  const doneTimeoutRef = useRef<number | null>(null);
  const startRef = useRef(0);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  const clearTimers = useCallback(() => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (doneTimeoutRef.current != null) {
      window.clearTimeout(doneTimeoutRef.current);
      doneTimeoutRef.current = null;
    }
  }, []);

  const dismissEarly = useCallback(() => {
    clearTimers();
    clearDnaSyncWidgetPending();
    onDismissed();
  }, [clearTimers, onDismissed]);

  const completeNaturally = useCallback(() => {
    clearTimers();
    clearDnaSyncWidgetPending();
    onDismissed();
    onTrainingFinished?.();
  }, [clearTimers, onDismissed, onTrainingFinished]);

  useEffect(() => {
    if (reduceMotion) {
      setPct(PCT_END);
      doneTimeoutRef.current = window.setTimeout(completeNaturally, 900);
      return () => {
        if (doneTimeoutRef.current != null) window.clearTimeout(doneTimeoutRef.current);
      };
    }

    startRef.current = Date.now();
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const u = Math.min(1, elapsed / DURATION_MS);
      const ease = 1 - (1 - u) ** 1.35;
      const next = PCT_START + ease * (PCT_END - PCT_START);
      setPct(next);
      if (u >= 1) {
        if (intervalRef.current != null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setPct(PCT_END);
        doneTimeoutRef.current = window.setTimeout(completeNaturally, 1400);
      }
    }, TICK_MS);

    return () => clearTimers();
  }, [clearTimers, completeNaturally, reduceMotion]);

  const synced = syncedForPct(pct);
  const remaining = Math.max(0, TOTAL_DOCS - synced);
  const pctLabel = Math.min(100, Math.round(pct));

  const sub =
    remaining > 0
      ? `Analyzing ${remaining} more document${remaining === 1 ? "" : "s"} to learn your company voice.`
      : "Finishing your company voice profile.";

  const dashOffset = RING_LEN * (1 - Math.min(100, pct) / 100);

  return (
    <div className="wb-dash-dna" role="status" aria-live="polite">
      <button type="button" className="wb-dash-dna__close" onClick={dismissEarly} aria-label="Dismiss sync status">
        ×
      </button>
      <div className="wb-dash-dna__ring-wrap" aria-label={`${pctLabel} percent complete`}>
        <svg className="wb-dash-dna__ring" viewBox={`0 0 ${VB} ${VB}`} aria-hidden>
          <circle className="wb-dash-dna__ring-bg" cx={CX} cy={CY} r={R} fill="none" strokeWidth="9" />
          <circle
            className="wb-dash-dna__ring-fill"
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={RING_LEN}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${CX} ${CY})`}
          />
        </svg>
        <span className="wb-dash-dna__ring-label">{pctLabel}%</span>
      </div>
      <h2 className="wb-dash-dna__title">HR DNA Syncing…</h2>
      <p className="wb-dash-dna__desc">{sub}</p>
      <p className="wb-dash-dna__foot">
        {synced}/{TOTAL_DOCS} Documents Synced
      </p>
    </div>
  );
}
