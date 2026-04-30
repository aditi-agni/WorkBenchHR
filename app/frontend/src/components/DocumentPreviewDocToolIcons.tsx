/** Icons for document preview side rail (AI + manual flows). */

import editIconUrl from "../../Designs/rd1.png";
import shareIconUrl from "../../Designs/rd2.png";

export function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden>
      <path
        d="M12 4v9.25m0 0l-3.25-3.25M12 13.25l3.25-3.25M5.75 17.5h12.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconEditFile() {
  return (
    <img
      src={editIconUrl}
      alt=""
      width={12}
      height={12}
      className="wb-doc-tool-ic"
      draggable={false}
      aria-hidden
    />
  );
}

export function IconShare() {
  return (
    <img
      src={shareIconUrl}
      alt=""
      width={12}
      height={12}
      className="wb-doc-tool-ic"
      draggable={false}
      aria-hidden
    />
  );
}
