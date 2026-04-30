const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    period: "per month",
    blurb: "Essentials for a single location getting organized in WorkBench.",
    features: [
      "Up to 25 active employee profiles",
      "Core HR workspace & document library",
      "Standard email reminders & triggers",
      "Email support within two business days",
    ],
    cta: "Current plan",
    ctaVariant: "current" as const,
    highlighted: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "$129",
    period: "per month",
    blurb: "For growing teams that want AI-assisted workflows and tighter sync.",
    features: [
      "Up to 150 active employee profiles",
      "AI-assisted document drafting (preview)",
      "Slack & calendar integrations",
      "Priority chat & email support",
    ],
    cta: "Upgrade to Growth",
    ctaVariant: "primary" as const,
    highlighted: true,
    badge: "Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "annual agreements",
    blurb: "Volume, compliance, and white-glove onboarding for multi-site operators.",
    features: [
      "Unlimited seats & sandbox workspaces",
      "Dedicated customer success manager",
      "Custom contracts & security review",
      "SSO, audit logs, and data residency options",
    ],
    cta: "Contact sales",
    ctaVariant: "outline" as const,
    highlighted: false,
  },
] as const;

export function SettingsBillingPage() {
  return (
    <div className="wb-billing-page">
      <div className="wb-billing-page__intro">
        <h1 className="wb-billing-page__title">Choose the right workspace</h1>
        <p className="wb-billing-page__sub">
          Placeholder pricing for the proof of concept—no charges are processed here. When billing
          goes live, you&apos;ll manage seats, invoices, and payment methods from this page.
        </p>
      </div>

      <section className="wb-billing-current" aria-label="Current subscription">
        <div className="wb-billing-current__main">
          <span className="wb-billing-current__label">Current plan</span>
          <p className="wb-billing-current__title">
            <strong>Starter</strong>
            <span className="wb-billing-current__sep">·</span>
            <span className="wb-billing-current__meta">Illustrative trial workspace</span>
          </p>
          <p className="wb-billing-current__renew">
            Next review date: <time dateTime="2026-05-01">May 1, 2026</time> (sample)
          </p>
        </div>
        <button type="button" className="wb-btn wb-btn--outline wb-billing-current__action" disabled>
          Manage payment method
        </button>
      </section>

      <div className="wb-billing-plans" role="list">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`wb-billing-plan${plan.highlighted ? " wb-billing-plan--featured" : ""}`}
            role="listitem"
            aria-label={`${plan.name} plan`}
          >
            {plan.badge ? (
              <span className="wb-billing-plan__badge">{plan.badge}</span>
            ) : null}
            <header className="wb-billing-plan__head">
              <h2 className="wb-billing-plan__name">{plan.name}</h2>
              <p className="wb-billing-plan__price">
                <span className="wb-billing-plan__amount">{plan.price}</span>
                <span className="wb-billing-plan__period">{plan.period}</span>
              </p>
              <p className="wb-billing-plan__blurb">{plan.blurb}</p>
            </header>
            <ul className="wb-billing-plan__features">
              {plan.features.map((f) => (
                <li key={f} className="wb-billing-plan__feature">
                  <span className="wb-billing-plan__check" aria-hidden>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="wb-billing-plan__foot">
              {plan.ctaVariant === "current" ? (
                <button type="button" className="wb-btn wb-btn--muted wb-billing-plan__cta" disabled>
                  {plan.cta}
                </button>
              ) : plan.ctaVariant === "primary" ? (
                <button type="button" className="wb-btn wb-btn--primary wb-billing-plan__cta">
                  {plan.cta}
                </button>
              ) : (
                <button type="button" className="wb-btn wb-btn--outline wb-billing-plan__cta">
                  {plan.cta}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <p className="wb-billing-page__footnote">
        All amounts and limits are sample copy for the UI. Stripe or another provider would back
        real checkout when this ships.
      </p>
    </div>
  );
}
