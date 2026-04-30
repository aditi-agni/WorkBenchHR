import { Link } from "react-router-dom";
import { assetPath } from "../lib/assetPath";

type Props = {
  /** Pass `null` for a static (non-link) brand row */
  to?: string | null;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
};

export function BrandMark({
  to = "/",
  size = 40,
  showWordmark = true,
  wordmarkClassName = "",
}: Props) {
  const inner = (
    <>
      <img
        src={assetPath("/branding/logo.png")}
        width={size}
        height={size}
        alt=""
        className="brand-mark__img"
      />
      {showWordmark ? (
        <span className={`brand-mark__text ${wordmarkClassName}`.trim()}>
          Workbench HR
        </span>
      ) : null}
    </>
  );

  if (to === null) {
    return <span className="brand-mark">{inner}</span>;
  }

  return (
    <Link to={to} className="brand-mark">
      {inner}
    </Link>
  );
}
