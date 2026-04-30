import { useLocation } from "react-router-dom";
import { LegalDocLayout } from "../components/LegalDocLayout";

type TermsNavState = {
  backTo?: string;
  backLabel?: string;
};

export function TermsOfServicePage() {
  const location = useLocation();
  const nav = (location.state ?? null) as TermsNavState | null;

  return (
    <LegalDocLayout
      title="Terms of Service"
      backTo={nav?.backTo ?? "/"}
      backLabel={nav?.backLabel ?? "← Back to home"}
    >
      <section className="wb-legal__section">
        <h2>1. Agreement to terms</h2>
        <p>
          These Terms of Service (“Terms”) govern your access to and use of Workbench HR’s websites,
          applications, and related services (collectively, the “Services”). By creating an account,
          clicking “I agree,” or using the Services, you agree to these Terms on behalf of yourself or the
          organization you represent.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>2. Description of services</h2>
        <p>
          Workbench HR provides cloud-based tools to help teams manage HR workflows such as hiring,
          onboarding, documents, and related tasks. Features may change over time; we may add, modify, or
          discontinue functionality with reasonable notice where practicable.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>3. Accounts and eligibility</h2>
        <p>
          You must provide accurate registration information and keep your credentials confidential. You
          are responsible for all activity under your account. You must be at least 18 years old and
          authorized to bind your organization if you register on its behalf.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Services in violation of law or third-party rights;</li>
          <li>Attempt to gain unauthorized access to systems, data, or other users’ accounts;</li>
          <li>Upload malware, excessive automated traffic, or content intended to disrupt the Services;</li>
          <li>Reverse engineer or scrape the Services except as permitted by applicable law;</li>
          <li>Use the Services to build a competing product without our written consent.</li>
        </ul>
      </section>

      <section className="wb-legal__section">
        <h2>5. Customer data</h2>
        <p>
          You retain ownership of data you submit to the Services (“Customer Data”). You grant us a
          limited license to host, process, and display Customer Data solely to provide and improve the
          Services as described in your agreement and our Privacy Policy. You represent that you have all
          rights necessary to submit Customer Data.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>6. Intellectual property</h2>
        <p>
          Workbench HR and its licensors own all rights in the Services, branding, and documentation. We
          grant you a non-exclusive, non-transferable license to use the Services during your subscription
          term. Feedback you provide may be used without obligation to you.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>7. Third-party services</h2>
        <p>
          The Services may integrate with third-party tools (e.g., calendars, identity providers). Your
          use of those tools is subject to the third parties’ terms. We are not responsible for third-party
          services or content.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>8. Disclaimers</h2>
        <p>
          THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE
          DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR
          ERROR-FREE.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>9. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WORKBENCH HR AND ITS AFFILIATES WILL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA,
          OR GOODWILL. OUR AGGREGATE LIABILITY ARISING OUT OF THESE TERMS WILL NOT EXCEED THE AMOUNT YOU
          PAID US FOR THE SERVICES IN THE TWELVE MONTHS BEFORE THE CLAIM (OR ONE HUNDRED DOLLARS IF NO FEES
          APPLY), UNLESS APPLICABLE LAW REQUIRES OTHERWISE.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>10. Indemnification</h2>
        <p>
          You will defend and indemnify Workbench HR against claims arising from your use of the Services,
          your Customer Data, or your violation of these Terms, subject to our right to control the
          defense of matters implicating our intellectual property.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>11. Term and termination</h2>
        <p>
          These Terms remain in effect while you use the Services. We may suspend or terminate access for
          material breach, legal risk, or non-payment. You may stop using the Services at any time. Sections
          intended to survive termination (e.g., liability, indemnity) will survive.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>12. Governing law</h2>
        <p>
          These Terms are governed by the laws of the State of Delaware, USA, excluding conflict-of-law
          rules, unless a different governing law is specified in a signed order form. Courts in that
          jurisdiction will have exclusive venue, subject to mandatory consumer protections in your
          country of residence.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>13. Changes</h2>
        <p>
          We may modify these Terms by posting an updated version and revising the “Last updated” date.
          Continued use after changes become effective constitutes acceptance. For material changes, we
          may provide additional notice as required by law.
        </p>
      </section>

      <section className="wb-legal__section">
        <h2>14. Contact</h2>
        <p>
          Questions about these Terms:{" "}
          <a href="mailto:legal@workbenchhr.example">legal@workbenchhr.example</a> (placeholder address for
          sample content).
        </p>
      </section>
    </LegalDocLayout>
  );
}
