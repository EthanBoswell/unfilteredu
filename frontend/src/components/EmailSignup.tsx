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
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm font-semibold text-[#c9a052] text-center">
        You&rsquo;re on the list — we&rsquo;ll notify you when your school goes live.
      </p>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex overflow-hidden border border-white/10 max-w-sm mx-auto" style={{ borderRadius: "6px" }}>
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-3.5 text-sm text-white placeholder-white/25 bg-white/5 outline-none font-light"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-[#c9a052] hover:bg-[#b5883a] transition-colors text-[#1c1917] font-semibold px-5 py-3.5 text-sm shrink-0 disabled:opacity-50"
          >
            {status === "loading" ? "..." : "Notify Me"}
          </button>
        </div>
      </form>
      {status === "error" && (
        <p className="mt-3 text-xs text-[#be4b26] text-center font-light">
          Something went wrong — please try again.
        </p>
      )}
    </>
  );
}
