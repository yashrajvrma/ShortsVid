"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  // General
  {
    category: "General",
    q: "What is ShortsVid?",
    a: "ShortsVid is an AI-powered faceless short video generator. You pick a topic and a visual style, and the app writes the script, generates the voiceover, creates the visuals, adds captions, and puts it all together into a finished video ready to post. No editing skills needed.",
  },
  {
    category: "General",
    q: "Who is ShortsVid for?",
    a: "Content creators who want to post more without burning out, business owners who want to drive traffic through video, affiliate marketers, and anyone who wants consistent video output without doing it all manually.",
  },
  {
    category: "General",
    q: "What platforms can I post to?",
    a: "YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels. Every video is exported in 9:16 vertical format so it looks native on all of them. Generate once, post everywhere.",
  },
  // {
  //   category: "General",
  //   q: "Do you offer a free trial?",
  //   a: "Yes! You get a 3 day free trial to create videos, explore all the features, and see how it works before committing to a paid plan.",
  // },
  {
    category: "General",
    q: "Is AI generated content original? Is it plagiarism free?",
    a: "Yes, completely. Every script is generated fresh based on your inputs and every visual is created specifically for your video. Nothing is copied or pulled from existing content. The video is entirely yours to publish and monetize.",
  },
  {
    category: "General",
    q: "What kind of videos can I make?",
    a: "Horror stories, motivational speeches, history facts, philosophy breakdowns, mystery stories, life hacks, and more. Each video includes an AI voiceover, animated captions, background visuals, and optional background music.",
  },
  {
    category: "General",
    q: "Are my payments secure?",
    a: "Yes. All payments go through Polar, a trusted and secure payment processor. We never see or store your card details on our end.",
  },
  {
    category: "General",
    q: "Can I get a refund?",
    a: "We unfortunately cannot offer refunds because of the high generation costs for AI videos. You can cancel your subscription anytime.",
  },
  {
    category: "General",
    q: "Do you offer support?",
    a: "Yes, you can reach out anytime. We usually get back within 24 hours.",
  },

  // Strategy & Content
  {
    category: "Strategy & Content",
    q: "What should my content strategy look like?",
    a: "The idea is faceless content at scale. You create short videos consistently in a specific niche, provide real value to viewers, and let them discover your product or brand naturally through the content. The videos should feel organic, not like ads. Pick a niche, post regularly, and focus on content people actually want to watch and share. Over time the algorithm picks it up and the traffic compounds.",
  },
  {
    category: "Strategy & Content",
    q: "How often should I be posting?",
    a: "Start with 1 to 2 videos per day for the first couple of weeks. Once you are seeing consistent reach, you can scale to 2 or 3 a day. But 1 video a day done consistently beats 3 a day done sporadically. Since ShortsVid handles all the production, keeping up a daily schedule is very manageable.",
  },
  {
    category: "Strategy & Content",
    q: "What should my videos be about?",
    a: "Look at what is already getting views in your niche on TikTok and YouTube Shorts, then use ShortsVid to make your own version. Horror, motivational, history, and life hacks tend to work across almost any audience. Do not overthink it. Pick something, post consistently, and double down on what gets traction.",
  },
  {
    category: "Strategy & Content",
    q: "How can I promote my product through these videos?",
    a: "There are two approaches. A soft sell is when you mention your product casually within the content in a way that does not feel like an ad. Viewers feel like they discovered it themselves, which builds more trust. A direct CTA is when you tell people to check the link in bio, visit your site, or look up your app by name. Most successful creators mix both depending on the video.",
  },
  {
    category: "Strategy & Content",
    q: "Do I need to show my face?",
    a: "Not at all. ShortsVid creates fully faceless videos with AI visuals, voiceover, and captions. You never need to be on camera or record your own voice.",
  },
  {
    category: "Strategy & Content",
    q: "How long should my videos be?",
    a: "30 to 60 seconds is the sweet spot. Long enough to deliver value, short enough that people watch till the end. Watch time percentage matters a lot to the algorithm, so you want videos people actually finish.",
  },
  {
    category: "Strategy & Content",
    q: "Can I post the same video on multiple platforms?",
    a: "Yes and you should. Every video is in the 9:16 format which works natively on YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels. Same file, upload everywhere, more reach for the same effort.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="w-full sm:py-24 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center sm:mb-20 mb-12">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tighter text-foreground font-serif leading-[1.2]">
            Frequently Asked Questions
          </h2>
          {/* <p className="mt-3 text-base text-muted-foreground">
            Questions We Get Asked
          </p> */}
          <p className="mt-4 sm:text-xl text-base text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our AI video tools.
          </p>
        </div>

        {/* Accordion grouped by category */}
        <div className="w-full space-y-10">
          {[...new Set(FAQS.map((f) => f.category))].map((category) => (
            <div key={category}>
              {/* Category label */}
              <p className="text-base font-medium mb-2 ml-1">{category}</p>

              <Accordion
                type="multiple"
                className="w-full divide-y divide-border space-y-3"
              >
                {FAQS.filter((f) => f.category === category).map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`${category}-${i}`}
                    className="bg-card border-border border rounded-2xl px-5"
                  >
                    <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-6">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
