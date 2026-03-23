export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:mt-24 mt-20 py-10 text-foreground">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Privacy Policy
      </h1>
      <p className="text-muted-foreground text-sm mb-12">
        Last updated: March 24, 2026
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">
          Our Commitment to Privacy
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          At ShortsVid.pro, we believe privacy is a fundamental right. Our
          AI-powered video generation platform is built with user privacy at its
          core. We are committed to being fully transparent about how we handle
          your data. We do not share your personal information or content with
          any external company or third party — ever.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">What We Collect</h2>
        <p className="font-medium mb-2">
          We collect only what's necessary to provide the service:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            Your name, email address, and profile picture for account setup and
            personalization.
          </li>
          <li>
            Video generation history to enable access to your past creations.
          </li>
          <li>
            Basic usage analytics (page views, feature usage) to improve the
            platform — this data is fully anonymized.
          </li>
          <li>
            Billing and subscription details processed securely via our payment
            provider.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Account & Authentication</h2>
        <p className="font-medium mb-2">
          When you sign in with Google or another provider:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            We request access only to your name, email address, and profile
            picture.
          </li>
          <li>Your account credentials are never stored on our servers.</li>
          <li>
            We use secure OAuth 2.0 authentication provided by your auth
            provider.
          </li>
          <li>
            You can revoke access at any time through your provider's account
            settings.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Video Content Privacy</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            All videos you generate on ShortsVid.pro are private and accessible
            only by you.
          </li>
          <li>
            Your content is never shared, sold, or used for any AI training
            purpose.
          </li>
          <li>
            We do not retain AI-generated video data longer than necessary for
            functionality.
          </li>
          <li>
            Deleted videos are permanently removed from our systems within 30
            days.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">
          Data Protection and Security
        </h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            All data is encrypted at rest and in transit using industry-standard
            TLS/AES-256.
          </li>
          <li>
            User content is stored securely and never accessed without your
            explicit permission.
          </li>
          <li>
            We conduct regular security audits and vulnerability assessments.
          </li>
          <li>
            In the event of a data breach, we will notify affected users within
            72 hours.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Your Rights and Controls</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            Right to access and download all your personal data and generated
            videos.
          </li>
          <li>
            Right to request deletion of your account and all associated
            content.
          </li>
          <li>Right to revoke third-party access at any time.</li>
          <li>Right to opt out of anonymized analytics collection.</li>
          <li>
            Right to contact us with privacy-related questions or GDPR/CCPA
            requests.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Contact</h2>
        <p className="text-muted-foreground mb-1">
          For privacy-related questions or concerns:
        </p>
        <a
          href="mailto:privacy@shortsvid.pro"
          className="text-primary hover:underline"
        >
          support@shortsvid.pro
        </a>
      </section>
    </div>
  );
}
