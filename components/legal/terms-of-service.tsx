export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:mt-24 mt-20 py-10 text-foreground">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Terms of Service
      </h1>
      <p className="text-muted-foreground text-sm mb-12">
        Last updated: March 24, 2026
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Overview</h2>
        <p className="text-muted-foreground leading-relaxed">
          ShortsVid.pro is an AI-powered Shorts Video Generator that helps
          creators produce, manage, and publish short-form videos effortlessly.
          By using ShortsVid.pro, you agree to the following terms of service.
          Please read them carefully before accessing or using the platform.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Service Description</h2>
        <p className="font-medium mb-2">AI-Powered Video Generation</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            ShortsVid.pro uses AI models to generate scripts, voiceovers,
            captions, and video assets.
          </li>
          <li>
            All generated content is processed securely and is not shared with
            any third parties.
          </li>
          <li>
            You retain full ownership of the videos you generate using our
            platform.
          </li>
          <li>
            AI-generated outputs may vary — review all content before
            publishing.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">User Responsibilities</h2>
        <p className="font-medium mb-2">
          By using ShortsVid.pro, you agree to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            Comply with all applicable laws and regulations in your
            jurisdiction.
          </li>
          <li>Use ShortsVid.pro only for lawful, non-malicious purposes.</li>
          <li>
            Not generate offensive, illegal, harmful, or misleading video
            content.
          </li>
          <li>
            Not attempt to reverse-engineer, scrape, or abuse the platform's AI
            systems.
          </li>
          <li>Keep your account credentials secure and confidential.</li>
          <li>Report any security vulnerabilities responsibly to our team.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Data and Privacy</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            We collect your name, email, and profile picture for account
            personalization.
          </li>
          <li>
            All video generation data and AI interactions are kept private.
          </li>
          <li>We do not share or sell your personal data to third parties.</li>
          <li>
            Your generated videos are stored securely and accessible only by
            you.
          </li>
          <li>
            You can request deletion of your data at any time by contacting
            support.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Your Rights and Controls</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            Right to access and export your generated videos and account data.
          </li>
          <li>
            Right to request deletion of your account and all associated
            content.
          </li>
          <li>Right to revoke third-party integrations at any time.</li>
          <li>
            Right to contact us with privacy-related queries or complaints.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Contact</h2>
        <p className="text-muted-foreground mb-1">
          For questions about these terms:
        </p>
        <a
          href="mailto:support@shortsvid.pro"
          className="text-primary hover:underline"
        >
          support@shortsvid.pro
        </a>
      </section>
    </div>
  );
}
