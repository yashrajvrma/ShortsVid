import { resend } from "@/lib/resend";
import { env } from "@/lib/env";

export async function sendWelcomeEmail(user: { name: string; email: string }) {
  try {
    const { default: WelcomeEmail } = await import("@/emails/welcome");

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: user.email,
      subject: "Welcome to ShortsVid! 🎉",
      react: WelcomeEmail({ name: user.name }),
    });
  } catch (error) {
    console.error("[sendWelcomeEmail] Failed to send welcome email:", error);
  }
}
