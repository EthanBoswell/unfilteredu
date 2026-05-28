"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://formspree.io/f/mlgvzgan", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm font-semibold" style={{ color: "#3BB273" }}>
        You&rsquo;re on the list — we&rsquo;ll notify you when your school goes live. 🎉
      </p>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex rounded-full overflow-hidden shadow border border-slate-200 max-w-sm mx-auto">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-3.5 text-sm text-slate-700 placeholder-slate-400 bg-white outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-[#EF6C35] hover:bg-[#d45f2a] transition-colors text-white font-bold px-5 py-3.5 text-sm shrink-0 disabled:opacity-60"
          >
            {status === "loading" ? "..." : "Subscribe →"}
          </button>
        </div>
      </form>
      {status === "error" && (
        <p className="mt-3 text-sm font-medium" style={{ color: "#D62839" }}>
          Something went wrong, please try again.
        </p>
      )}
    </>
  );
}
