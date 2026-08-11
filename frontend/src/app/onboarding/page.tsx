import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import OnboardingForm from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Welcome — UnfilteredU",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/onboarding");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile) {
    redirect("/profile");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F4EF" }}>
      <Nav />

      <section className="flex-1 px-8 py-16">
        <div className="mx-auto max-w-[420px]">
          <h1
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              letterSpacing: "-0.02em",
              color: "#0F0F0F",
              lineHeight: 1.1,
            }}
          >
            A few quick questions
          </h1>
          <p
            className="mt-3 mb-8"
            style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#666" }}
          >
            Helps us tailor what you see. Takes about ten seconds.
          </p>

          <div
            className="rounded-xl p-8"
            style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 12 }}
          >
            <OnboardingForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
