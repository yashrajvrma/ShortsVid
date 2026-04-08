"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Do we offer free trials?",
    a: "We don't offer free trials because it costs us money for every video generated. But compared to paying freelancers thousands or spending countless hours doing it yourself, ShortsVid is by far the most economical way to generate tons of amazing shorts fast.",
  },
  {
    q: "Is AI generated content good for SEO? Is it plagiarism free?",
    a: "Absolutely. We use a combination of AI and human curation to ensure that the content we generate is not only unique but also high quality. Every video is original and fully owned by you.",
  },
  {
    q: "What kind of videos can I create?",
    a: "You can create faceless AI shorts, gameplay videos, motivational content, educational clips, story-driven videos and much more — all fully automated with AI voiceover, captions and visuals.",
  },
  {
    q: "Do you offer support?",
    a: "Yes! You can reach us anytime. We typically respond within 24 hours and are happy to help with anything from billing to video generation issues.",
  },
  {
    q: "Are my payments secure?",
    a: "All payments are processed through Polar, one of the most secure payment processors in the world. We never store your payment information on our servers.",
  },
  {
    q: "Can I get a refund?",
    a: "Your satisfaction is our top priority and generating videos costs us money so we can't provide a refund. But you can cancel your subscription at any time.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="w-full sm:py-24 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center sm:mb-20 mb-12">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-foreground">
            Questions We Get Asked
          </h2>
          {/* <p className="mt-3 text-base text-muted-foreground">
            Questions We Get Asked
          </p> */}
        </div>

        {/* Accordion */}
        <Accordion type="multiple" className="w-full divide-y divide-border">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-none py-1"
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
    </section>
  );
}
