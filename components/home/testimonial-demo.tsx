"use client";

import { Testimonial } from "../testimonial";

export function TestimonialDemo() {
  return (
    <Testimonial
      className="sm:my-16 my-10"
      quote="ShortsVid transformed how we create content. What used to take hours of editing now takes minutes — our channel grew 3x in just two months."
      highlightedText="ShortsVid"
      authorName="Alex Rivera"
      authorPosition="Content Creator, 500K+ Subscribers"
      authorImage="/images/testimonials/jsjjeoeoeoc.jpg"
    />
  );
}
