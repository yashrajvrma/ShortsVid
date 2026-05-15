"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PostHogIdentify({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}) {
  useEffect(() => {
    if (posthog.get_distinct_id() === user.id) return;

    posthog.identify(user.id, {
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }, [user.id]);

  return null;
}
