import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions — UnfilteredU",
};

const GENERAL_SECTIONS = [
  {
    number: "1.1",
    title: "General Disclaimer",
    items: [
      {
        label: "User-Generated Insights",
        text: "Insights are generated from publicly available online discussions and are intended for informational purposes. Opinions belong to their original authors and do not necessarily reflect the views of UnfilteredU.",
      },
    ],
  },
];

const TERMS_SECTIONS = [
  {
    number: "2.1",
    title: "Access to Paid Content & Subscriptions",
    items: [
      {
        label: "Paid Features",
        text: "Certain premium college insights, guides, or advanced features require a paid subscription or one-time payment.",
      },
      {
        label: "Billing Terms",
        text: "You agree to pay all applicable fees and taxes. All transactions are final, and refunds are handled at our sole discretion unless required by law.",
      },
      {
        label: "Account Revocation",
        text: "If your account is banned for violating our content rules, you forfeit access to any remaining paid content without a refund.",
      },
    ],
  },
  {
    number: "2.2",
    title: "Text-Only Review Rules (No Media Uploads)",
    items: [
      { label: "No File Uploads", text: "Users cannot upload photos, videos, school logos, or campus documents." },
      {
        label: "Platform Control",
        text: "School profiles and base institutional information are managed solely by UnfilteredU.co. Users may only post text-based feedback.",
      },
      {
        label: "Prohibited Text",
        text: "Reviews must not contain hate speech, explicit language, private personal data (doxxing), or defamatory statements targeting specific individuals.",
      },
    ],
  },
  {
    number: "2.3",
    title: "Account Security (Clerk & Google)",
    items: [
      {
        label: "Credential Safety",
        text: "Because authentication is handled via Clerk and Google, you are responsible for maintaining the security of your Google account.",
      },
      {
        label: "Unauthorized Access",
        text: "You must notify us immediately if you suspect any unauthorized access to your UnfilteredU.co profile.",
      },
    ],
  },
];

const DISCLOSURE_SECTIONS = [
  {
    number: "3.1",
    title: "Advertising Disclosure",
    items: [
      { label: "Third-Party Ads", text: "UnfilteredU.co displays advertisements served by third-party ad networks." },
      {
        label: "No Endorsement",
        text: "The appearance of an advertisement on our platform does not imply an endorsement of the product, service, or university being advertised.",
      },
    ],
  },
  {
    number: "3.2",
    title: "Paid Content Disclaimer",
    items: [
      {
        label: "Premium Insights",
        text: "Paid content and premium student guides are meant for informational purposes only.",
      },
      {
        label: "No Guarantees",
        text: "We do not guarantee admission, specific academic outcomes, or any scholarships based on the premium insights purchased on this application.",
      },
    ],
  },
];

function SectionGroup({
  sections,
}: {
  sections: typeof TERMS_SECTIONS;
}) {
  return (
    <>
      {sections.map((section) => (
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
                <strong style={{ color: "#0F0F0F", fontWeight: 600 }}>{item.label}:</strong> {item.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export default function TermsPage() {
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
            Terms &amp; Conditions
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
          <SectionGroup sections={GENERAL_SECTIONS} />
          <SectionGroup sections={TERMS_SECTIONS} />

          <div className="mb-10 pt-8" style={{ borderTop: "1px solid #e0ddd6" }}>
            <h2
              style={{
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                letterSpacing: "-0.02em",
                color: "#0F0F0F",
                lineHeight: 1.15,
              }}
            >
              Disclosure Statement for UnfilteredU.co
            </h2>
            <p
              className="mt-3 mb-8 text-[13px]"
              style={{ fontFamily: "Inter, sans-serif", color: "#999" }}
            >
              Effective Date: July 9, 2026
            </p>

            <SectionGroup sections={DISCLOSURE_SECTIONS} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
