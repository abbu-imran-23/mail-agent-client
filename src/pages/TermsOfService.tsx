import { Link } from "react-router";
import { FileText, ArrowLeft, Mail } from "lucide-react";

const TermsOfService = () => {
  const lastUpdated = "November 25, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <FileText className="h-6 w-6" />
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
          <h1 className="text-4xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
          <p className="mt-6 leading-7 text-muted-foreground">
            Welcome to Mail Agent. These Terms of Service ("Terms") govern your
            access to and use of the Mail Agent application. By accessing or
            using the Service, you agree to these Terms.
          </p>
        </div>

        <div className="space-y-9 leading-7">
          <section>
            <h2 className="mb-3 text-xl font-semibold">1. About Mail Agent</h2>
            <p className="text-muted-foreground">
              Mail Agent is an AI-assisted email productivity application that
              integrates with Google Gmail to help users manage email workflows,
              prepare email drafts, and perform email-related tasks.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              2. Eligibility and Accounts
            </h2>
            <p className="text-muted-foreground">
              You must be legally permitted to use the Service in your
              jurisdiction. You are responsible for maintaining the
              confidentiality of your account credentials and for activities
              performed through your account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              3. Google Account Integration
            </h2>
            <p className="text-muted-foreground">
              Certain features require you to connect a Google account. By
              connecting Gmail, you authorize Mail Agent to access the Google
              data and permissions described during the Google authorization
              process.
            </p>
            <p className="mt-3 text-muted-foreground">
              Your use of Google services remains subject to Google's applicable
              terms and policies. You may revoke Mail Agent's access through
              your Google Account settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              4. AI-Generated Content
            </h2>
            <p className="text-muted-foreground">
              Mail Agent may use artificial intelligence to generate
              suggestions, email drafts, summaries, and other content.
              AI-generated content may be inaccurate, incomplete, misleading, or
              inappropriate.
            </p>
            <p className="mt-3 text-muted-foreground">
              You are responsible for reviewing and verifying AI-generated
              content before relying on it or sharing it with others.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              5. Email Sending and User Approval
            </h2>
            <p className="text-muted-foreground">
              You are responsible for reviewing the recipient, subject, and body
              of an email before authorizing it to be sent. Where the
              application provides a confirmation step, an email is sent only
              after you approve that action.
            </p>
            <p className="mt-3 text-muted-foreground">
              Once an email has been sent, Mail Agent may not be able to recall
              or reverse its delivery. You are responsible for ensuring that
              your communications are lawful and appropriate.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">6. Acceptable Use</h2>
            <p className="text-muted-foreground">You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Use Mail Agent for unlawful activities.</li>
              <li>Send spam, phishing messages, or malicious content.</li>
              <li>Attempt unauthorized access to accounts or systems.</li>
              <li>Abuse, disrupt, or interfere with the Service.</li>
              <li>
                Violate Google's terms or applicable third-party policies.
              </li>
              <li>
                Use the Service in a way that infringes another person's rights.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              7. Third-Party Services
            </h2>
            <p className="text-muted-foreground">
              Mail Agent depends on third-party services, including Google,
              authentication providers, hosting platforms, database providers,
              and AI model providers.
            </p>
            <p className="mt-3 text-muted-foreground">
              We are not responsible for interruptions, changes, or policies
              imposed by third-party providers. Your use of those services may
              be governed by their own terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              8. Availability and Changes
            </h2>
            <p className="text-muted-foreground">
              We may modify, suspend, or discontinue parts of the Service at any
              time. We do not guarantee uninterrupted availability or error-free
              operation.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              9. Disclaimer and Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              The Service is provided on an "as is" and "as available" basis, to
              the extent permitted by applicable law. We do not guarantee the
              accuracy or reliability of AI-generated content.
            </p>
            <p className="mt-3 text-muted-foreground">
              To the extent permitted by applicable law, Mail Agent shall not be
              liable for indirect, incidental, special, or consequential damages
              arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">10. Termination</h2>
            <p className="text-muted-foreground">
              We may suspend or terminate access if you violate these Terms,
              misuse the Service, or create security or legal risks. You may
              stop using Mail Agent at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">
              11. Changes to These Terms
            </h2>
            <p className="text-muted-foreground">
              We may update these Terms from time to time. Updated Terms will be
              published on this page with a revised effective date. Continued
              use of the Service after changes take effect constitutes
              acceptance, where permitted by law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold">12. Contact</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms, contact us at:
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

export default TermsOfService;
