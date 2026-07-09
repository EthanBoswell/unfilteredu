import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — UnfilteredU",
};

const SECTIONS = [
  {
    number: "1.1",
    title: "Data Collected via Single Sign-On (SSO)",
    items: [
      { label: "Authentication Data", text: "We use Clerk to manage user accounts." },
      {
        label: "Google SSO",
        text: "When you sign in with Google, we collect your email address, name, and profile picture.",
      },
      { label: "Review Content", text: "We collect the text reviews, ratings, and comments you submit." },
    ],
  },
  {
    number: "1.2",
    title: "Data Collected by Ad Networks & Analytics",
    items: [
      {
        label: "Tracking Technologies",
        text: "Our third-party ad partners use cookies, web beacons, and mobile ad identifiers.",
      },
      {
        label: "Data Points",
        text: "These networks automatically collect your IP address, browser type, and browsing behavior.",
      },
      {
        label: "Targeted Advertising",
        text: "This data is used to serve personalized ads based on your interests.",
      },
    ],
  },
  {
    number: "1.3",
    title: "Paid Content & Payment Processing",
    items: [
      { label: "No Financial Storage", text: "We do not store or process your credit card numbers." },
      {
        label: "Third-Party Processors",
        text: "All paid content transactions are handled securely by our payment processor (e.g., Stripe).",
      },
      {
        label: "Billing Details",
        text: "They provide us only with confirmation of payment and basic billing details (e.g., zip code).",
      },
    ],
  },
  {
    number: "1.4",
    title: "State-Specific Opt-Out Rights",
    items: [
      {
        label: "Do Not Sell My Info",
        text: 'Under the California CCPA and other state laws, sharing data for targeted ads is considered a "sale" or "sharing."',
      },
      {
        label: "Opt-Out Mechanism",
        text: 'Users can opt out of personalized tracking via our "Do Not Sell/Share My Personal Information" link or through browser privacy controls (GPC).',
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F4EF" }}>
      <Nav />

      <section className="px-8 pt-16 pb-0 flex-grow">
        <div className="mx-auto max-w-[720px]">
          <p
            className="text-[11px] font-bold uppercase mb-4"
            style={{
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.12em",
              color: "#999",
            }}
          >
            Legal
          </p>
          <h1
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 6vw, 4rem)",
              letterSpacing: "-0.02em",
              color: "#0F0F0F",
              lineHeight: 1.1,
            }}
          >
            Privacy Policy
          </h1>
          <p
            className="mt-3 text-[13px]"
            style={{ fontFamily: "Inter, sans-serif", color: "#999" }}
          >
            Effective Date: July 9, 2026
          </p>
          <div className="mt-5 w-12 h-px" style={{ background: "#e0ddd6" }} />
        </div>
      </section>

      <section className="px-8 pt-16 pb-[72px]">
        <div className="mx-auto max-w-[720px]">
          {SECTIONS.map((section) => (
            <div key={section.number} className="mb-10">
              <p
                className="mb-3"
                style={{
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color: "#0F0F0F",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                }}
              >
                {section.number} {section.title}
              </p>
              <ul className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <li
                    key={item.label}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: 15,
                      color: "#444",
                      lineHeight: 1.7,
                    }}
                  >
                    <strong style={{ color: "#0F0F0F", fontWeight: 600 }}>{item.label}:</strong>{" "}
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
