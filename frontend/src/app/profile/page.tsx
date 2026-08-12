import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SearchSchoolsButton from "./SearchSchoolsButton";
import { createClient } from "@/lib/supabase/server";
import { getSchoolBySlug } from "@/lib/schools";
import { schoolColors } from "@/data/schoolColors";
import { deriveSchoolPalette } from "@/lib/palette";
import { loadSummary } from "@/lib/data";

export const metadata: Metadata = {
  title: "Your profile — UnfilteredU",
};

const ROLE_LABEL: Record<string, string> = { parent: "Parent", student: "Student" };
const STAGE_LABEL: Record<string, string> = { high_school: "High school", college: "College" };

type SavedSchoolRow = {
  id: string;
  created_at: string;
  schools: { id: string; name: string; slug: string; location: string } | null;
};

type RankedSchool = {
  id: string;
  name: string;
  slug: string;
  location: string;
  accent: string;
  accentDark: string;
  vibeScore: number | null;
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
    .select("id, created_at, schools ( id, name, slug, location )")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const savedSchools = (saved ?? []) as unknown as SavedSchoolRow[];

  const ranked: RankedSchool[] = await Promise.all(
    savedSchools
      .filter((row) => row.schools)
      .map(async (row) => {
        const { id, name, slug, location } = row.schools!;
        const meta = getSchoolBySlug(slug);
        const accent = schoolColors[slug]?.primary ?? meta?.colors.primary ?? "#0F0F0F";
        const palette = deriveSchoolPalette(accent);

        let vibeScore: number | null = null;
        try {
          const summary = await loadSummary(slug);
          vibeScore = summary.overall_vibe.score;
        } catch {
          vibeScore = null;
        }

        return {
          id,
          name,
          slug,
          location,
          accent,
          accentDark: palette.accentDark,
          vibeScore,
        };
      }),
  );

  ranked.sort((a, b) => (b.vibeScore ?? -1) - (a.vibeScore ?? -1));

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
        <div className="mx-auto max-w-[720px]">
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
            Your Profile
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

          <div className="flex items-center justify-between mt-10 mb-1">
            <h2
              style={{
                fontFamily: "var(--font-syne), 'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "-0.02em",
                color: "#0F0F0F",
              }}
            >
              Saved Schools
            </h2>
            <SearchSchoolsButton />
          </div>

          {ranked.length > 0 && (
            <p className="mb-4" style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#999" }}>
              Ranked by Overall Vibe score
            </p>
          )}

          {ranked.length === 0 ? (
            <p className="mt-4" style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#666" }}>
              You haven&rsquo;t saved any schools yet. Find one you like and hit save on its page.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {ranked.map((school, index) => (
                <Link
                  key={school.id}
                  href={`/schools/${school.slug}`}
                  className="flex items-center gap-4 rounded-lg pl-4 pr-5 py-3.5"
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e8e2",
                    borderLeft: `4px solid ${school.accent}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-syne), 'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: 15,
                      color: "#c4c4c0",
                      minWidth: 14,
                    }}
                  >
                    {index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#0F0F0F",
                        margin: 0,
                      }}
                    >
                      {school.name}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#888", margin: 0 }}>
                      {school.location}
                    </p>
                  </div>

                  {school.vibeScore !== null && (
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-syne), 'Syne', sans-serif",
                          fontWeight: 800,
                          fontSize: 20,
                          color: school.accentDark,
                          margin: 0,
                          lineHeight: 1,
                        }}
                      >
                        {school.vibeScore.toFixed(1)}
                      </p>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "#999",
                          margin: 0,
                        }}
                      >
                        Vibe
                      </p>
                    </div>
                  )}
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
