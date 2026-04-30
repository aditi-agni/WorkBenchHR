const QUICK_CHANNELS = [
  {
    title: "Email us",
    body: "Best for detailed questions, screenshots, and policy reviews.",
    action: "support@workbenchhr.example",
    href: "mailto:support@workbenchhr.example",
    meta: "Typical reply within one business day",
  },
  {
    title: "Phone",
    body: "Talk with the Workbench HR success team during business hours.",
    action: "+1 (800) 555-0192",
    href: "tel:+18005550192",
    meta: "Mon–Fri · 8:00 AM – 8:00 PM ET",
  },
  {
    title: "Live chat",
    body: "Quick answers about navigation, permissions, and document flows.",
    action: "Start chat (demo)",
    href: null,
    meta: "Avg. wait under 3 minutes · sample data",
  },
] as const;

const TOPICS = [
  "Inviting admins and assigning roles",
  "E-signatures and document packets",
  "Onboarding checklists and reminders",
  "Integrations (Slack, Google Calendar)",
  "Exporting payroll-ready reports",
] as const;

const ARTICLES = [
  { title: "Getting started with your first workspace", read: "6 min", updated: "Apr 2, 2026" },
  { title: "Understanding hiring pipeline stages", read: "4 min", updated: "Mar 18, 2026" },
  { title: "Trigger notifications: who gets what", read: "5 min", updated: "Mar 4, 2026" },
  { title: "Data retention and export basics", read: "7 min", updated: "Feb 21, 2026" },
] as const;

export function SettingsHelpSupportPage() {
  return (
    <div className="wb-help-page">
      <div className="wb-help-page__intro">
        <h1 className="wb-help-page__title">How can we help?</h1>
        <p className="wb-help-page__sub">
          This is a placeholder layout for the real Help Center—sample contact details and articles below show how
          the page could feel once connected to your support tools.
        </p>
      </div>

      <section className="wb-help-page__channels" aria-label="Contact options">
        {QUICK_CHANNELS.map((ch) => (
          <article key={ch.title} className="wb-help-card">
            <h2 className="wb-help-card__title">{ch.title}</h2>
            <p className="wb-help-card__body">{ch.body}</p>
            <p className="wb-help-card__meta">{ch.meta}</p>
            {ch.href ? (
              <a href={ch.href} className="wb-link wb-help-card__action">
                {ch.action}
              </a>
            ) : (
              <button type="button" className="wb-link wb-help-card__action wb-help-card__action--btn">
                {ch.action}
              </button>
            )}
          </article>
        ))}
      </section>

      <div className="wb-help-page__split">
        <section className="wb-help-panel" aria-labelledby="help-topics-heading">
          <h2 className="wb-help-panel__title" id="help-topics-heading">
            Popular topics
          </h2>
          <ul className="wb-help-topics">
            {TOPICS.map((t) => (
              <li key={t}>
                <button type="button" className="wb-help-topic">
                  <span>{t}</span>
                  <span aria-hidden>→</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="wb-help-panel" aria-labelledby="help-articles-heading">
          <h2 className="wb-help-panel__title" id="help-articles-heading">
            From the knowledge base
          </h2>
          <ul className="wb-help-articles">
            {ARTICLES.map((a) => (
              <li key={a.title}>
                <button type="button" className="wb-help-article">
                  <span className="wb-help-article__title">{a.title}</span>
                  <span className="wb-help-article__meta">
                    {a.read} read · Updated {a.updated}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
