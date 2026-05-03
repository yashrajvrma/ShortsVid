// import {
//   Body,
//   Container,
//   Head,
//   Heading,
//   Html,
//   Preview,
//   Text,
//   Button,
//   Tailwind,
// } from "@react-email/components";

// interface WelcomeEmailProps {
//   name: string;
// }

// export default function WelcomeEmail({ name }: WelcomeEmailProps) {
//   return (
//     <Html>
//       <Head />
//       <Preview>Welcome to ShortsVid!</Preview>
//       <Tailwind>
//         <Body className="bg-white my-auto mx-auto font-sans">
//           <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
//             <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
//               Welcome to <strong>ShortsVid</strong>
//             </Heading>
//             <Text className="text-black text-[14px] leading-[24px]">
//               Hello {name},
//             </Text>
//             <Text className="text-black text-[14px] leading-[24px]">
//               We're thrilled to have you on board. ShortsVid makes it incredibly
//               easy to generate high-quality video content using AI. Get ready to
//               scale your video production and capture your audience's attention!
//             </Text>
//             <Button
//               className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-4 py-3 mt-4"
//               href="https://shortsvid.pro/app"
//             >
//               Generate your first video
//             </Button>
//             <Text className="text-black text-[14px] leading-[24px] mt-[24px]">
//               If you have any questions, simply reply to this email. We're here
//               to help.
//             </Text>
//           </Container>
//         </Body>
//       </Tailwind>
//     </Html>
//   );
// }

// WelcomeEmail.PreviewProps = {
//   name: "John Doe",
// } satisfies WelcomeEmailProps;

import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Text,
  Link,
  Hr,
  Tailwind,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to ShortsVid - Let&apos;s get started!</Preview>
      <Tailwind>
        <Body className="my-0 mx-auto font-sans">
          <Container className="text-[#111111] my-10 mx-auto py-8 px-7 max-w-[480px]">
            {/* Logo row — centered */}
            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              role="presentation"
            >
              <tr>
                <td align="center" className="pb-6">
                  <table cellPadding="0" cellSpacing="0" role="presentation">
                    <tr>
                      <td valign="middle" className="pr-1">
                        <Img
                          src="https://cdn.shortsvid.pro/images/shortsvid-logo.png"
                          alt="ShortsVid"
                          height="28"
                        />
                      </td>
                      <td valign="middle" className="text-base font-semibold">
                        ShortsVid
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            {/* Greeting */}
            <Text className="text-sm leading-6 m-0 mb-4">
              Hii <strong>{name},</strong>
            </Text>

            {/* Intro */}
            <Text className="text-sm leading-6 m-0 mb-4">
              I&apos;m Yashraj &ndash; thanks for joining ShortsVid.
            </Text>

            <Text className="text-sm leading-6 m-0 mb-4">
              ShortsVid makes it incredibly easy to generate viral faceless
              video using AI. Script, Visuals, Voiceover, Captions &mdash; all
              done by AI. No editing skills required!
            </Text>

            {/* CTA Button — full width */}
            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              role="presentation"
              className="my-5"
            >
              <tr>
                <td className="bg-orange-600">
                  <a
                    href="https://shortsvid.pro/app"
                    className="text-neutral-50 text-sm font-medium no-underline block py-3 text-center w-full"
                  >
                    Generate your first video
                  </a>
                </td>
              </tr>
            </table>

            {/* Follow-up text */}
            <Text className="text-sm leading-6 m-0 mb-4">
              If you need a feature that doesn&apos;t exist yet, just reply to
              this email. I&apos;m building based on what you need, and I&apos;d
              happily give you a quick personal demo.
            </Text>

            {/* Signature */}
            <Text className="text-sm leading-6 m-0 mb-4">
              Best
              <br />
              <strong>Yashraj</strong>
              <br />
              <span className="text-neutral-500 text-sm">
                Founder, ShortsVid
              </span>
            </Text>

            <Hr className="border-neutral-500 my-6" />

            {/* Footer */}
            <Text className="text-neutral-600 text-xs leading-5 text-center m-0 mb-1">
              You&apos;re receiving this because you signed up at{" "}
              <Link
                href="https://shortsvid.pro"
                className="text-neutral-500 underline"
              >
                shortsvid.pro
              </Link>
            </Text>
            <Text className="text-neutral-600 text-xs leading-5 text-center m-0 mb-1">
              &copy;2026 ShortsVid &ndash; Automate viral faceless shorts in
              seconds
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  name: "Name",
} satisfies WelcomeEmailProps;
