export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:mt-24 mt-20 py-10 text-foreground">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">About Us</h1>
      <p className="text-muted-foreground text-sm mb-12">
        Building the future of short-form video creation
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">What is ShortsVid?</h2>
        <p className="text-muted-foreground leading-relaxed">
          ShortsVid.pro is an AI-powered short video generator that transforms
          your ideas into fully produced, ready-to-publish videos in seconds.
          Whether you're a creator, educator, marketer, or storyteller — we make
          it effortless to produce high-quality faceless video content at scale.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          We believe great content shouldn't require a studio, a team, or hours
          of editing. Our mission is to democratize video creation — giving
          every person and business the tools to tell their story with
          compelling, cinematic short-form video, powered entirely by AI.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            AI-generated scripts tailored to your topic, tone, and audience.
          </li>
          <li>
            Cinematic visuals automatically matched to your script's narrative.
          </li>
          <li>Human-like voiceovers in multiple languages and styles.</li>
          <li>Animated captions with fully customizable styles and presets.</li>
          <li>
            One-click rendering and export — ready for YouTube, TikTok, and
            Instagram Reels.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Built for Creators</h2>
        <p className="text-muted-foreground leading-relaxed">
          From solo creators building an audience to brands publishing at scale,
          ShortsVid is designed to fit into your workflow. Generate a video in
          under a minute. Customize everything. Publish anywhere. We handle the
          heavy lifting so you can focus on what matters — your message.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Our Values</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            <span className="text-foreground font-medium">Transparency</span> —
            We're honest about what our AI does and how your data is used.
          </li>
          <li>
            <span className="text-foreground font-medium">Privacy-first</span> —
            Your content is yours. We never sell or share your data.
          </li>
          <li>
            <span className="text-foreground font-medium">Creator-centric</span>{" "}
            — Every feature is built with creators' real needs in mind.
          </li>
          <li>
            <span className="text-foreground font-medium">Quality</span> — We
            obsess over the details so your videos look and sound professional.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Get in Touch</h2>
        <p className="text-muted-foreground mb-1">
          Have questions, feedback, or just want to say hi?
        </p>
        <a
          href="mailto:yashrajv.work@gmail.com"
          className="text-primary hover:underline"
        >
          mail us
        </a>
      </section>
    </div>
  );
}
