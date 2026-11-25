import { Link } from "react-router";
import { ShieldCheck, Mail, ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "November 25, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-6 w-6" />
            Mail Agent
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-primary">
            LEGAL INFORMATION
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
          <p className="mt-6 leading-7 text-muted-foreground">
            This Privacy Policy explains how Mail Agent ("we", "our", or "the
            Service") collects, uses, stores, and protects information when you
            use our application and connect your Google account.
          </p>
        </div>

        <div className="space-y-9 leading-7">
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground">
              Depending on how you use Mail Agent, we may collect:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Account information, such as your authentication identifier and
                email address.
              </li>
              <li>
                Gmail information that you authorize us to access through Google
                OAuth.
              </li>
              <li>
                Email content and recipient information required for features
                you choose to use.
              </li>
              <li>
                Conversation history, AI-generated drafts, and application
                preferences.
              </li>
              <li>
                Technical information such as logs, request metadata, and error
                information.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              2. Google Account and Gmail Access
            </h2>
            <p className="text-muted-foreground">
              Mail Agent allows you to connect your Google account using
              Google's OAuth authorization process. We only request the Google
              permissions needed to provide the features you use.
            </p>
            <p className="mt-3 text-muted-foreground">
              Depending on the permissions granted, we may access Gmail
              information to prepare email drafts, retrieve relevant email
              content, or send emails at your request.
            </p>
            <p className="mt-3 text-muted-foreground">
              You can revoke Mail Agent's access at any time through your Google
              Account permissions settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              3. How We Use Your Information
            </h2>
            <p className="text-muted-foreground">We use information to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Authenticate users and manage accounts.</li>
              <li>Connect to Gmail and provide requested email features.</li>
              <li>Generate and manage AI-assisted email drafts.</li>
              <li>Maintain conversation history and application state.</li>
              <li>
                Improve application reliability, security, and performance.
              </li>
              <li>Respond to support requests and prevent misuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              4. AI Processing and Third-Party Services
            </h2>
            <p className="text-muted-foreground">
              Mail Agent uses third-party services to provide authentication,
              database storage, email integration, hosting, and AI features.
              These may include Clerk, Google, Neon, Render, Vercel, and AI
              model providers.
            </p>
            <p className="mt-3 text-muted-foreground">
              When you use AI features, relevant prompts, email content, and
              conversation information may be sent to the AI provider configured
              by Mail Agent to generate responses or drafts. The applicable
              provider's privacy and data-handling policies also apply.
            </p>
            <p className="mt-3 text-muted-foreground">
              We do not claim that information processed by third-party
              providers is handled solely by Mail Agent. Please review the
              providers' policies before using these features.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              5. Data Storage and Security
            </h2>
            <p className="text-muted-foreground">
              We use database and hosting infrastructure to store and process
              application information. OAuth credentials and tokens are handled
              by our backend services and protected using security measures
              appropriate to the implementation.
            </p>
            <p className="mt-3 text-muted-foreground">
              No internet-based service can guarantee absolute security. We
              continuously seek to protect information against unauthorized
              access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">6. Data Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. Information may be
              processed by service providers when necessary to operate Mail
              Agent, including authentication, hosting, database, email, and AI
              services.
            </p>
            <p className="mt-3 text-muted-foreground">
              We may also disclose information where required by law or where
              necessary to protect the rights, security, and integrity of our
              users and service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              7. Data Retention and Deletion
            </h2>
            <p className="text-muted-foreground">
              We retain account information, conversations, drafts, and other
              application data for as long as necessary to provide the Service
              and meet applicable legal obligations.
            </p>
            <p className="mt-3 text-muted-foreground">
              You may request deletion of your Mail Agent account and associated
              stored information by contacting us. Disconnecting Google access
              revokes authorization but may not automatically delete information
              already stored in Mail Agent.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              8. Children's Privacy
            </h2>
            <p className="text-muted-foreground">
              Mail Agent is not intended for children under the age required to
              independently consent to the processing of personal information in
              their jurisdiction. We do not knowingly collect personal
              information from children in violation of applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              9. Changes to This Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. Changes will
              be published on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">10. Contact Us</h2>
            <p className="text-muted-foreground">
              For privacy-related questions or data deletion requests, contact
              us at:
            </p>
            <a
              href="mailto:YOUR_SUPPORT_EMAIL"
              className="mt-3 inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              YOUR_SUPPORT_EMAIL
            </a>
          </section>
        </div>

        <footer className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mail Agent. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
