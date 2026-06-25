"use client";

import { useState, useEffect } from "react";
import type { HeroQuote } from "@/lib/data";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuoteCarousel({ quotes }: { quotes: HeroQuote[] }) {
  // Start in the server-rendered order to avoid a hydration mismatch,
  // then shuffle client-side once mounted.
  const [shuffledQuotes, setShuffledQuotes] = useState(quotes);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);

  useEffect(() => {
    setShuffledQuotes(shuffle(quotes));
  }, [quotes]);

  useEffect(() => {
    if (shuffledQuotes.length < 2) return;
    const interval = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIndex((i) => (i + 1) % shuffledQuotes.length);
        setQuoteVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, [shuffledQuotes.length]);

  const quote = shuffledQuotes[quoteIndex];

  return (
    <div style={{ minHeight: 460, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {quote && (
        <div
          style={{
            transition: "opacity 0.4s ease, transform 0.4s ease",
            opacity: quoteVisible ? 1 : 0,
            transform: quoteVisible ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <p
            className="mb-5"
            style={{
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(22px, 4vw, 36px)",
              color: "#111",
              lineHeight: 1.25,
            }}
          >
            &ldquo;{quote.text}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-[12px] font-semibold leading-none"
              style={{
                fontFamily: "Inter, sans-serif",
                background: quote.color,
                color: quote.textColor,
              }}
            >
              {quote.school}
            </span>
            <span
              className="text-[12px]"
              style={{ fontFamily: "Inter, sans-serif", color: "#666" }}
            >
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
