import { Link } from "react-router-dom";

const FIGMA_EMBED_SRC =
  "https://embed.figma.com/proto/ZgC63LSLg3Tqs7MEFHCRZc/WorkBench-HR-UI?node-id=229-17&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&embed-host=share";

export function DesignReferencePage() {
  return (
    <div className="wb-figma-page">
      <header className="wb-figma-page__bar">
        <Link to="/" className="wb-link">
          ← Back to Welcome
        </Link>
        <span className="wb-figma-page__hint">
          Interactive prototype (Figma embed)
        </span>
      </header>
      <div className="wb-figma-page__frame">
        <iframe
          title="WorkBench HR: Figma prototype"
          src={FIGMA_EMBED_SRC}
          className="wb-figma-page__iframe"
          allowFullScreen
        />
      </div>
    </div>
  );
}
