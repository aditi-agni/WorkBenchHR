import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MarketingHeader } from "../components/MarketingHeader";
import { assetPath } from "../lib/assetPath";

const statCards = [
  {
    label: "Trusted by",
    metric: "12,000+",
    desc: "Small Businesses",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=960&h=720&fit=crop",
  },
  {
    label: "Saves users",
    metric: "12 hours",
    desc: "per week on HR tasks",
    image:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=960&h=720&fit=crop",
  },
  {
    label: "Built to support teams from",
    metric: "5-100+",
    desc: "at scale",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=960&h=720&fit=crop",
  },
  {
    label: "Named the",
    metric: "#1 HR",
    desc: "platform for high growth startups by Bloomberg Business",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=960&h=720&fit=crop",
  },
];

/** URL hashes we accept (includes #customers for old links). */
const VALID_NAV_HASHES = ["home", "customers", "platform", "request-demo"] as const;

/** Scroll-spy order: hero + stat cards count as “home” (no #customers tab). */
const SCROLL_SPY_SECTION_IDS = ["home", "platform", "request-demo"] as const;

function getActiveSectionId(): string {
  const headerEl = document.querySelector(".wb-mkt-header");
  const headerH = headerEl?.getBoundingClientRect().height ?? 68;
  const activationY = headerH + 20;
  let current: string = "home";
  for (const id of SCROLL_SPY_SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= activationY) current = id;
  }
  return current;
}

function hashToActiveSection(hash: string): string {
  if (hash === "customers") return "home";
  return hash;
}

const platformFeatures = [
  {
    title: "Hiring & pipeline",
    body: "Post roles, track candidates, and keep your team aligned from first screen to signed offer.",
    icon: "◎",
  },
  {
    title: "Onboarding & tasks",
    body: "Structured checklists, owners, and due dates so every new hire lands smoothly.",
    icon: "✓",
  },
  {
    title: "Policies & documents",
    body: "Templates, e-signatures, and reminders in one place, with less chasing and fewer gaps.",
    icon: "📄",
  },
];

export function WelcomePage() {
  const [activeSection, setActiveSection] = useState("home");
  const [demoSent, setDemoSent] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && (VALID_NAV_HASHES as readonly string[]).includes(hash)) {
      setActiveSection(hashToActiveSection(hash));
    }
  }, []);

  useEffect(() => {
    if (window.location.hash !== "#request-demo") return;
    const t = window.setTimeout(() => {
      document.getElementById("request-demo")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => window.clearTimeout(t);
  }, []);

  const scrollPlatformSectionIntoView = useCallback(() => {
    const el = document.getElementById("platform");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    const { pathname, search } = window.location;
    window.history.replaceState(null, "", `${pathname}${search}#platform`);
  }, []);

  useEffect(() => {
    if (window.location.hash !== "#platform") return;
    const t = window.setTimeout(() => {
      scrollPlatformSectionIntoView();
    }, 100);
    return () => window.clearTimeout(t);
  }, [scrollPlatformSectionIntoView]);

  const syncActiveFromScroll = useCallback(() => {
    setActiveSection(getActiveSectionId());
  }, []);

  useEffect(() => {
    const run = () => syncActiveFromScroll();
    const initialHash = window.location.hash.replace(/^#/, "");
    const hasNavHash =
      Boolean(initialHash) && (VALID_NAV_HASHES as readonly string[]).includes(initialHash);

    let resync: number | undefined;
    if (!hasNavHash) {
      run();
    } else {
      resync = window.setTimeout(run, 550);
    }

    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener("scroll", run, opts);
    window.addEventListener("resize", run);
    return () => {
      if (resync != null) window.clearTimeout(resync);
      window.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
    };
  }, [syncActiveFromScroll]);

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (id && (VALID_NAV_HASHES as readonly string[]).includes(id)) {
        setActiveSection(hashToActiveSection(id));
      }
      if (id === "platform") {
        window.setTimeout(() => scrollPlatformSectionIntoView(), 50);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [scrollPlatformSectionIntoView]);

  const onNavSectionClick = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
  }, []);

  function onDemoSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDemoSent(true);
  }

  return (
    <div className="wb-marketing">
      <MarketingHeader
        activeSection={activeSection}
        onSectionClick={onNavSectionClick}
        onPlatformSectionNavigate={scrollPlatformSectionIntoView}
      />

      <main className="wb-marketing__main">
        <div className="wb-page wb-welcome">
          <section id="home" className="wb-welcome__section wb-welcome__section--hero">
            <header className="wb-welcome__hero">
              <p className="wb-eyebrow">People-first operations</p>
              <div className="wb-welcome__title-row">
                <h1 className="wb-welcome__title-text">Welcome to Workbench HR</h1>
                <img
                  src={assetPath("/branding/logo.png")}
                  width={48}
                  height={48}
                  alt=""
                  className="wb-welcome__title-logo"
                />
              </div>
              <p className="wb-welcome__tagline">
                <em>Human Resources all in one place, and at your fingertips</em>
              </p>
              <div className="wb-welcome__hero-actions">
                <Link to="/signup" className="wb-btn wb-btn--primary wb-btn--hero">
                  Let&apos;s Get Started!
                </Link>
                <a
                  href="#request-demo"
                  className="wb-btn wb-btn--outline wb-btn--hero wb-welcome__request-demo-btn"
                >
                  Request a demo
                </a>
              </div>
            </header>
          </section>

          <section id="customers" className="wb-welcome__section">
            <ul className="wb-stat-grid">
              {statCards.map((c) => (
                <li key={c.label} className="wb-stat-card">
                  <div className="wb-stat-card__top">
                    <p className="wb-stat-card__label">{c.label}</p>
                    <p className="wb-stat-card__metric">{c.metric}</p>
                    <p className="wb-stat-card__desc">{c.desc}</p>
                  </div>
                  <div
                    className="wb-stat-card__photo"
                    style={{ backgroundImage: `url(${c.image})` }}
                    role="img"
                    aria-hidden
                  />
                </li>
              ))}
            </ul>
          </section>

          <section id="platform" className="wb-welcome__section">
            <div className="wb-mkt-section-head">
              <h2 className="wb-mkt-section-head__title">Everything your HR bench needs</h2>
              <p className="wb-mkt-section-head__lede">
                One calm workspace for hiring, onboarding, and day-to-day people work, built for
                teams that are growing fast.
              </p>
            </div>
            <ul className="wb-mkt-feature-grid">
              {platformFeatures.map((f) => (
                <li key={f.title} className="wb-mkt-feature-card">
                  <span className="wb-mkt-feature-card__icon" aria-hidden>
                    {f.icon}
                  </span>
                  <h3 className="wb-mkt-feature-card__title">{f.title}</h3>
                  <p className="wb-mkt-feature-card__body">{f.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="request-demo" className="wb-welcome__section wb-demo">
            <div className="wb-demo__inner">
              <div className="wb-mkt-section-head wb-demo__head">
                <h2 className="wb-mkt-section-head__title">Request a demo</h2>
                <p className="wb-mkt-section-head__lede">
                  Tell us a bit about your team. We&apos;ll follow up with a tailored walkthrough
                  of Workbench HR.
                </p>
              </div>
              {demoSent ? (
                <p className="wb-demo__thanks" role="status">
                  Thanks! We&apos;ve received your request and will be in touch shortly.
                </p>
              ) : (
                <form className="wb-demo__form" onSubmit={onDemoSubmit}>
                  <label className="wb-field">
                    <span className="wb-field__label">Full name</span>
                    <input className="wb-input wb-input--demo" name="name" required autoComplete="name" />
                  </label>
                  <label className="wb-field">
                    <span className="wb-field__label">Work email</span>
                    <input
                      className="wb-input wb-input--demo"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                    />
                  </label>
                  <label className="wb-field">
                    <span className="wb-field__label">Company</span>
                    <input
                      className="wb-input wb-input--demo"
                      name="company"
                      required
                      autoComplete="organization"
                    />
                  </label>
                  <label className="wb-field">
                    <span className="wb-field__label">Role (optional)</span>
                    <input className="wb-input wb-input--demo" name="role" autoComplete="organization-title" />
                  </label>
                  <label className="wb-field wb-field--full">
                    <span className="wb-field__label">What would you like to see? (optional)</span>
                    <textarea
                      className="wb-textarea"
                      name="message"
                      rows={4}
                      placeholder="e.g. onboarding, hiring pipeline, reporting…"
                    />
                  </label>
                  <div className="wb-demo__submit">
                    <button type="submit" className="wb-btn wb-btn--primary wb-btn--hero">
                      Submit request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>

        <footer className="wb-mkt-footer">
          <div className="wb-mkt-footer__inner">
            <span className="wb-mkt-footer__brand">© {new Date().getFullYear()} Workbench HR</span>
            <nav className="wb-mkt-footer__links" aria-label="Legal">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </nav>
          </div>
        </footer>
      </main>
    </div>
  );
}
