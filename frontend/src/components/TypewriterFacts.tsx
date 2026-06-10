"use client";

import { useEffect, useState } from "react";

const TYPE_SPEED = 35;
const ERASE_SPEED = 20;
const PAUSE_DURATION = 5000;

export default function TypewriterFacts({ facts }: { facts: string[] }) {
  const [factIndex, setFactIndex] = useState(0);
  const [displayLength, setDisplayLength] = useState(0);
  const [phase, setPhase] = useState<"typing" | "erasing">("typing");

  const currentFact = facts[factIndex];

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayLength < currentFact.length) {
        timeout = setTimeout(() => setDisplayLength((l) => l + 1), TYPE_SPEED);
      } else {
        timeout = setTimeout(() => setPhase("erasing"), PAUSE_DURATION);
      }
    } else {
      if (displayLength > 0) {
        timeout = setTimeout(() => setDisplayLength((l) => l - 1), ERASE_SPEED);
      } else {
        timeout = setTimeout(() => {
          setFactIndex((i) => (i + 1) % facts.length);
          setPhase("typing");
        }, 200);
      }
    }

    return () => clearTimeout(timeout);
  }, [phase, displayLength, currentFact, facts.length]);

  return (
    <p
      className="font-[family-name:var(--font-display)] font-bold text-center mx-auto transition-opacity duration-300"
      style={{
        fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
        lineHeight: 1.4,
        letterSpacing: "-0.01em",
        color: "#FFFFFF",
        maxWidth: "700px",
        minHeight: "calc(1.4em * 6)",
        opacity: phase === "erasing" ? 0.4 : 1,
      }}
    >
      {currentFact.slice(0, displayLength)}
      <span className="typewriter-cursor" style={{ color: "#4A7C59" }}>
        |
      </span>
    </p>
  );
}
