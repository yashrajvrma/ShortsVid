import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, MessageCircle } from "lucide-react";
import Navbar from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions | ShortsVid",
  description:
    "Everything you need to know about ShortsVid — faceless videos, AI voiceovers, captions, brainrot content, pricing, credits, and monetisation.",
  alternates: { canonical: "https://shortsvid.pro/faq" },
};

// ─── FAQ data ────────────────────────────────────────────────────────────────

const FAQ_CATEGORIES = [
  {
    id: "about",
    label: "About ShortsVid",
    faqs: [
      {
        q: "What is ShortsVid?",
        a: "ShortsVid is an AI-powered faceless short video generator. You pick a topic and a visual style, and the platform writes the script, generates the voiceover, creates visuals, adds animated captions, and renders a finished video ready to post. No camera, no microphone, no editing skills required.",
      },
      {
        q: "Who is ShortsVid for?",
        a: "ShortsVid is built for content creators who want to post more without burning out, business owners who want video traffic, affiliate marketers, and anyone who wants a consistent video output without doing everything manually.",
      },
      {
        q: "What platforms can I post to?",
        a: "Every video is exported in 9:16 vertical format — the native ratio for YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels. Generate once, post everywhere.",
      },
      {
        q: "Is AI-generated content original and plagiarism-free?",
        a: "Yes, completely. Every script is generated fresh based on your inputs, and every visual is created specifically for your video. Nothing is copied from existing content — the video is entirely yours to publish and monetise.",
      },
      {
        q: "Do I need any technical or editing skills?",
        a: "Not at all. ShortsVid is designed so that anyone can produce professional-looking videos. Most users are generating their first video within 5 minutes of signing up.",
      },
      {
        q: "Is my data safe with ShortsVid?",
        a: "Yes. We use industry-standard encryption and security measures to protect your account and generated content. We never share your data with third parties without your explicit consent.",
      },
    ],
  },
  {
    id: "faceless-videos",
    label: "Faceless Videos",
    faqs: [
      {
        q: "What is a faceless YouTube Short?",
        a: "A faceless YouTube Short is a short-form video (under 60 seconds) that doesn't show the creator's face. Instead, it uses an AI voiceover, stock footage, gameplay clips, or animated visuals paired with on-screen captions. Faceless channels are one of the fastest-growing niches on YouTube in 2025.",
      },
      {
        q: "Do I need to appear on camera or record my own voice?",
        a: "No. ShortsVid creates fully faceless videos using AI voices, AI-generated visuals, and automated captions. You never need to be on camera or record audio yourself.",
      },
      {
        q: "What background video styles are available?",
        a: "ShortsVid offers multiple background styles including Minecraft parkour, Subway Surfers gameplay, satisfying nature footage, and more. New styles are added regularly. You can preview each style before generating.",
      },
      {
        q: "How many AI voices are available?",
        a: "ShortsVid includes 50+ premium AI voices across multiple languages and accents. You can filter by gender and language, search by name, and preview each voice before selecting.",
      },
      {
        q: "What languages does ShortsVid support?",
        a: "ShortsVid currently supports English, German, French, Russian, Japanese, and Chinese — with more languages being added. The AI will also detect a language mismatch between the selected voice and the generated script and flag it for you.",
      },
      {
        q: "How long does it take to generate a faceless Short?",
        a: "Most videos are ready in under 3–5 minutes. The AI writes the script, generates the voiceover, syncs captions, and assembles the final video automatically.",
      },
      {
        q: "How long should my videos be?",
        a: "30–60 seconds is the sweet spot. Long enough to deliver real value, short enough that people watch to the end. Watch time percentage matters a lot to the algorithm, so you want videos people actually finish.",
      },
      {
        q: "Can I edit the script before generating the video?",
        a: "Absolutely. You can let the AI write the script, make manual edits, or paste a completely pre-written script. The video will use only the exact text you approve — up to 1,200 characters.",
      },
      {
        q: "Can I add background music?",
        a: "Yes. ShortsVid includes a library of royalty-free background music tracks you can add to any video. You can also choose to generate with no music.",
      },
      {
        q: "What caption styles are available?",
        a: "ShortsVid offers multiple animated caption presets including Alex Hormozi style, TikTok Yellow, Purple Pill, Neon Glow, Comic Bold, Minimal Clean, Viral Green, and Storyteller. Every setting — font, size, colour, position, animation — is fully customisable.",
      },
    ],
  },
  {
    id: "content-strategy",
    label: "Content Strategy",
    faqs: [
      {
        q: "What content strategy should I follow?",
        a: "The idea is faceless content at scale. Create short videos consistently in a specific niche, provide real value to viewers, and let them discover your brand naturally. Pick a niche, post regularly, and focus on content people actually want to watch and share. Over time the algorithm picks it up and the traffic compounds.",
      },
      {
        q: "How often should I be posting?",
        a: "Start with 1–2 videos per day for the first couple of weeks. Once you're seeing consistent reach, you can scale to 2–3 a day. But 1 video a day done consistently beats 3 a day done sporadically. Since ShortsVid handles all the production, keeping up a daily schedule is very manageable.",
      },
      {
        q: "What topics perform best?",
        a: "Horror stories, motivational speeches, history facts, philosophy breakdowns, mystery stories, and life hacks tend to work across almost any audience. Look at what is already getting views in your niche on TikTok and YouTube Shorts, then use ShortsVid to create your own version.",
      },
      {
        q: "Can I post the same video on multiple platforms?",
        a: "Yes — and you should. Every video is in 9:16 format, which works natively on YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels. Same file, upload everywhere, more reach for the same effort.",
      },
      {
        q: "How can I promote a product through these videos?",
        a: "There are two approaches. A soft sell: mention your product casually within the content so it doesn't feel like an ad. A direct CTA: tell people to check the link in bio, visit your site, or search your app by name. Most successful creators mix both depending on the video.",
      },
      {
        q: "How much control do I have over the AI-generated content?",
        a: "You remain fully in control. You can edit AI-generated scripts, choose specific voices, select background visuals, and adjust captions. The AI provides a high-quality starting point you can customise before the video is generated.",
      },
    ],
  },
  {
    id: "earnings",
    label: "Earning & Monetisation",
    faqs: [
      {
        q: "Can I monetise faceless YouTube Shorts?",
        a: "Yes. Faceless Shorts are eligible for YouTube Partner Program monetisation as long as the content is original. Since ShortsVid generates unique scripts and voiceovers for each video, your content qualifies as original. Always review YouTube's monetisation policies before applying.",
      },
      {
        q: "Do I own the commercial rights to generated videos?",
        a: "Yes, 100%. You own full commercial rights to every video you generate with ShortsVid. You can post them on YouTube, TikTok, Instagram, Facebook, or use them for client work. There are no hidden ownership clauses.",
      },
      {
        q: "How much can I earn from faceless content?",
        a: "Earnings vary widely depending on your niche, posting frequency, and platform. Creators who post consistently in high-CPM niches (finance, motivation, history) typically see the best results. Many faceless channels reach $1,000–$10,000/month within 6–12 months of consistent posting.",
      },
      {
        q: "What are the best niches for monetisation?",
        a: "Finance, investing, productivity, and business tend to have the highest CPM on YouTube. Horror, mystery, and motivational content tend to generate the highest view counts and follower growth. The best strategy is to combine a high-volume topic with a high-CPM niche.",
      },
      {
        q: "Can I use these videos for client work?",
        a: "Yes. Many ShortsVid users run content agencies and generate videos for clients. You own the output and can use it commercially without restriction.",
      },
      {
        q: "Can I sell the videos as digital products?",
        a: "Yes. Some creators package their faceless video templates and workflows as digital courses or products. The videos themselves can be used however you see fit once generated.",
      },
    ],
  },
  {
    id: "brainrot",
    label: "Brainrot Videos",
    faqs: [
      {
        q: "What is a brainrot video?",
        a: "Brainrot videos are a viral short-form content trend characterised by fast-paced editing, chaotic on-screen elements (like Minecraft parkour or Subway Surfers), and absurdist or comedic voiceover narration. They are designed to be highly watchable and shareable, especially on TikTok and YouTube Shorts.",
      },
      {
        q: "Can I create brainrot videos on ShortsVid?",
        a: "Yes. ShortsVid's background video styles — including Minecraft parkour and Subway Surfers — are specifically designed for the brainrot aesthetic. You can pair them with any AI voice and script style.",
      },
      {
        q: "What makes a good brainrot script?",
        a: "Good brainrot content tends to feature rapid-fire facts, absurd hypotheticals, controversial opinion takes, or dramatic storytelling. The key is to keep every sentence punchy and immediately engaging — no slow build-ups.",
      },
      {
        q: "Is brainrot content monetisable?",
        a: "Yes. Brainrot channels frequently reach millions of views per month and qualify for YouTube Partner Program monetisation. Because the content is AI-generated and original, it meets YouTube's originality requirements.",
      },
      {
        q: "Are Italian brainrot videos supported?",
        a: "Italian brainrot is a specific viral trend featuring chaotic AI-generated Italian characters. Dedicated Italian brainrot generation is on the ShortsVid roadmap and coming soon as a dedicated tool.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Credits",
    faqs: [
      {
        q: "Is ShortsVid free to use?",
        a: "Yes — you can explore the full tool without signing up. Creating and downloading generated videos requires a free account, which comes with starter credits. Paid plans are available for creators needing higher monthly volume.",
      },
      {
        q: "How does the credit system work?",
        a: "Each video you generate costs 5 credits. Credits are allocated monthly based on your plan. Unused credits will roll over to the next month.",
      },
      {
        q: "What happens if I run out of credits?",
        a: "Once your credits run out, you can upgrade to a higher plan to continue generating videos. Your existing generated videos remain accessible in your library regardless of credit balance.",
      },
      {
        q: "Are my payments secure?",
        a: "Yes. All payments are processed through Polar, a trusted and secure payment processor. ShortsVid never sees or stores your card details.",
      },
      {
        q: "Can I cancel my subscription at any time?",
        a: "Yes. You can cancel your subscription at any time from your account settings. You will retain access to your plan's features until the end of the current billing period.",
      },
      {
        q: "Can I get a refund?",
        a: "Because of the high computational cost of AI video generation, we are unable to offer refunds on used credits. You can cancel your subscription at any time to prevent future charges.",
      },
      {
        q: "Do you offer annual plans?",
        a: "Yes. Annual plans are available at a significant discount compared to monthly billing. Visit the pricing page for current plan details.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    faqs: [
      {
        q: "What technical requirements do I need to use ShortsVid?",
        a: "ShortsVid is entirely cloud-based and works in any modern browser (Chrome, Safari, Edge, Firefox). No downloads or installations are required. All video rendering happens on our servers, so you don't need a powerful device.",
      },
      {
        q: "What video format are generated videos exported in?",
        a: "All videos are rendered as MP4 files in 9:16 vertical format (1080×1920), which is the standard for YouTube Shorts, TikTok, and Instagram Reels.",
      },
      {
        q: "Can I download my generated videos?",
        a: "Yes. Once your video has finished generating, it will appear in your video library where you can preview and download it directly.",
      },
      {
        q: "How long does video rendering take?",
        a: "Rendering typically completes in 1-2 minutes depending on script length and current server load. You will be notified when your video is ready.",
      },
      {
        q: "What is the maximum script length?",
        a: "Scripts are capped at 1,200 characters. This length typically corresponds to a 30–60 second video depending on voice speed. The editor shows a live character counter.",
      },
    ],
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_CATEGORIES.flatMap((cat) =>
    cat.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  ),
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={faqSchema} />
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="inline-flex items-center gap-1.5 border border-border text-xs font-medium px-3 py-1.5 rounded-full mb-6 text-muted-foreground">
          <LifeBuoy className="w-3.5 h-3.5" />
          Help Center
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
          Everything you need to know about ShortsVid. Can&apos;t find what
          you&apos;re looking for?{" "}
          <a
            href="mailto:yashrajv.work@gmail.com"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            Contact our support team.
          </a>
        </p>
      </section>

      {/* ── Category pills ── */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {FAQ_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:text-primary transition-colors"
            >
              {cat.label}
            </a>
          ))}
        </div>
      </section>

      {/* ── FAQ sections ── */}
      <section className="max-w-3xl mx-auto px-4 pb-20 space-y-14">
        {FAQ_CATEGORIES.map((cat) => (
          <div key={cat.id} id={cat.id} className="scroll-mt-28">
            <h2 className="text-xl font-semibold tracking-tight text-foreground mb-5 pb-3">
              {cat.label}
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {cat.faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`${cat.id}-${i}`}
                  className="bg-card border border-border rounded-2xl px-5"
                >
                  <AccordionTrigger className="text-left text-lg font-medium text-foreground py-4 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-4 pt-0">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </section>

      {/* ── Still have questions CTA ── */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="bg-card border border-border rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-base mb-1">
              Still have questions?
            </h3>
            <p className="text-sm text-muted-foreground">
              Our support team typically responds within 24 hours.
            </p>
          </div>
          <Link
            href="mailto:yashrajv.work@gmail.com"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors shrink-0"
          >
            Contact Support
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
