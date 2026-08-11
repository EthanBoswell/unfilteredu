import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Your profile — UnfilteredU",
};

const ROLE_LABEL: Record<string, string> = { parent: "Parent", student: "Student" };
const STAGE_LABEL: Record<string, string> = { high_school: "High school", college: "College" };

type SavedSchoolRow = {
  id: string;
  created_at: string;
  schools: { id: string; name: string; slug: string } | null;
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, stage, grad_year")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  const { data: saved } = await supabase
    .from("saved_schools")
    .select("id, created_at, schools ( id, name, slug )")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const savedSchools = (saved ?? []) as unknown as SavedSchoolRow[];

  const fieldLabelStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#999",
    marginBottom: 4,
  };

  const fieldValueStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif",
    fontSize: 15,
    color: "#0F0F0F",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F4EF" }}>
      <Nav />

      <section className="flex-1 px-8 py-16">
        <div className="mx-auto max-w-[560px]">
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
            Your profile
          </h1>

          <div
            className="rounded-xl p-8 mt-8"
            style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 12 }}
          >
            <div className="mb-5">
              <p style={fieldLabelStyle}>Email</p>
              <p style={fieldValueStyle}>{user.email}</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <p style={fieldLabelStyle}>I am a</p>
                <p style={fieldValueStyle}>{ROLE_LABEL[profile.role] ?? profile.role}</p>
              </div>
              <div>
                <p style={fieldLabelStyle}>Currently in</p>
                <p style={fieldValueStyle}>{STAGE_LABEL[profile.stage] ?? profile.stage}</p>
              </div>
              <div>
                <p style={fieldLabelStyle}>Graduation year</p>
                <p style={fieldValueStyle}>{profile.grad_year}</p>
              </div>
            </div>
          </div>

          <h2
            className="mt-10 mb-4"
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#0F0F0F",
            }}
          >
            Saved schools
          </h2>

          {savedSchools.length === 0 ? (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#666" }}>
              You haven&rsquo;t saved any schools yet. Find one you like and hit save on its page.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {savedSchools
                .filter((row) => row.schools)
                .map((row) => (
                  <Link
                    key={row.id}
                    href={`/schools/${row.schools!.slug}`}
                    className="rounded-lg px-5 py-3.5"
                    style={{
                      background: "#fff",
                      border: "1px solid #e8e8e2",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#0F0F0F",
                    }}
                  >
                    {row.schools!.name}
                  </Link>
                ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
