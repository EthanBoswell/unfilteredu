import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { login, signInWithGoogle } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Log in — UnfilteredU",
};

const inputStyle: CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 15,
  color: "#0F0F0F",
  background: "#fff",
  border: "1px solid #e0ddd6",
  borderRadius: 8,
  padding: "10px 14px",
  width: "100%",
};

const labelStyle: CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  fontWeight: 600,
  color: "#444",
  marginBottom: 6,
  display: "block",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; email?: string }>;
}) {
  const { error, next, email } = await searchParams;

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
            Welcome back
          </h1>
          <p
            className="mt-3 mb-8"
            style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#666" }}
          >
            Log in to save schools and pick up where you left off.
          </p>

          <div
            className="rounded-xl p-8"
            style={{ background: "#fff", border: "1px solid #e8e8e2", borderRadius: 12 }}
          >
            {error && (
              <p
                className="mb-5 rounded-md px-3 py-2.5"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#b42318",
                  background: "#fef3f2",
                  border: "1px solid #fecdca",
                }}
              >
                {error}
              </p>
            )}

            <form action={login} className="flex flex-col gap-4">
              {next && <input type="hidden" name="next" value={next} />}
              <div>
                <label htmlFor="email" style={labelStyle}>Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" defaultValue={email} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="password" style={labelStyle}>Password</label>
                <input id="password" name="password" type="password" required autoComplete="current-password" style={inputStyle} />
              </div>
              <button
                type="submit"
                className="mt-2 rounded-md py-2.5"
                style={{
                  fontFamily: "var(--font-syne), 'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#F5F4EF",
                  background: "#0F0F0F",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Log in
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: "#e0ddd6" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#999" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "#e0ddd6" }} />
            </div>

            <form action={signInWithGoogle}>
              {next && <input type="hidden" name="next" value={next} />}
              <button
                type="submit"
                className="flex items-center justify-center gap-2.5 rounded-md py-2.5 w-full"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#0F0F0F",
                  background: "#fff",
                  border: "1px solid #e0ddd6",
                  cursor: "pointer",
                }}
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </form>
          </div>

          <p
            className="mt-6 text-center"
            style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#666" }}
          >
            Don&rsquo;t have an account?{" "}
            <Link href="/signup" style={{ color: "#0F0F0F", fontWeight: 600 }}>
              Sign up
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.96 11.96 0 000 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}
