import { LegalDocLayout } from "../components/LegalDocLayout";

export function PrivacyPolicyPage() {
  return (
    <LegalDocLayout title="Privacy Policy">
      <section className="wb-legal__section">
        <h2>1. Introduction</h2>
        <p>
          Workbench HR (“we,” “our,” or “us”) respects your privacy. This Privacy Policy describes how we
          collect, use, store, and protect information when you visit our website, use our products, or
          interact with us online. By using our services, you agree to the practices described here.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>2. Information we collect</h2>
        <p>We may collect the following categories of information, depending on how you use Workbench HR:</p>
        <ul>
          <li>
            <strong>Account and profile data:</strong> name, work email, company name, role, and
            preferences you provide when you sign up or update your profile.
          </li>
          <li>
            <strong>Usage data:</strong> pages viewed, features used, approximate location derived from IP
            address, device type, browser version, and timestamps.
          </li>
          <li>
            <strong>Support communications:</strong> messages you send to us, including attachments or
            screenshots you choose to share when troubleshooting.
          </li>
          <li>
            <strong>HR-related content you upload:</strong> documents, templates, or employee data you
            store in the product, processed solely to provide the service you have configured.
          </li>
        </ul>
      </section>

      <section className="wb-legal__section">
        <h2>3. How we use information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide, maintain, and improve Workbench HR;</li>
          <li>Authenticate users, prevent fraud, and protect security;</li>
          <li>Send transactional emails, product updates, and (where permitted) marketing communications;</li>
          <li>Analyze aggregated usage trends to improve usability and performance;</li>
          <li>Comply with legal obligations and enforce our agreements.</li>
        </ul>
      </section>

      <section className="wb-legal__section">
        <h2>4. Sharing and disclosure</h2>
        <p>
          We do not sell your personal information. We may share data with subprocessors who assist us
          (e.g., hosting, email delivery, analytics) under strict confidentiality and data-processing terms.
          We may disclose information if required by law, court order, or to protect the rights, property,
          or safety of our users or the public.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>5. Data retention</h2>
        <p>
          We retain information for as long as your account is active or as needed to provide services.
          After closure of an account, we may retain certain records for a limited period for legal,
          tax, or security purposes, after which data is deleted or anonymized according to our retention
          schedule.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>6. Your rights and choices</h2>
        <p>
          Depending on your jurisdiction, you may have the right to access, correct, delete, or export
          your personal data, or to object to certain processing. You may opt out of marketing emails
          via the unsubscribe link. To exercise other rights, contact us using the details in Section 10.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>7. Security</h2>
        <p>
          We implement administrative, technical, and organizational measures designed to protect data
          against unauthorized access, alteration, or loss. No method of transmission over the Internet is
          completely secure; we encourage strong passwords and careful handling of credentials.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>8. International transfers</h2>
        <p>
          If you access our services from outside the country where our servers are located, your
          information may be transferred across borders. Where required, we use appropriate safeguards
          such as standard contractual clauses.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>9. Children’s privacy</h2>
        <p>
          Workbench HR is not directed at children under 16. We do not knowingly collect personal
          information from children. If you believe we have collected such information, please contact us
          so we can delete it.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>10. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the revised version on this
          page and update the “Last updated” date. Material changes may be communicated by email or
          in-product notice where appropriate.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>11. Contact</h2>
        <p>
          For privacy-related questions or requests, contact:{" "}
          <a href="mailto:privacy@workbenchhr.example">privacy@workbenchhr.example</a> (placeholder address
          for sample content).
        </p>
      </section>
    </LegalDocLayout>
  );
}
