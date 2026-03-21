"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What is ShortsVid and how does it work?",
    answer:
      "ShortsVid is an AI-powered short video generator. You provide a topic or idea, and our AI writes the script, selects visuals, generates a realistic voiceover, adds captions, and renders a fully-produced short video — ready to publish on YouTube Shorts, TikTok, or Instagram Reels.",
  },
  {
    question: "What are credits and how are they used?",
    answer:
      "Credits are the currency for generating videos. Each video you generate costs a set number of credits depending on length and complexity. Basic plans include 150 credits/month and Pro plans include 500 credits/month. Yearly plans credit the full annual amount upfront.",
  },
  {
    question: "Can I cancel or change my plan anytime?",
    answer:
      "Yes — absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your dashboard. There are no lock-ins or cancellation fees.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! All plans include a 7-day free trial. No credit card is required to start your trial — just sign up and start generating shorts.",
  },
  {
    question: "What video formats and resolutions are supported?",
    answer:
      "Basic plan exports in 720p MP4. Pro plan exports in 1080p MP4, optimized for vertical short-form content (9:16 aspect ratio). All exports are fully compatible with YouTube Shorts, TikTok, and Instagram Reels.",
  },
  {
    question: "Can I use my own voiceover or upload footage?",
    answer:
      "Pro plan users can upload custom background footage and use our voice cloning feature to match a specific voice style. Basic users have access to our full library of 50+ pre-built AI voices.",
  },
  {
    question: "Does ShortsVid support languages other than English?",
    answer:
      "Yes! We support 20+ languages including Hindi, Spanish, French, German, Portuguese, Italian, and more. Our AI voices are available in all supported languages.",
  },
  {
    question: "How do I publish directly to social platforms?",
    answer:
      "Pro plan users can connect their YouTube, TikTok, and Instagram accounts from the dashboard and publish or schedule videos directly from ShortsVid. No manual downloading and uploading needed.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-secondary text-secondary-foreground"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-secondary-foreground/20 text-secondary-foreground/70"
          >
            <MessageCircle className="w-3.5 h-3.5 mr-2" />
            FAQ
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-secondary-foreground text-balance mb-4">
            Common questions
          </h2>
          <p className="text-secondary-foreground/60 text-lg">
            Everything you need to know about ShortsVid. Can't find an answer?{" "}
            <a
              href="mailto:support@shortsvid.pro"
              className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Reach out
            </a>
            .
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="border border-secondary-foreground/10 rounded-xl px-5 bg-secondary-foreground/5 hover:bg-secondary-foreground/8 transition-colors data-[state=open]:bg-secondary-foreground/8"
                >
                  <AccordionTrigger className="text-left text-base font-semibold text-secondary-foreground hover:no-underline py-5 gap-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-secondary-foreground/70 text-sm leading-relaxed pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
