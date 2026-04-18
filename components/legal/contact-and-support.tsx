export default function ContactAndSupport() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:mt-24 mt-20 py-10 text-foreground">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Contact Us</h1>
      <p className="text-muted-foreground text-sm mb-12">
        We'd love to hear from you
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Get in Touch</h2>
        <p className="text-muted-foreground leading-relaxed">
          Whether you have a question about features, pricing, need technical
          support, or want to share feedback — we're here and happy to help. We
          aim to respond to all inquiries within 24–48 hours on business days.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Email</h2>
        <p className="text-muted-foreground mb-1">
          For general inquiries, support, and feedback:
        </p>
        <a
          href="mailto:yashrajv.work@gmail.com"
          className="text-primary hover:underline"
        >
          yashrajv.work@gmail.com
        </a>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">What to Include</h2>
        <p className="text-muted-foreground mb-3 leading-relaxed">
          To help us assist you faster, please mention the following when
          reaching out:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Your account email address.</li>
          <li>A brief description of your question or issue.</li>
          <li>Any relevant video IDs or screenshots if reporting a bug.</li>
          <li>Your subscription plan, if the query is billing-related.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Report an Issue</h2>
        <p className="text-muted-foreground leading-relaxed">
          Found a bug, a broken feature, or something that doesn't look right?
          Send us a detailed report at{" "}
          <a
            href="mailto:yashrajv.work@gmail.com"
            className="text-primary hover:underline"
          >
            yashrajv.work@gmail.com
          </a>{" "}
          and we'll investigate promptly. Your reports help us make ShortsVid
          better for everyone.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Privacy & Legal</h2>
        <p className="text-muted-foreground leading-relaxed">
          For GDPR, CCPA, data deletion requests, or any privacy-related
          concerns, please reach out via email with the subject line{" "}
          <span className="text-foreground font-medium">"Privacy Request"</span>{" "}
          and we will handle your request within the legally required timeframe.
        </p>
      </section>
    </div>
  );
}
